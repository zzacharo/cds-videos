//window.theoplayer = window.theoplayer || {};
//window.theoplayer.configuration = window.theoplayer.configuration || {};

//window.theoplayer.configuration.libraryLocation = window.theoplayer.configuration.libraryLocation || 'http://yourcdn.com/theoplayer/';
//window.theoplayer.configuration.styleSheetURI = window.theoplayer.configuration.styleSheetURI || 'http://yourcdn.com/theoplayer/style/theoplayer.css';

/*!
THEOplayer

Usage of this software is limited by the THEOplayer License
The license is available at:
http://www.theoplayer.com/license.html

It is prohibited to reverse engineer, decompile, translate,
disassemble, decipher, decrypt, or otherwise attempt to 
discover the source code of this software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, visit http://www.theoplayer.com or contact
contact @ theoplayer . com

THEOplayer is based on a patent pending technology developed by 
OpenTelly (http://www.opentelly.com).

Version: 1.6.37
Created: Tue May 24 2016 15:21:05 GMT+0200 (Romance Daylight Time)
*/

(function (self) {var _=["video","objectFit","ontouchstart","application/vnd.apple.mpegURL","video/mp4",'audio/mp4; codecs="mp4a.40.34"',"audio/mpeg",'video/mp4; codecs="avc1.4d401e"',"https://cdn.theoplayer.com/t","https://cdn.theoplayer.com/latest/","theoplayer.loader.js","1ADD53F3","aac-lc","he-aac","unknown codec ","Base64ArrayBuffer","This operation is not supported. Disable webworkers for this.",";base64,","length","YOU CANNOT USE THIS ANY MOAR!!","//cdn.theoplayer.com/theoplayer.",".min.css","//cdn.theoplayer.com/1.6.37/c5692bfe-c2a2-4b87-a160-5e1c57e4a16a/","play,pause,paused,currentTime,setCurrentTime,duration,buffered,volume,setVolume,muted,setMuted,width,height,supportsFullScreen,enterFullScreen,src,load,currentSrc,preload,setPreload,autoplay,setAutoplay,loop,setLoop,error,networkState,readyState,seeking,initialTime,startOffsetTime,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks,defaultPlaybackRate,playbackRate,quality,mediaGroup,controller,controls,defaultMuted","undefined","(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)","x0hKPS1E/p==","x0hKPJ==","nvDKrEz0ia4GrEzK","nvDKrEz0ia4GrEzGnp==","nvDKrEz0ia4GrEzKnp==","nvDKrEz0ia4GrEzXnp==","qytW/NjOxXD+qyUFLRoVx0GWAgbRLR9VAa1Vqko=","x0bVrNbTqg9HPuj1qkeVx09F","ms-appx:","ms-appx-web:","xXw0ivdSqRwFxXdUnSQQxEJ7rgzGtEpFtgwGxXw7qvbUnvqU","1ea107a1-9845-4c10-b167-eda33dd071aa","746bfcb2-5db6-490d-9e6a-094d3da5c9b8","nvo4tvDHtXeHnypHnp==","message","helpLink","helpLinkText","THEOplayer error: ","LICENSE_INVALID","The license for this player is invalid. Please contact THEOplayer using contact@theoplayer.com for additional information.","https://www.theoplayer.com/","theoplayer.com","MANIFEST_NOT_FOUND","Could not load the manifest file. Make sure the source is set correctly and that CORS support is enabled.","https://www.theoplayer.com/documentation/cors.html","SUBTITLE_NOT_FOUND","Could not load the subtitle file. Make sure the source is set correctly and that CORS support is enabled.","INVALID_HLS_MANIFEST","The source of the player is an invalid HLS manifest.","https://developer.apple.com/library/ios/technotes/tn2288/_index.html","PLAYBACK_ISSUE","There appears to be a playback issue.","AUDIO_ISSUE","There is an audio issue. Please contact THEOplayer using contact@theoplayer.com with the code below for additional information.","BROWSER_SUPPORT_ISSUE","Your browser doesn't support a feature. Try upgrading your browser or please contact THEOplayer using contact@theoplayer.com referring to the code below.","INVALID_KEY","There is an invalid key being decrypted. Please contact THEOplayer using contact@theoplayer.com with the code below for additional information.","DECRYPTION_ERROR","There is a decryption error. Please contact THEOplayer using contact@theoplayer.com with the code below for additional information.","AD_BLOCK_DETECTED","An ad blocker was detected. Please turn it off and refresh the page in order to watch this video.","THEOPLAYER_NOT_INITIALIZED","THEOplayer hasn't been initialized yet. Please check your configuration or wait.","THEOplayer encountered an error. If this issue holds, please contact THEOplayer using contact@theoplayer.com.","LCC1300","format-mp3_","format-mp4_","format-m4s_","format-mp4-initializer_","format-m4s-and-initializer_","PIW0031","PIW0072","PIW0082","PIW0078","PIW0090"],$=["enumerable","defineProperty","document","navigator","createElement","userAgent","documentElement","DocumentTouch","msMaxTouchPoints","MediaSource","WebKitMediaSource","TextTrack","fullscreenEnabled","webkitFullscreenEnabled","mozFullScreenEnabled","msFullscreenEnabled","canPlayType","isTypeSupported","POSITIVE_INFINITY","duration","hasOwnProperty","prototype","base64Encode","constructor","webkitURL","BlobBuilder","WebKitBlobBuilder","MozBlobBuilder","MSBlobBuilder","theoplayer","configuration","styleSheetURI","libraryLocation","toLowerCase","toUpperCase","fromCharCode","hostname","pathname","protocol","ancestorOrigins","referrer","isEmbeddable","toString","postMessage","byteLength","stringify","addEventListener","location","setTimeout","clearTimeout","setInterval","clearInterval","TypeError","SyntaxError","parseInt","parseFloat","Uint8Array","WorkerGlobalScope","XMLHttpRequest"];!function(e,t,r,n,i,a,o,s,u,c,f,d,p,h,l,w,m,U,g,y,v){!function(){function i(e,t,r){r[$[0]]=!0,p[$[1]](e,t,r)}function a(e,t,r){p[$[1]](e,t,{writable:!1,enumerable:!0,value:r})}var o=e,s=o.window,u=o[$[2]],f=o[$[3]],d=function(){var e,t=u&&u[$[4]](_[0]),r=f[$[5]],n=u&&_[1]in u[$[6]].style,i=!!r.match(/windows phone (8|8\.1)/i),a=!!r.match(/iPhone/i),c=!!(a||r.match(/iPad/i)||r.match(/iPod/i))&&!i,d=!!r.match(/Android/i),p=i||c||d,h=!!(_[2]in o||o[$[7]]&&u instanceof o[$[7]])||!!f[$[8]],l=r.match(/(mac\sos\sx)\s?([\w\s\.]+\w)*/i)||r.match(/(macintosh|mac(?=_powerpc)\s)/i),m=!!r.match(/Windows NT/i),U=!!o.chrome&&/google/i.test(f.vendor),y=!!r.match(/Safari/i)&&!r.match(/Chrome/i)&&!i,v=r.match(/Firefox/i)&&!r.match(/Seamonkey/i),E=!!r.match(/Edge\/\d+/i),S=!!r.match(/Trident/i),R=!!r.match(/Vivaldi/i),T=r.match(/OPR\/(\d+\.\d+)/i)&&w(r.match(/OPR\/(\d+\.\d+)/i)[1]),I=l&&T&&26>=T,b=d||c||i,O=!!g,B=!(!o[$[9]]&&!o[$[10]]),M=!!o[$[11]],A=u&&(u[$[12]]||u[$[13]]||u[$[14]]||u[$[15]]),L=r.match(/Android ([0-9\.]+)/i),P=L?w(L[1]):0,k=r.match(/Windows NT ([0-9\.]+)/i),N=k?w(k[1]):0,D=r.match(/Firefox\/([0-9\.]+)/i),F=D?w(D[1]):0,C=v&&F>=45,W=t&&(""!==t[$[16]](_[3])||d&&!v&&P>=4),x=t&&""!==t[$[16]](_[4])&&!I,H=B&&!y&&!S&&!E&&((o[$[9]]||o[$[10]])[$[17]]?(o[$[9]]||o[$[10]])[$[17]](_[5]):t&&""!==t[$[16]](_[5])),K=B&&!y&&(H||((o[$[9]]||o[$[10]])[$[17]]?(o[$[9]]||o[$[10]])[$[17]](_[6]):t&&""!==t[$[16]](_[6]))),z=B&&!(R&&l)&&((o[$[9]]||o[$[10]])[$[17]]?(o[$[9]]||o[$[10]])[$[17]](_[7]):x),V=y||S||E,Y=!y,j=S&&m&&6.1>=N;try{e=s.top!==s.self}catch(q){e=!0}return{f:2,g:2,h:6,j:16,k:3,l:1e4,m:.8,n:60,o:2,q:8589934592,r:9e4,s:_[8],t:_[9],w:_[10],z:6e4,A:10,B:1e4,C:1,D:_[11],E:e,F:n,G:.5,H:22,I:1.5,J:i,d:c,K:l,L:p,e:a,M:h,N:U,O:y,P:v,Q:E,R:S,S:b,T:O,U:B,V:M,W:A,Z:C,aa:P,ba:W,ca:x,da:K,ea:H,fa:z,ga:V,ha:j,ia:Y}}(),l=function(e){var t=e/h.pow(2,32);return[t>>>24&255,t>>>16&255,t>>>8&255,255&t,e>>>24&255,e>>>16&255,e>>>8&255,255&e]},m=function(e){return[e>>>24&255,e>>>16&255,e>>>8&255,255&e]},v=function(e){return[e>>>8&255,255&e]},E=function(e,t){return e.push(t),e},S=function(e,t,r,n){var i=r||0,a=n||t.length,o=a-i,s=e.length,u=s+o;for(e.length=u;a>i;i+=1,s+=1)e[s]=t[i];return e},R=function(e,t,r){return S(e,r(t))},T=function(e,t){return R(e,t,m)},I=function(){"use strict";var e="h.264",t="mp3",r=_[12],n=_[13],i=[0,0,0,32,102,116,121,112,105,115,111,109,0,0,2,0,105,115,111,109,105,115,111,50,97,118,99,49,109,112,52,49],a=[0,0,0,28,102,116,121,112,109,112,52,50,0,0,0,0,105,115,111,109,109,112,52,50,100,97,115,104],o=[109,100,97,116],s=[109,111,111,118],u=[109,118,104,100],f=[116,114,97,107],l=[116,107,104,100],w=[109,118,101,120],m=[116,114,101,120],U=32,g=[101,100,116,115],y=[101,108,115,116],v=[109,100,105,97],E=[109,100,104,100],S=[99,116,116,115],R=[0,0,0,45,104,100,108,114,0,0,0,0,0,0,0,0,118,105,100,101,0,0,0,0,0,0,0,0,0,0,0,0,86,105,100,101,111,72,97,110,100,108,101,114,0],I=[0,0,0,45,104,100,108,114,0,0,0,0,0,0,0,0,115,111,117,110,0,0,0,0,0,0,0,0,0,0,0,0,83,111,117,110,100,72,97,110,100,108,101,114,0],b=45,O=[109,105,110,102],B=[0,0,0,16,115,109,104,100,0,0,0,0,0,0,0,0],M=16,A=[0,0,0,20,118,109,104,100,0,0,0,1,0,0,0,0,0,0,0,0],L=20,P=[0,0,0,36,100,105,110,102,0,0,0,28,100,114,101,102,0,0,0,0,0,0,0,1,0,0,0,12,117,114,108,32,0,0,0,1],k=36,N=[115,116,98,108],D=[115,116,115,100],F=[97,118,99,67],C=[101,115,100,115],W=[115,116,115,115],x=[115,116,116,115],H=[115,116,115,99],K=[115,116,115,122],z=[115,116,99,111],V=[112,97,115,112],Y=[97,118,99,49],j=[109,112,52,97],q=[1,0],G=[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0],X=9e4,Q=function(e,t){var r,n=e.Ji||0;return e.tk?e.tk:(r=h.max(X,n),t?h.round(r):r)},J=function(e){var t,r=0,n=function(e){var r=e.length,n=0;for(t=0;r>t;t+=1)n+=e[t].Pv;return n};return e[_[0]]&&(r+=n(e[_[0]].Qj)),e.audio&&(r+=n(e.audio.Qj)),r},Z=function(e,t){var r={video:[],audio:[]},n=8+t,i={video:e[_[0]]&&e[_[0]].Qj||[],audio:e.audio&&e.audio.Qj||[]},a={oc:{un:Number[$[18]]}};for(i[_[0]].index=0,i.audio.index=0,i[_[0]].current=i[_[0]][0]||a,i.audio.current=i.audio[0]||a;i[_[0]].index<i[_[0]].length||i.audio.index<i.audio.length;)i[_[0]].current.oc.un<i.audio.current.oc.un?(T(r[_[0]],n),n+=i[_[0]].current.Pv,i[_[0]].index+=1,i[_[0]].current=i[_[0]][i[_[0]].index]||a):(T(r.audio,n),n+=i.audio.current.Pv,i.audio.index+=1,i.audio.current=i.audio[i.audio.index]||a);return r},et=function(e,t,r){var n,i={oc:{un:Number[$[18]]}},a=0,s=0,u=t[_[0]]&&t[_[0]].Qj||[],c=t.audio&&t.audio.Qj||[],f=u.length,d=c.length,p=u[a]||i,h=c[s]||i;for(e.bm(r),e.am(o);f>a||d>s;)p.oc.un<h.oc.un?(n=p,a+=1,p=u[a]||i):(n=h,s+=1,h=c[s]||i),e.jm(n)},tt=function(e,t,r,n,i){return r?(i||0)+h.floor(t*e||0):n?h.round(t*n||0):0},rt=function(e,t,r){var n=h.max(e[_[0]]&&tt(e[_[0]][$[19]],X,t,r,e[_[0]].Zi),e.audio&&tt(e.audio[$[19]],X,t,r,e.audio.Zi));return n>h.pow(2,32)-1?1:0},nt=function(e,t,r){return 1===rt(e,t,r)?120:108},it=function(e,t,r,n){var i,a=nt(t,r,n),o=[0,1,0,0],s=[0,0,0,0,0,0,0,0,0,0],c=2;i=h.max(t[_[0]]&&tt(t[_[0]][$[19]],X,r,n,t[_[0]].Zi),t.audio&&tt(t.audio[$[19]],X,r,n,t.audio.Zi)),e.bm(a),e.am(u),1===rt(t,r,n)?(e.bm(16777216),e.cm(0),e.cm(0),e.bm(X),e.cm(i)):(e.bm(0),e.bm(0),e.bm(0),e.bm(X),e.bm(i)),e.am(o),e.am(q),e.am(s),e.am(G),e.bm(0),e.bm(0),e.bm(0),e.bm(0),e.bm(0),e.bm(0),e.bm(c+1)},at=function(e,t,r){var n=tt(e[$[19]],X,t,r,e.Zi);return n>h.pow(2,32)-1?1:0},ot=function(e,t,r){return 1===at(e,t,r)?104:92},_t=function(e,t,r,n,i,a){var o=tt(t[$[19]],X,n,a,t.Zi),s=ot(t,n,a);e.bm(s),e.am(l),1===at(t,n,a)?(e.bm(16777231),e.cm(0),e.cm(0),e.bm(r),e.bm(0),e.cm(o)):(e.bm(15),e.bm(0),e.bm(0),e.bm(r),e.bm(0),e.bm(o)),e.bm(0),e.bm(0),e.Zl(0),e.Zl(i?0:1),e.am(i?[0,0]:q),e.am([0,0]),e.am(G),i?(e.Zl(t.width||0),e.Zl(0),e.Zl(t.height||0),e.Zl(0)):(e.bm(0),e.bm(0))},st=function(e,t,r){var n=Q(e,!1),i=tt(e[$[19]],n,t,r);return i>h.pow(2,32)-1?1:0},ut=function(e,t,r){return 1===st(e,t,r)?44:32},ct=function(e,t,r,n){var i=ut(t,r,n),a=Q(t,!1),o=tt(t[$[19]],a,r,n);a=h.round(a),e.bm(i),e.am(E),1===st(t,r,n)?(e.bm(16777216),e.cm(0),e.cm(0),e.bm(a),e.cm(o)):(e.bm(0),e.bm(0),e.bm(0),e.bm(a),e.bm(o)),e.am([85,196]),e.am([0,0])},ft=function(e,t){t?e.am(R):e.am(I)},dt=function(e){e.am(A)},pt=function(e){e.am(B)},ht=function(e){e.am(P)},lt=function(e){var t,r;if(e[$[20]]("xx"))return e.xx;for(t=0,r=0;r<e.Qj.length;r+=1)e.Qj[r].oc.Sj&&(t+=1);return e.xx=t,t},wt=function(e,t){var r=e[_[0]]&&0!==p.keys(e[_[0]]).length,n=e.audio&&0!==p.keys(e.audio).length;return t?0:8+(r?U:0)+(n?U:0)},mt=function(e){return e.rk?e.rk.length+12:0},Ut=function(e,t){return t?110+e.Bk.length+mt(e)+(e.Ck&&e.Dk?16:0):52+mt(e)},gt=function(e,t,r){return r&&t?16+4*lt(e):0},yt=function(e,t,r){return e.sk&&t&&r?16+8*e.Qj.length:0},vt=function(e,t){return 20+(t?4*e.Qj.length:0)},Et=function(e,t){return 16+(t?4*e.Qj.length:0)},St=function(e,t,r){return r?16+(t?8*e.Qj.length:0):16+(t?8:0)},Rt=function(e){return 16+(e?12:0)},Tt=function(e,t,r){return 8+Ut(e,r)+gt(e,t,r)+yt(e,t,r)+St(e,t,r)+Rt(t)+vt(e,t)+Et(e,t)},It=function(e,t,r){return 8+(r?L:M)+k+Tt(e,t,r)},bt=function(e,t,r,n){return 8+ut(e,t,r)+b+It(e,t,n)},Ot=function(e){var t=h.floor(X*e[$[19]]||0),r=e.Zi;return t>h.pow(2,31)-1||r>h.pow(2,31)-1?1:0},Bt=function(e,t){return t?1===Ot(e)?24+(0!==e.Zi?40:20):24+(0!==e.Zi?24:12):0},Mt=function(e,t,r,n){return e&&0!==p.keys(e).length?8+ot(e,t,r)+bt(e,t,r,n)+Bt(e,t):0},At=function(i){if(i===e)return Y;if(i===t)return j;if(i===r||i===n)return j;throw new c(_[14]+i)},Lt=function(e,t,r,n){var i=Ut(t,n),a=At(t.Ri),o=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];e.bm(i),e.am(D),e.bm(0),e.bm(1),e.bm(i-16),e.am(a),e.bm(0),e.Zl(0),e.Zl(1),a===Y?(e.bm(0),e.bm(0),e.bm(0),e.bm(0),e.Zl(t.width||0),e.Zl(t.height||0),e.Zl(72),e.Zl(0),e.Zl(72),e.Zl(0),e.bm(0),e.Zl(1),e.am(o),e.Zl(24),e.am([255,255]),e.bm(8+t.Bk.length),e.am(F),e.am(t.Bk)):a===j&&(e.bm(0),e.bm(0),e.Zl(t.qk),e.Zl(16),e.Zl(0),e.Zl(0),e.Zl(t.tk),e.Zl(0)),t.Ck&&t.Dk&&(e.bm(16),e.am(V),e.bm(t.Ck),e.bm(t.Dk)),t.rk&&(e.bm(mt(t)),e.am(C),e.bm(0),e.am(t.rk))},Pt=function(e,t,r,n){var i,a;if(n&&r)for(i=gt(t,r,n),e.bm(i),e.am(W),e.bm(0),e.bm(lt(t)),a=0;a<t.Qj.length;a+=1)t.Qj[a].oc.Sj&&e.bm(a+1)},kt=function(e,t,r,n){var i,a,o,s=Q(t,!1),u=s/d.r;if(t.sk&&r&&n)for(i=yt(t,r,n),e.bm(i),e.am(S),e.bm(0),e.bm(t.Qj.length),a=0;a<t.Qj.length;a+=1)o=t.Qj[a].oc.zk,e.bm(1),e.bm(h.round(o*u))},Nt=function(e,t,r){var n,i=vt(t,r);if(e.bm(i),e.am(K),e.bm(0),e.bm(0),e.bm(r?t.Qj.length:0),r)for(n=0;n<t.Qj.length;n+=1)e.bm(t.Qj[n].Pv)},Dt=function(e,t,r){var n=Et(t,!!r);e.bm(n),e.am(z),e.bm(0),e.bm(r?t.Qj.length:0),r&&e.am(r)},Ft=function(e,t,r){e.bm(r?1:0),r&&(e.bm(t.Qj.length),e.bm(t.uk))},Ct=function(e,t,r){var n=Q(t,!0),i=0,a=r?t.Qj.length:0,o=n/d.r;for(e.bm(a);a>i;i+=1)e.bm(1),e.bm(h.round(t.Qj[i].oc.yk*o))},Wt=function(e,t,r,n){e.bm(St(t,r,n)),e.am(x),e.bm(0),n?Ct(e,t,r):Ft(e,t,r)},xt=function(e,t){e.bm(Rt(t)),e.am(H),e.bm(0),e.bm(t?1:0),t&&(e.bm(1),e.bm(1),e.bm(1))},Ht=function(e,t,r,n,i){var a=Tt(t,!!n,i);e.bm(a),e.am(N),Lt(e,t,r,i),Wt(e,t,!!n,i),Pt(e,t,!!n,i),kt(e,t,!!n,i),xt(e,!!n),Nt(e,t,!!n),Dt(e,t,n)},Kt=function(e,t,r,n,i){var a=It(t,!!n,i);e.bm(a),e.am(O),i?dt(e):pt(e),ht(e),Ht(e,t,r,n,i)},zt=function(e,t,r,n,i,a){var o=bt(t,!!n,a,i);e.bm(o),e.am(v),ct(e,t,!!n,a),ft(e,i),Kt(e,t,r,n,i)},Vt=function(e,t){var r=Bt(t,!0),n=h.floor(X*t[$[19]]||0),i=Ot(t);e.bm(r),e.am(g),e.bm(r-8),e.am(y),1===i?e.bm(16777216):e.bm(0),e.bm(0!==t.Zi?2:1),0!==t.Zi&&(1===i?(e.cm(t.Zi),e.am([255,255,255,255,255,255,255,255])):(e.bm(t.Zi),e.am([255,255,255,255])),e.Zl(1),e.Zl(0)),1===i?(e.cm(n),e.cm(0)):(e.bm(n),e.bm(0)),e.Zl(1),e.Zl(0)},Yt=function(e,t){e.bm(U),e.am(m),e.bm(0),e.bm(t),e.bm(1),e.bm(0),e.bm(0),e.bm(0)},jt=function(e,t){e.bm(wt(t,!1)),e.am(w),t[_[0]]&&0!==p.keys(t[_[0]]).length&&Yt(e,1),t.audio&&0!==p.keys(t.audio).length&&Yt(e,2)},qt=function(e,t,r,n,i,a){var o=Mt(t,!!r,a,i);0!==o&&(e.bm(o),e.am(f),_t(e,t,n,!!r,i,a),r&&Vt(e,t),zt(e,t,n,r,i,a))},Gt=function(e,t,r){var n=Mt(e[_[0]],t,r,!0),i=Mt(e.audio,t,r,!1);return 8+nt(e,t,r)+wt(e,t)+n+i},Xt=function(e,t,r,n,i){e.bm(r),e.am(s),it(e,t,!!n,i),n||jt(e,t),qt(e,t[_[0]],n&&n[_[0]],1,!0,i),qt(e,t.audio,n&&n.audio,2,!1,i)},Qt=function(e,t){var r=Gt(e,!0),n=J(e)+8,a=i.length+r+n,o=i.length+r,s=Z(e,o);return t.hm(a),t.am(i),Xt(t,e,r,s),et(t,e,n),t},Jt=function(e,t,r){var n=Gt(e,!1,t),i=a.length+n;return r.hm(i),r.am(a),Xt(r,e,n,!1,t||0),r},Zt=function(){var e=[0,0,0,24,115,116,121,112,109,115,100,104,0,0,0,0,109,115,100,104,109,115,105,120],t=[115,105,100,120],r=[109,111,111,102],n=[109,102,104,100],i=16,a=[116,114,97,102],s=[116,102,104,100],u=24,c=[116,102,100,116],f=[116,114,117,110],p=[115,100,116,112],l=function(e,t){return t?20+16*e.Qj.length:20+4*e.Qj.length},w=function(e,t){return t?12+e.Qj.length:0},m=function(e,t){var r=Q(e,!0),n=h.round(t*r);return n>h.pow(2,32)-1?1:0},U=function(e,t){return 1===m(e,t)?20:16},g=function(e,t,r){return e&&e.Qj?8+u+U(e,r)+l(e,t)+w(e,t):0},y=function(e,t){return 8+i+g(e.audio,!1,t)+g(e[_[0]],!0,t)},v=function(e){var t,r=0;if(!e||!e.Qj)return 0;for(t=0;t<e.Qj.length;t+=1)r+=e.Qj[t].Pv;return r},E=function(e,t){var r=h.round(t*X);return r>h.pow(2,32)-1?1:0},S=function(e,t){return 1===E(e,t)?52:44},R=function(e,r,n,i){var a=h.max((r[_[0]]&&r[_[0]].Zi||0)+h.floor(X*(r[_[0]]&&r[_[0]][$[19]])||0),(r.audio&&r.audio.Zi||0)+h.floor(X*(r.audio&&r.audio[$[19]])||0)),o=h.round(i*X);e.bm(n),e.am(t),1===E(r,i)?(e.bm(16777216),e.bm(1),e.bm(X),e.cm(o),e.cm(0)):(e.bm(0),e.bm(1),e.bm(X),e.bm(o),e.bm(0)),e.Zl(0),e.Zl(1),e.bm(y(r,i)+v(r[_[0]])+v(r.audio)+8),e.bm(a),e.am([144,0,0,0])},T=function(e,t){e.bm(i),e.am(n),e.bm(0),e.bm(t)},I=function(e,t,r,n){var i=Q(t,!0),a=n?h.round(i/9e4*(t.pk||0)):t.uk;e.bm(u),e.am(s),e.bm(40),e.bm(r),e.bm(a),e.am(n?[0,1,0,0]:[2,0,0,0])},b=function(e,t,r){var n=Q(t,!0),i=h.round(r*n);e.bm(U(t,r)),e.am(c),1===m(t,r)?(e.bm(16777216),e.cm(i)):(e.bm(0),e.bm(i))},O=function(e,t,r,n){var i,a=v(t[_[0]]),o=y(t,n)+8+a;for(e.bm(l(r,!1)),e.am(f),e.am([0,0,2,1]),e.bm(r.Qj.length),e.bm(o),i=0;i<r.Qj.length;i+=1)e.bm(r.Qj[i].Pv)},B=function(e,t,r,n){var i,a,o=y(t,n)+8,s=Q(r,!1),u=s/d.r;for(e.bm(l(r,!0)),e.am(f),e.am([1,0,15,1]),e.bm(r.Qj.length),e.bm(o),i=0;i<r.Qj.length;i+=1)e.bm(h.round(r.Qj[i].oc.Pe*s)),a=r.Qj[i].oc.zk,e.bm(r.Qj[i].Pv),e.am(r.Qj[i].oc.Sj?[2,0,0,0]:[0,1,0,0]),e.bm(h.round(a*u))},M=function(e,t,r,n,i){n?B(e,t,r,i):O(e,t,r,i)},A=function(e,t,r,n){var i;if(n)for(e.bm(w(r,n)),e.am(p),e.am([0,0,0,0]),i=0;i<r.Qj.length;i+=1)r.Qj[i].oc.Sj?e.im(32):e.im(16)},L=function(e,t,r,n,i,o){r&&(e.bm(g(r,i,o)),e.am(a),I(e,r,n,i),b(e,r,o),M(e,t,r,i,o),A(e,t,r,i))},P=function(e,t,n,i,a){e.bm(n),e.am(r),T(e,i),L(e,t,t[_[0]],1,!0,a),L(e,t,t.audio,2,!1,a)},k=function(e,t,r){var n=0,i=t[_[0]]&&t[_[0]].Qj||t.audio&&t.audio.Qj||[],a=i.length,s=!!t[_[0]];for(e.bm(r),e.am(o);a>n;)e.jm(i[n]),i[n]=null,n+=1,n===a&&t.audio&&s&&(s=!1,i=t.audio.Qj,a=i.length,n=0)};return function(t,r,n,i){var a=S(t,n),o=y(t,n),s=J(t)+8,u=e.length+a+o+s;return i.hm(u),i.am(e),R(i,t,a,n),P(i,t,o,r,n),k(i,t,s),i}}();return{yx:Qt,zx:Jt,Ax:Zt}}(),b=function(){var e=function(e){var t,r=e.length,n=0;for(t=0;r>t;t+=1)n+=e[t].Pv;return n},t=function(t){var r=0;return t.audio&&(r+=e(t.audio.Qj)),r};return{Bx:function(e,r){r.hm(t(e));for(var n=0,i=e.audio&&e.audio.Qj||[],a=i.length;a>n;)r.jm(i[n]),n+=1}}}(),O=function(){var e=function(){this.qa=[]};return e[$[21]].ra=function(e){var t,r=this;return this.qa[e]?(t=function(t){return r.qa[e].apply(this,t)},t[$[21]]=r.qa[e][$[21]],new t(Array[$[21]].slice.call(arguments,1))):null},e[$[21]].sa=function(e,t){this.qa[e]=t},new e}(),B=function(){var e=function(){},t=e[$[21]];return t.Zl=function(e){return this.am(v(e))},t.bm=function(e){return this.am(m(e))},t.cm=function(e){return this.am(l(e))},e}(),M=function(e){"use strict";var t=[],r=this,n=function(){for(var e=new Array(4*h.ceil(t.length/3)),r=0,n=0,i=0;r<t.length;)e[i++]=M[$[22]][t[r++]>>2],r<t.length?(e[i++]=M[$[22]][(3&t[n++])<<4|t[r++]>>4],r<t.length?(e[i++]=M[$[22]][(15&t[n++])<<2|t[r++]>>6],e[i++]=M[$[22]][63&t[n++]]):(e[i++]=M[$[22]][(15&t[n++])<<2],e[i++]="=")):(e[i++]=M[$[22]][(3&t[n++])<<4],e[i++]="=",e[i++]="=");return e.join("")},i=function(){return{data:n(),contentType:e,type:_[15]}},a=function(){throw new c(_[16])},o=function(){return"data:"+e+_[17]+n()},s=function(){return t.length},u=function(e){e.km(t)};r.im=E.bind(t,t),r.am=S.bind(t,t),r.jm=u,p[$[1]](r,"data",{get:i,set:a}),p[$[1]](r,"URI",{get:o}),p[$[1]](r,_[18],{get:s})};M[$[21]]=new B,M[$[21]][$[23]]=M,M[$[22]]=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"],M.canUse=function(){"use strict";return!0},O.sa(_[15],M);var A=function(){"use strict";var e=this,t=0,r=[],n={},i=function(e){r=r.concat(e.Ov),t+=e.Pv},a=function(e,n,i){var a=i-n;a>0&&(r.push({Qv:n,Rv:i,Sv:a,Tv:t,Uv:t+a,Vv:n-t,Wv:e}),t+=a)},o=function(){for(var e,n,i,a=new Array(t),o=r[_[18]],s=0,u=0;o>s;s+=1)for(e=r[s],n=e.Rv,i=e.Qv;n>i;i+=1,u+=1)a[u]=e.Wv[i];return a},s=function(e){for(var t,n=r[_[18]],i=0;n>i;i+=1)if(t=r[i],t.Tv<=e&&e<t.Uv)return t.Wv[e+t.Vv]},u=function(e,t,n){for(var i,a,o,s,u="",c=r[_[18]],f=0,d=M[$[22]];c>f;f+=1)for(i=r[f],a=i.Rv,o=i.Qv;a>o;o+=1)switch(s=i.Wv[o],t){case 0:u+=d[s>>2],n=(3&s)<<4,t=1;break;case 1:u+=d[n+(s>>4)],n=(15&s)<<2,t=2;break;case 2:u+=d[n+(s>>6)],u+=d[63&s],t=0}return{data:e+u,state:t,remainder:n}},c=function(e,t){for(var n,i,a,o=r[_[18]],s=0;o>s;s+=1)for(n=r[s],i=n.Rv,a=n.Qv;i>a;a+=1,t+=1)e[t]=n.Wv[a];return t},f=function(e){var r=new U(o());return e.push(r.buffer),{Pk:r,Qk:t,Rj:n}};e.Xv=i,e.Ja=s,e.Yv=a,e.Zv=u,e.km=c,e.mm=f,p[$[1]](e,"Pv",{get:function(){return t},set:function(e){var n,i=r[_[18]]-1,a=t-e;if(!(e>=t)){if(0===e)return r[_[18]]=0,void 0;for(t=e;i>=0;i-=1){if(n=r[i],a<=n.Sv)return n.Rv-=a,n.Sv-=a,n.Uv-=a,r[_[18]]!==i+1&&(r[_[18]]=i+1),void 0;a-=n.Sv}}}}),p[$[1]](e,"Ov",{get:function(){return r}}),p[$[1]](e,"Oc",{get:o}),p[$[1]](e,"oc",{get:function(){return n},set:function(e){n=e}})};A.om=function(e){var t=new A;return t.Yv(e.Pk,0,e.Qk),t.oc=e.Rj,t};var L=function(t){return e.URL&&e.URL.createObjectURL?e.URL.createObjectURL(t):e[$[24]]&&e[$[24]].createObjectURL?e[$[24]].createObjectURL(t):e.createObjectURL?e.createObjectURL(t):null},P=function(t){return e.URL&&e.URL.revokeObjectURL?e.URL.revokeObjectURL(t):e[$[24]]&&e[$[24]].revokeObjectURL?e[$[24]].revokeObjectURL(t):e.revokeObjectURL?e.revokeObjectURL(t):void 0},k=function(){return e.Blob&&new e.Blob?function(t,r){return new e.Blob([t],{type:r})}:function(t,r){var n,i=e[$[25]]||e[$[26]]||e[$[27]]||e[$[28]];if(i)return n=new i,n.append(t),n.getBlob(r)}}(),N=function(){var e=function(e){this.dm=e},t=e[$[21]]=new B;t[$[23]]=e;var r=function(e,t,r){var n=this.fm,i=this.Oc;for(t=t||0,r=r||e[_[18]];r>t;t+=1,n+=1)i[n]=e[t];this.fm=n};return t.dm=null,t.Oc=null,t.fm=0,t.gm={},t.hm=function(e){this.Oc=new U(e),this.fm=0},t.im=function(e){this.Oc&&(this.Oc[this.fm]=e,this.fm+=1)},t.am=function(e,t,n){this.Oc&&r.call(this,e,t,n)},t.jm=function(e){this.fm=e.km(this.Oc,this.fm)},t.lm=function(e){delete this.gm[e],P(e)},t.mm=function(e){return e.push(this.Oc.buffer),{Oc:this.Oc,dm:this.dm,fm:this.fm,vd:"nm"}},t.om=function(e){this.Oc=e.Oc,this.dm=e.dm,this.fm=e.fm},p[$[1]](t,"URI",{get:function(){var e=k(this.Oc,this.dm),t=L(e);return this.gm[t]=e,t}}),p[$[1]](t,_[18],{get:function(){return console.error(_[19]),this.fm}}),e}();O.sa("nm",N);var D="1.6.7",F=_[20]+D+_[21],C=_[22],W=s&&s&&s[$[29]]&&s[$[29]][$[30]]||{},x=function(e,t){var r,n;return u?(r=u[$[4]]("a"),r.href=e,n=r.href):n=e,t&&-1===n.indexOf("/",n[_[18]]-1)&&(n+="/"),n},H=null===W[$[31]]?null:x(W[$[31]]||F),K=x(W[$[32]]||C,!0),z=function(e){W=e||{},e[$[31]]=H,e[$[32]]=K};z(W);var V=function(){"use strict";var e,t,r="",n=_[23][$[33]]().replace(/,/g,"zj");for(e=0;e<n[_[18]];e+=1)t=n.charAt(e),-1===r.indexOf(t)&&(r+=t);for(r+="/"+r[$[34]]()+"+",e=0;64>=e;e+=7){for(t=e;t>10;)t-=10;r+=t}return r+="=",function(e){var t,n,i,a,o,s,u,c,f,d=[];for(t=0;t<e[_[18]];t+=4)o=r.indexOf(e.charAt(t)),s=r.indexOf(e.charAt(t+1)),u=r.indexOf(e.charAt(t+2)),c=r.indexOf(e.charAt(t+3)),f=o<<18|s<<12|u<<6|c,n=f>>>16&255,i=f>>>8&255,a=255&f,d[t/4]=String[$[35]](n,i,a),64===c&&(d[t/4]=String[$[35]](n,i)),64===u&&(d[t/4]=String[$[35]](n));return d.join("")}}(),Y=function(){return!0},j=function(i){"use strict";{var a=(o.b||"",_[24]!=typeof y&&o instanceof y),s=o.parent&&o.parent!==o;o.parent&&o.top&&o.parent!==o.top}delete o.b;var u=!1,c=n[$[36]],f=(n[$[37]],!1),d=function(t){var r=O.ra("qv",e);if(r&&r.rv(t),!f)switch(t){case"iV":case"iLE":;case"iDV":case"iIDV":case"cCT":case"cWL":default:i(o,t)}},p=function(e,t){if(t=V(t).trim(),t===e)return!0;var r=/ip-range\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(\*|25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(\*|25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(\*|25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\)/,n=t.match(r),i="\\.",a=function(e){return"*"===e?_[25]:e};if(null!==n&&5===n[_[18]]){var o=new RegExp("^"+n[1]+i+a(n[2])+i+a(n[3])+i+a(n[4])+"$");return null!==e.match(o)}return t="."+t,-1!==e.indexOf(t,e[_[18]]-t[_[18]])},h=function(e){return e},l=function(e){var t=r[$[4]]("a");return t.href=e,t[$[36]]},w=h([_[26],_[27],_[28],_[29],_[30],_[31],_[32],_[33],_[33]]);!function(e){var t,r,i=n[$[38]];if(""!==e){for(t=0;t<w[_[18]];t+=1)u=u||p(c,w[t])||p(e,w[t]);u||d("iDV")}else if("blob:"===i)u=!0;else if("file:"===i||_[34]===i||_[35]===i){if(r=V(_[36]),_[37]===r)return u=!0,void 0;if(_[38]===r)return u=!0,void 0;u=!0,Y=function(e){if(!e)return!0;var r=!1,n=l(e);for(t=0;t<w[_[18]];t+=1)r=r||p(n,w[t]);return r||d("iSDV"),r}}else u=!1}(c),function(){var e=new Date,t=new Date(+V(_[39]));(!+t||e>t)&&(u=!1,d("iLE"))}(),function(){var e,i,o,u=n[$[39]],c=r&&r[$[40]];if(!a&&s&&!W[$[41]]){if(u&&u[_[18]]>0){for(o=u[u[_[18]]-1],e=l(o),i=0;i<w[_[18]];i+=1)if(p(e,w[i]))return}else if(c&&t.parent===t.top)for(e=l(c),i=0;i<w[_[18]];i+=1)if(p(e,w[i]))return;d("iIDV")}}(),u||d("iV")},q=function(){"use strict";var e=function(e,t){a(this,"code",e),a(this,"info",t)},t=e[$[21]];t[$[23]]=e,i(t,_[40],{get:function(){return o[this.code]&&o[this.code].ta||void 0}}),i(t,_[41],{get:function(){return o[this.code]&&o[this.code].ua||void 0}}),i(t,_[42],{get:function(){return o[this.code]&&o[this.code].va||void 0}}),t[$[42]]=function(){return _[43]+this[_[40]]};var r,n=[{wa:_[44],ta:_[45],ua:_[46],va:_[47]},{wa:_[48],ta:_[49],ua:_[50]},{wa:_[51],ta:_[52],ua:_[50]},{wa:_[53],ta:_[54],ua:_[55]},{wa:_[56],ta:_[57]},{wa:_[58],ta:_[59]},{wa:_[60],ta:_[61]},{wa:_[62],ta:_[63]},{wa:_[64],ta:_[65]},{wa:_[66],ta:_[67]},{wa:_[68],ta:_[69]},{wa:"ERROR",ta:_[70]}],o={};for(r=0;r<n[_[18]];r+=1)o[n[r].wa]=n[r];return e}(),G=function(e){console.log(new q(_[44],{code:_[71]})[_[40]]),e.Lv=!0},X=function(e){"use strict";var t=void 0,r=function(){var t=new U(1);try{return e[$[43]](t,[t.buffer]),0===t[$[44]]}catch(r){return!1}};return function(n,i){return void 0===t&&(t=r()),i&&t?e[$[43]](n,i):e[$[43]](n)}}(e);!function(e){"use strict";j(G);var t=_[72],r=_[73],n=_[74],i=_[75],a=_[76],o=function(e){var t,r,n;if(e&&e.Qj)for(n=e.Qj,t=0,r=n[_[18]];r>t;t+=1)n[t]=A.om(n[t])},s=function(e){return e.audio&&o(e.audio),e[_[0]]&&o(e[_[0]]),e},u=function(t,r,n){r={},n||(n=_[77]),e[$[43]]({Im:"Nm",Jm:t,Lm:r[_[40]]||n,Cx:r.name,Dx:r.stack,Ex:JSON[$[45]](r)})};e[$[46]](_[40],function(o){var c,f,d,p=o.data.tm,h=[],l=o.data.xm,w=o.data.zm,m=o.data.Dm,U=o.data.Bm,g=o.data.wm,y=o.data.vm;if(!e.Lv){if("um"===p){d=s(o.data.ym),o.data.ym=null;try{switch(g){case t:c=new N(l),b.Bx(d,c);break;case r:c=new N(l),I.yx(d,c);break;case n:c=new N(l),I.Ax(d,w,m,c);break;case i:c=new N(l),I.zx(d,U,c);break;case a:c={Gm:new N(l),Hm:new N(l),mm:function(e){return{Gm:c.Gm.mm(e),Hm:c.Hm.mm(e)}}},I.zx(d,U,c.Gm),I.Ax(d,w,m,c.Hm);break;default:return u(y,{},_[78])}}catch(v){return u(y,v,_[79])}try{return f=c.mm(h),X({Im:"Mm",Jm:y,Km:f},h)}catch(E){return u(y,E,_[80])}}return u(y,{},_[81])}},!1),e[$[43]]("Ei")}(e)}()}(self,self.window,self[$[2]],self[$[47]],self[$[3]],self[$[48]],self[$[49]],self[$[50]],self[$[51]],self.Error,self[$[52]],self[$[53]],self.Object,self.Math,self[$[54]],self[$[55]],self.isNaN,self[$[56]],self.Worker,self[$[57]],self[$[58]]);}(self));