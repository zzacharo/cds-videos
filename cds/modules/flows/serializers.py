from __future__ import absolute_import, print_function

from invenio_db import db
from invenio_files_rest.models import (
    as_object_version,
)
from sqlalchemy.orm.attributes import flag_modified
from flask import url_for

from .deposit import update_deposit_state
from ..flows.models import Status as FlowStatus

from .task_api import Task


class FlowResponseSerializer(object):
    """Flow serializer class."""

    @staticmethod
    def update(flow, version_id):
        """Update event response."""
        flow_id = str(flow.id)
        object_version = as_object_version(version_id)
        obj_tags = object_version.get_tags()
        obj_key = object_version.key
        obj_bucket_id = str(object_version.bucket_id)
        with db.session.begin_nested():
            flow.response.update(
                links={
                    'self': url_for(
                        'invenio_files_rest.object_api',
                        bucket_id=obj_bucket_id,
                        key=obj_key,
                        _external=True,
                    ),
                    'cancel': url_for(
                        'cds_webhooks.flow_item',
                        flow_id=flow_id,
                        _external=True,
                    ),
                },
                key=obj_key,
                version_id=version_id,
                tags=obj_tags,
            )
            flag_modified(flow.model, 'response')

    @staticmethod
    def update_tasks(flow):
        with db.session.begin_nested():
            flow.response.update(
                _tasks=FlowResponseSerializer.build_flow_status_json(flow.json)
            )

            flow.response_code = FlowStatus.status_to_http(flow.status)
            flag_modified(flow.model, 'response')
            flag_modified(flow.model, 'response_code')

    @staticmethod
    def update_global_status(flow):
        """Persist event and result after execution."""
        with db.session.begin_nested():
            flow.response.update(global_status=str(flow.status))
            flag_modified(flow.model, 'response')

        db.session.commit()
        update_deposit_state(deposit_id=flow.payload.get('deposit_id'))

    @staticmethod
    def serialize_result(flow):
        """Get the serialized flow status."""
        if flow.response_code == 410:
            # in case the flow has been removed
            # return what was already in the response
            return 201, flow.response
        flow.response_code = FlowStatus.status_to_http(flow.status)
        flag_modified(flow.model, "response_code")

        full_json = flow.json

        if 'tasks' in full_json:
            # Extract info and build correct status dict
            full_json = FlowResponseSerializer\
                .build_flow_status_json(full_json)
        return flow.response_code, full_json

    @staticmethod
    def build_flow_status_json(flow_json):
        """Build serialized status object."""
        status = ([], [])
        for task in flow_json['tasks']:
            task_status = Task.build_task_json_status(task)

            # Get the UI name of the task
            task_name = task_status["name"]
            assert task_name
            # Calculate the right position inside the tuple
            step = (
                0
                if task_name
                in ('file_download', 'file_video_metadata_extraction')
                else 1
            )

            status[step].append(task_status)

        return status