# -*- coding: utf-8 -*-
#
# This file is part of CERN Document Server.
# Copyright (C) 2020 CERN.
#
# CERN Document Server is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Document Server is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Document Server; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status

# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""CDS-Flow python API."""
import logging
from copy import deepcopy
from functools import wraps
from itertools import repeat

from cds_sorenson.api import get_all_distinct_qualities
from celery import chain as celery_chain
from celery import group as celery_group
from celery.result import AsyncResult
from invenio_db import db
from sqlalchemy.orm.attributes import flag_modified

from .files import _update_flow_bucket, init_object_version
from .models import Flow as FlowModel
from .models import Task as TaskModel
from .serializers import FlowResponseSerializer
from .task_api import Task
from .utils import uuid
from .tasks import ExtractMetadataTask, DownloadTask, \
    TranscodeVideoTask, ExtractFramesTask

logger = logging.getLogger('cds-flow')


class FlowWrapper(object):
    """Flow Model wrapper class."""

    def __init__(self, model=None):
        """Initialize the flow object."""
        self.model = model

    @property
    def id(self):
        """Get flow identifier."""
        return self.model.id if self.model else None

    @property
    def name(self):
        """Get flow name."""
        return self.model.name if self.model else None

    @property
    def payload(self):
        """Get flow payload."""
        return self.model.payload if self.model else None

    @payload.setter
    def payload(self, value):
        """Update payload."""
        if self.model:
            self.model.payload = value
            db.session.merge(self.model)

    @property
    def response(self):
        """Get flow payload."""
        return self.model.response if self.model else None

    @response.setter
    def response(self, value):
        """Update payload."""
        if self.model:
            self.model.response = value
            db.session.merge(self.model)

    @property
    def response_code(self):
        """Get flow payload."""
        return self.model.response_code if self.model else None

    @response_code.setter
    def response_code(self, value):
        """Update payload."""
        if self.model:
            self.model.response_code = value
            db.session.merge(self.model)

    @property
    def created(self):
        """Get creation timestamp."""
        return self.model.created if self.model else None

    @property
    def updated(self):
        """Get last updated timestamp."""
        return self.model.updated if self.model else None

    @property
    def json(self):
        """Get flow status."""
        if self.model is None:
            return None
        res = self.model.to_dict()
        res.update(
            {'tasks': [t.to_dict() for t in self.model.tasks]}
        )
        return res

    @property
    def status(self):
        return self.model.status if self.model else None

    @classmethod
    def get_flow(cls, id_):
        """Retrieve a Flow from the database by Id."""
        obj = FlowModel.get(id_)
        return cls(obj)

    @classmethod
    def create(cls, name, payload=None,
               id_=None, user_id=None,
               deposit_id=None):
        """Create a new flow instance and store it in the database.."""
        with db.session.begin_nested():
            obj = FlowModel(
                name=name,
                id=id_ or uuid(),
                payload=payload or dict(),
                user_id=user_id,
                deposit_id=deposit_id,
            )
            db.session.add(obj)
        logger.info('Created new Flow %s', obj)
        return cls(model=obj)


