var webcamstream;
var streamRecorder;
function getMediaSources(callback)
{
if(MediaStreamTrack !== undefined)
{
   // console.log(MediaStreamTrack);
MediaStreamTrack.getSources(function (sourceinfo)
{
    var audioSource = null;
    var videoSource = null;
    
    for(var i=0; i<sourceinfo.length; i++)
    {
        var source =sourceinfo[i];
        if(source.kind === 'audio')
        {
            console.log(source.id, source.label||'mic');
            audioSource  = sourceinfo.id;
        }
        else if(source.kind === 'vidio')
        {
            console.log(source.id, source.label||'cam');
            videoSource  = sourceinfo.id;
        }
        else
        {
            console.log('another source');
        }
    }
    sourceSelected(audioSource, videoSource,callback);
    
}
);
}
else{
    defaultSource();
}

}

function defaultSource()
{
    var hdConstraints = {
  video: {
    mandatory: {
      minWidth: 1280,
      minHeight: 720
    }
  }
};

navigator.getUserMedia =sajax().hasGetUserMedia();

if(!usrMed)
{
    fallback();
}
else{
  navigator.getUserMedia(hdConstraints,success,fallback);
}


}

 



function sourceSelected(audioSource, videoSource,callback) {
    var ctx = document.getElementById('vidcanvas').getContext('2d');
    canvas = document.getElementById('vidcanvas');
 var constraints = {
    audio: {    
      mandatory: {
                    googEchoCancellation: true,
                    googAutoGainControl: false,
                    googNoiseSuppression: true,
                    googHighpassFilter: true,
                    echoCancellation: false
                },
      optional: [{sourceId: audioSource}]
    },
    video: {
      optional: [{sourceId: videoSource}],
       mandatory: {minWidth: 1280, minHeight: 720}
    }
  };
navigator.getUserMedia =sajax().hasGetUserMedia();

if(navigator.getUserMedia === undefined)
{
    fallback();
}
else{
    navigator.getUserMedia(constraints,success,fallback);
}
var video=  document.querySelector('video')
 var timer = setInterval(function(){
     //test = document.getElementById('test');
     ctx.drawImage(video,0,0,256,128);
     data = canvas.toDataURL('image/jpeg',0.8);
     imgdata=ctx.getImageData(0, 0, 256,128);
     var ab = makeBinaryData(data);
    
     // var ab = makearrayBufferdata(imgdata);
     // console.log(data);
     //streamRecorder = webcamstream.start();
     if(typeof callback === 'function')
      callback(ab,timer);
    //   webcamstream.stop();
      //clearInterval(timer);
 },150);
}


function success(stream)
{ var vid=  document.querySelector('video')
    
   webcamstream = stream;
   vid.src = window.URL.createObjectURL(stream);
 
 
   
}

function fallback(e)
{
    var vid=  document.querySelector('video')
    vid.src='fallbackvd.webm';
}

function makeBinaryData(dataUrl)
{
    
   //  blobfromXHR(document.querySelector('video').src);
    var bsParts = dataUrl.split(',')
    var mtype = bsParts[0].split(':')[1].split(';')[0];
    var bs = atob(bsParts[1]);
    var arrbuff = new ArrayBuffer(bs.length);
    var uea = new Uint8Array(arrbuff);
    
   // console.log(uea);
    for(var i=0;i<bs.length; i++)
    {
        uea[i]= bs.charCodeAt(i);
      //  console.log(uea[i]);
    }
   // console.log(bs.length);

    var bb = new Blob([uea],{type:mtype});
   
    return bb;
    
}   

function makearrayBufferdata(img)
{
 //console.log(img);
 
 var buffer = new ArrayBuffer(img.data.length);
var binary = new Uint8Array(buffer);

for (var i = 0; i < binary.length; i++) {
  binary[i] = img.data[i];
}
 
 return buffer;
}

function testcanvas()
{
     var ctx = document.getElementById('vidcanvas').getContext('2d');
    test = document.getElementById('test');
     ctx.drawImage(test,0,0,420,228);
     data =  document.getElementById('vidcanvas').toDataURL('image/jpeg',1.0);
     imgdata=ctx.getImageData(0, 0, 420,228);
    
     var ab = makeBinaryData(data);
     // console.log(imgdata.data.length);
     // var ab = makearrayBufferdata(imgdata);
     
     
     
      return ab;
}
var peer;
function blobfromXHR(objecturl)
{

var xhr = new XMLHttpRequest();
xhr.open('GET', objecturl, true);
xhr.responseType = 'blob';
xhr.onload = function(e) {
  if (xhr.status == 200) {
    var myBlob = xhr.response;
      console.log(e.target.response,'ppp');
    // myBlob is now the blob that the object URL pointed to.
  }
  console.log(xhr.status);
  
};
xhr.send();
}

var pc;
function startConnection(isCaller, wsocket)
{
  
    RTCPeerConnection =  webkitRTCPeerConnection;
   servers =  {'iceServers': [
    {
      'url': 'stun:stun.l.google.com:19302'
    }]
   }
   // var config ={servers}
    pc = new RTCPeerConnection(servers);
    pc.onicecandidate = function(evt)
    {
        console.log('remot');
       // console.log('{"message":'+JSON.stringify({'candidate':evt.candidate})+'}');
        wsocket.send('{"message":'+JSON.stringify({'candidate':evt.candidate})+', "message_type":"PCP","touser":"guest1"}');
    };
    
    pc.onaddstream = function(evt)
    {
        console.log('remot');
        document.getElementById('remoteview').src = URL.createObjectURL(evt.stream);
        
    }
    
    navigator.getUserMedia =sajax().hasGetUserMedia()
    
    navigator.getUserMedia({'audio':{mandatory: {
                    googEchoCancellation: true,
                    googAutoGainControl: false,
                    googNoiseSuppression: true,
                    googHighpassFilter: true,
                    echoCancellation: true,
                    }
                }, 'video':true},function(stream)
    {
        document.getElementById('selfview').src = URL.createObjectURL(stream);
        pc.addStream(stream);
        if(isCaller)
        {
           console.log('call');
          
          pc.createOffer(gotDescription, function(err)
          {
              console.log(err);
          });
        }
        else 
        {
         
         pc.createAnswer(gotDescription,function(err)
         {
             console.log(err);
         }
         ); 
        }
        function gotDescription(desc) {
            pc.setLocalDescription(desc);
            var tousr;
            if(isCaller)
              tousr = 'guest1';
            else
              tousr= 'guest0';
            
            wsocket.send('{"message":'+ JSON.stringify({ "sdp": desc, })+',"message_type":"PCP", "touser":"'+tousr+'"}');
        }
    },
    function(err)
    {
        console.log(err, 'an error has ocurred');
    }
    );
    
   /* wsocket.onmessage = function(e)
    {
       
    }*/
    
}