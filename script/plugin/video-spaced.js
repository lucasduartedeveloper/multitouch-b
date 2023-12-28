var sw = window.innerWidth;
var sh = window.innerHeight;

var setupCanvas = function() {
    backgroundView = document.createElement("canvas");
    backgroundView.style.position = "absolute";
    backgroundView.style.background = "#000";
    backgroundView.style.left = (0)+"px";
    backgroundView.style.top = (0)+"px";
    backgroundView.style.width = (sw)+"px";
    backgroundView.style.height = (sh)+"px";
    backgroundView.style.zIndex = "15";
    document.body.appendChild(backgroundView);

    pictureView = document.createElement("canvas");
    pictureView.style.position = "absolute";
    pictureView.style.background = "#fff";
    pictureView.style.objectFit = "cover";
    pictureView.width = (sw);
    pictureView.height = (sw); 
    pictureView.style.left = (0)+"px";
    pictureView.style.top = ((sh/2)-(sw/2))+"px";
    pictureView.style.width = (sw)+"px";
    pictureView.style.height = (sw)+"px";
    pictureView.style.zIndex = "15";
    document.body.appendChild(pictureView);

    video = document.getElementsByTagName("video")[0];
    console.log(video);

    animate();
};

var updateImage = true;

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if ((new Date().getTime() - updateTime) > 1000) {
            updateTime = new Date().getTime();
        }
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var objectPosition = 0;

var drawImage = function() {
    var ctx = pictureView.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, sw, sw);

    var resolutionCanvas = document.createElement("canvas");
    resolutionCanvas.width = sw;
    resolutionCanvas.height = sw;

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.save();
    if (objectPosition == 1) {
        resolutionCtx.scale(-1, 1);
        resolutionCtx.translate(-resolutionCanvas.width, 0);
    }

    var image = {
        width: getSquare(video),
        height: getSquare(video)
    };
    var frame = {
        width: getSquare(video),
        height: getSquare(video)
    };
    var format = fitImageCover(image, frame);
    resolutionCtx.drawImage(video,
    -format.left, -format.top, frame.width, frame.height, 
    0, 0, resolutionCanvas.width, resolutionCanvas.height);

    resolutionCtx.restore();
    drawBinary(resolutionCanvas);

    ctx.drawImage(resolutionCanvas, 0, 0, sw, sw);
};

var getSquare = function(item) {
    var width = item.videoWidth ? 
    item.videoWidth : item.width;
    var height = item.videoHeight ? 
    item.videoHeight : item.height;

    return width < height ? width : height;
};

var grayscaleNo = 0;
var grayscaleRatio = [
    [ 0.33, 0.33, 0.33 ], // Normal balance
    [ 0.4, 0.3, 0.4 ] // Color affective
];

var drawBinary = function(canvas) {
    var charSequence = ".*+#@";

    var ctx = canvas.getContext("2d");

    var resolutionCanvas = document.createElement("canvas");

    var width = 50;
    var height = 50;

    resolutionCanvas.width = width;
    resolutionCanvas.height = height;

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.drawImage(canvas, 0, 0, width, height);

    var imgData = 
    resolutionCtx.getImageData(0, 0, 
    resolutionCanvas.width, resolutionCanvas.height);
    var data = imgData.data;

    var binaryData = [];

    var newImageArray = new Uint8ClampedArray(data);
    for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        var i = ((y*height)+x)*4;

        var brightness = 
        (1/255) * 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));

        binaryData.push({
            x: x, y: y,
            radius: brightness, 
            value: Math.floor((charSequence.length-1)*brightness)
        });
    }
    }

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, sw, sw);

    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.font = ((sw/width)/3)+"px sans";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (var n = 0; n < binaryData.length; n++) {
        var obj = binaryData[n];
        var x = (sw/(width*2))+(obj.x*(sw/width));
        var y = (sw/(width*2))+(obj.y*(sw/width));

        ctx.beginPath();
        ctx.arc(x, y, (0.5-(obj.radius/2))*Math.floor(sw/width), 0, 
        Math.PI*2);

        ctx.fill();
    }
};

var fitImageCover = function(img, frame) {
    var obj = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };

    var left, top, width, height;

    var img_aspectRatio = img.width/img.height;
    var frame_aspectRatio = frame.width/frame.height;

    if (frame_aspectRatio > img_aspectRatio) {
        width = frame.width;
        height = (img.height/img.width)*frame.width;

        left = 0;
        top = -(height-frame.height)/2;
    }
    else {
        height = frame.height;
        width = (img.width/img.height)*frame.height;

        top = 0;
        left = -(width-frame.width)/2;
    }

    obj.left = left;
    obj.top = top;
    obj.width = width;
    obj.height = height;

    return obj;
};

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisivbilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  visibilityChange = "webkitvisibilitychange";
}
//^different browsers^

var backgroundMode = false;
document.addEventListener(visibilityChange, function(){
    backgroundMode = !backgroundMode;
    if (backgroundMode) {
        console.log("backgroundMode: "+backgroundMode);
    }
    else {
        console.log("backgroundMode: "+backgroundMode);
    }
}, false);