class Flow(FlowWrapper):
    """Flow controller class."""

    def __init__(self, model=None):
        """Initialize the flow object."""
        self.model = model

        self._tasks_map = {
            'file_video_metadata_extraction': ExtractMetadataTask,
            'file_download': DownloadTask,
            'file_transcode': TranscodeVideoTask,
            'file_video_extract_frames': ExtractFramesTask,
        }
        self._tasks = []
        # celery tasks "canvas", holds celery task with passed params,
        # ready to be started
        self._canvas = []

    def _new_task(self, task, kwargs, previous):
        """Create a new task associate with the flow."""
        task_id = uuid()
        kwargs = kwargs if kwargs else {}
        kwargs.update(dict(flow_id=str(self.id), task_id=task_id))
        kwargs.update(self.payload)
        kwargs.pop("flow", None)

        # signature wraps the arguments, keyword arguments, and execution
        # options of a single task invocation
        # Task is a function definition wrapped with decorator,
        # subtask is a task with parameters passed, but not yet started
        signature = task.subtask(
            task_id=task_id,
            kwargs=kwargs,
            immutable=True,
        )

        _ = TaskModel.create(
            id_=task_id,
            flow_id=self.id,
            name=task.name,
            previous=previous,
            payload=kwargs,
        )

        return signature

    def create_task(self, task_name, **kwargs):
        """Create a task with parameters from flow."""
        payload = deepcopy(self.payload)
        payload.update(**kwargs)
        return self._tasks_map[task_name](), payload

    def clean_task(self, task_name, *args, **kwargs):
        """Clean a task."""
        kwargs['version_id'] = self.payload['version_id']
        kwargs['deposit_id'] = self.payload['deposit_id']
        return self._tasks_map[task_name]().clean(*args, **kwargs)

    def _workflow(self, deposit_id, user_id, bucket_id, version_id, key,
                  uri=None):
        with db.session.begin_nested():
            flow = self.create(
                'AVCWorkflow',
                payload={
                    'deposit_id': deposit_id,
                    'bucket_id': bucket_id,
                    'version_id': version_id,
                    'key': key,
                    'uri': uri,

                },
                user_id=user_id,
                deposit_id=deposit_id,
            )
            flow.assemble()
        db.session.commit()
        return flow

    def build_steps(self):
        """Build flow's tasks.

        self._tasks = [(metadata_extraction, task_kwargs), <-- Step 1
                        [                                  <-- Step 2 runs next
        (frame_extraction, task_kwargs), (transcoding1, task_kwargs)<--parallel
                        ]
        ]
        """

        # First step
        has_remote_file_to_download = self.payload.get('uri')
        has_user_uploaded_file = self.payload.get('version_id')

        metadata_extraction_task = self.create_task(
            flow=self, task_name='file_video_metadata_extraction')

        if has_user_uploaded_file and not has_remote_file_to_download:

            self._tasks.append(metadata_extraction_task)
        else:
            file_download_task = self.create_task(flow=self,
                                                  task_name='file_download')

            parallel_tasks = [metadata_extraction_task, file_download_task]

            self._tasks.append(parallel_tasks)

        # Second step
        all_distinct_qualities = get_all_distinct_qualities()
        self.response['presets'] = all_distinct_qualities
        flag_modified(self.model, "response")

        # create tasks in parallel
        parallel_tasks_group = []
        video_extract_task = self.create_task(
            flow=self, task_name='file_video_extract_frames'
        )
        parallel_tasks_group.append(video_extract_task)
        for preset_quality in all_distinct_qualities:
            transcode_task = self.create_task(flow=self,
                                              task_name='file_transcode',
                                              preset_quality=preset_quality,
                                              )
            parallel_tasks_group.append(transcode_task)

        self._tasks.append(parallel_tasks_group)

    def assemble(self):
        """Build the canvas out of the task list."""
        if self.model is None:
            raise RuntimeError('No database flow object found.')
        if self.model.tasks:
            raise RuntimeError(
                'This flow instance was already assembled, use create'
                'to create a new instance and restart the flow.'
            )
        self.build_steps()

        previous = []
        for obj in self._tasks:

            is_single_task = isinstance(obj, tuple)
            is_group_of_tasks = isinstance(obj, list)

            if is_single_task:
                task, kwargs = obj
                signature = self._new_task(task, kwargs, previous=previous)
                self._canvas.append(signature)
                previous = [signature.id]
            elif is_group_of_tasks:
                sub_canvas = [
                    self._new_task(t, t_kwargs, previous=previous)
                    for t, t_kwargs in obj
                ]
                previous = [t.id for t in sub_canvas]
                self._canvas.append(celery_group(sub_canvas, task_id=uuid()))
            else:
                raise RuntimeError(
                    'Error while parsing the task list %s', self._tasks
                )

        self._canvas = celery_chain(*self._canvas, task_id=self.id)

        return self

    def start(self):
        """Start the flow asynchronously."""
        if not self._canvas:
            self.assemble()
        return self._canvas.apply_async()

    def run(self, deposit_id, user_id, version_id, bucket_id, key, uri=None):
        """Run workflow for video transcoding.

        Steps:
          * Download the video file (if not done yet).
          * Extract metadata from the video.
          * Run video transcoding.
          * Extract frames from the video.

        Mandatory fields in the payload:
          * uri, if the video needs to be downloaded.
          * bucket_id, only if URI is provided.
          * key, only if URI is provided.
          * version_id, if the video has been downloaded via HTTP (the previous
            fields are not needed in this case).
          * deposit_id

        Optional:
          * frames_start, if not set the default value will be used.
          * frames_end, if not set the default value will be used.
          * frames_gap, if not set the default value will be used.

        For more info see the tasks used in the workflow:
          * :func: `~cds.modules.webhooks.tasks.DownloadTask`
          * :func: `~cds.modules.webhooks.tasks.ExtractMetadataTask`
          * :func: `~cds.modules.webhooks.tasks.ExtractFramesTask`
          * :func: `~cds.modules.webhooks.tasks.TranscodeVideoTask`
        """

        flow = self._workflow(deposit_id=deposit_id,
                              user_id=user_id,
                              bucket_id=bucket_id,
                              version_id=version_id,
                              key=key, uri=uri)

        has_remote_file_to_download = flow.payload.get('uri')
        has_user_uploaded_file = flow.payload.get('version_id')
        has_file = has_remote_file_to_download or has_user_uploaded_file
        has_deposit = flow.payload.get('deposit_id')
        has_filename = flow.payload.get('key')

        assert has_deposit
        assert has_file
        assert has_filename

        if not flow.payload.get('version_id'):
            _update_flow_bucket(flow)

        # 1. create the object version if doesn't exist
        object_version = init_object_version(flow)
        version_id = str(object_version.version_id)
        db.session.commit()

        # 2. define the workflow and run
        flow.start()
        # 2.1 Refresh flow object
        flow = Flow.get_flow(flow.id)
        # 3. update flow response
        FlowResponseSerializer.update(flow=flow, version_id=version_id)
        FlowResponseSerializer.update_tasks(flow)
        FlowResponseSerializer.update_global_status(flow)

        return flow

    def delete(self):
        """Mark the flow as deleted."""
        self.clean()
        self.response = {'status': 410, 'message': 'Gone.'}
        self.response_code = 410
        db.session.commit()

    @staticmethod
    def delete_task(task_id):
        """Revoke a specific task."""
        AsyncResult(task_id).revoke(terminate=True)

    def restart_task(self, task_id):
        Task.restart_task(task_id, self.id, flow_payload=self.payload)

    def stop(self):
        """Stop the flow."""
        for task in self.model.tasks:
            Task().stop_task(task)

    def clean(self):
        """Delete tasks and everything created by them."""
        self.clean_task(task_name='file_video_extract_frames')
        for preset_quality in get_all_distinct_qualities():
            self.clean_task(
                task_name='file_transcode',
                preset_quality=preset_quality,
            )
        self.clean_task(task_name='file_video_metadata_extraction')
        if 'version_id' not in self.payload:
            self.clean_task(task_name='file_download')

        # stop the workflow
        self.stop()