setupCanvas();

/*
    javascript: ( function() { var rnd = Math.random(); alert("Video Spaced loaded"); var script=document.createElement("script"); document.body.appendChild(script);  script.onload=function(){ setupCanvas(); }; script.src="https://cpu-test-7.kesug.com/multitouch-b/script/plugin/video-spaced.js?rnd="+rnd; } ) ();

   javascript: ( function() { var rnd = Math.random(); alert("Video Spaced loaded"); var script=document.createElement("script"); document.body.appendChild(script);  script.onload=function(){ var visibilityChange,sw=window.innerWidth,sh=window.innerHeight,setupCanvas=function(){(backgroundView=document.createElement("canvas")).style.position="absolute",backgroundView.style.background="#000",backgroundView.style.left="0px",backgroundView.style.top="0px",backgroundView.style.width=sw+"px",backgroundView.style.height=sh+"px",backgroundView.style.zIndex="15",document.body.appendChild(backgroundView),(pictureView=document.createElement("canvas")).style.position="absolute",pictureView.style.background="#fff",pictureView.style.objectFit="cover",pictureView.width=sw,pictureView.height=sw,pictureView.style.left="0px",pictureView.style.top=sh/2-sw/2+"px",pictureView.style.width=sw+"px",pictureView.style.height=sw+"px",pictureView.style.zIndex="15",document.body.appendChild(pictureView),video=document.getElementsByTagName("video")[0],console.log(video),animate()},updateImage=!0,updateTime=0,renderTime=0,elapsedTime=0,animationSpeed=0,animate=function(){elapsedTime=new Date().getTime()-renderTime,backgroundMode||(new Date().getTime()-updateTime>1e3&&(updateTime=new Date().getTime()),drawImage()),renderTime=new Date().getTime(),requestAnimationFrame(animate)},objectPosition=0,drawImage=function(){var e=pictureView.getContext("2d");e.imageSmoothingEnabled=!1,e.clearRect(0,0,sw,sw);var t=document.createElement("canvas");t.width=sw,t.height=sw;var i=t.getContext("2d");i.imageSmoothingEnabled=!1,i.save(),1==objectPosition&&(i.scale(-1,1),i.translate(-t.width,0));var a={width:getSquare(video),height:getSquare(video)},n={width:getSquare(video),height:getSquare(video)},d=fitImageCover(a,n);i.drawImage(video,-d.left,-d.top,n.width,n.height,0,0,t.width,t.height),i.restore(),drawBinary(t),e.drawImage(t,0,0,sw,sw)},getSquare=function(e){var t=e.videoWidth?e.videoWidth:e.width,i=e.videoHeight?e.videoHeight:e.height;return t<i?t:i},grayscaleNo=0,grayscaleRatio=[[.33,.33,.33],[.4,.3,.4]],drawBinary=function(e){var t=e.getContext("2d"),i=document.createElement("canvas");i.width=50,i.height=50;var a=i.getContext("2d");a.imageSmoothingEnabled=!1,a.drawImage(e,0,0,50,50);var n=a.getImageData(0,0,i.width,i.height).data,d=[];new Uint8ClampedArray(n);for(var h=0;h<50;h++)for(var s=0;s<50;s++){var g=(50*s+h)*4,o=1/255*(n[g]*grayscaleRatio[grayscaleNo][0]+n[g+1]*grayscaleRatio[grayscaleNo][1]+n[g+2]*grayscaleRatio[grayscaleNo][2]);d.push({x:h,y:s,radius:o,value:Math.floor(4*o)})}t.fillStyle="#fff",t.fillRect(0,0,sw,sw),t.fillStyle="#000",t.strokeStyle="#000",t.font=sw/50/3+"px sans",t.textBaseline="middle",t.textAlign="center";for(var r=0;r<d.length;r++){var l=d[r],h=sw/100+l.x*(sw/50),s=sw/100+l.y*(sw/50);t.beginPath(),t.arc(h,s,(.5-l.radius/2)*Math.floor(sw/50),0,2*Math.PI),t.fill()}},fitImageCover=function(e,t){var i,a,n,d,h={left:0,top:0,width:0,height:0},s=e.width/e.height;return t.width/t.height>s?(n=t.width,d=e.height/e.width*t.width,i=0,a=-(d-t.height)/2):(d=t.height,n=e.width/e.height*t.height,a=0,i=-(n-t.width)/2),h.left=i,h.top=a,h.width=n,h.height=d,h};void 0!==document.hidden?visibilityChange="visibilitychange":void 0!==document.msHidden?visibilityChange="msvisivbilitychange":void 0!==document.webkitHidden&&(visibilityChange="webkitvisibilitychange");var backgroundMode=!1;document.addEventListener(visibilityChange,function(){backgroundMode=!backgroundMode,console.log("backgroundMode: "+backgroundMode)},!1),setupCanvas(); }; script.src="https://cpu-test-7.kesug.com/multitouch-b/script/plugin/video-spaced.js?rnd="+rnd; } ) ();
*/