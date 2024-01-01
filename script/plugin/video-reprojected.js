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

    ontouch = false;
    startX = 0;
    startY = 0;

    pictureView.ontouchstart = function(e) {
        ontouchIteration = 0;
        ontouch = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY-((sh/2)-(sw/2));
    };
    pictureView.ontouchmove = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY-((sh/2)-(sw/2));
    };
    pictureView.ontouchend = function(e) {
        ontouch = false;
    };

    positionArr = [
        { x: (sw/2), y: sw },
        { x: 0, y: 0 },
        { x: (sw/2), y: sw },
        { x: sw, y: 0 }
    ];

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
        width: video.videoWidth,
        height: video.videoHeight
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
    drawProjected(resolutionCanvas);

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

var ontouchIteration = 0;

var drawProjected = function(canvas) {
    var width = sw;
    var height = sw;

    var ctx = canvas.getContext("2d");

    var scale = (1/sw)*width;

    var leftHeight = scale*(positionArr[0].y-positionArr[1].y);
    var topWidth = scale*(positionArr[3].x-positionArr[1].x);
    var rightHeight = scale*(positionArr[2].y-positionArr[3].y);
    var bottomWidth = scale*(positionArr[2].x-positionArr[0].x);

    if (leftHeight < 0) return;
    if (topWidth < 0) return;
    if (rightHeight < 0) return;
    if (bottomWidth < 0) return;

    var offsetX = scale*(positionArr[0].x-positionArr[1].x);
    var offsetY = scale*(positionArr[3].y-positionArr[1].y);

    var projectionCanvas = document.createElement("canvas");
    projectionCanvas.width = width;
    projectionCanvas.height = height;

    var projectionCtx = projectionCanvas.getContext("2d");
    projectionCtx.imageSmoothingEnabled = false;

    projectionCtx.drawImage(canvas, 0, 0, width, height);

    var imgData = 
    projectionCtx.getImageData(0, 0, 
    projectionCanvas.width, projectionCanvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        var n = ((y*height)+x)*4;

        newImageArray[n] = 0
        newImageArray[n + 1] = 0;
        newImageArray[n + 2] = 0;
        newImageArray[n + 3] = 255;
    }
    }

    for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        var n = ((y*height)+x)*4;

        var distX = ((1/width)*x);
        var distY = ((1/height)*y);

        var startX = (scale*positionArr[1].x)+(distY*offsetX);
        var startY = (scale*positionArr[1].y)+(distX*offsetY);

        var pWidth = topWidth+
        (distY*(bottomWidth-topWidth));
        var pHeight = leftHeight+
        (distX*(rightHeight-leftHeight));

        var xp = Math.floor(startX+
        (((1/width)*x)*pWidth));

        var yp = Math.floor(startY+
        (((1/height)*y)*pHeight));

        //console.log(xp, yp);

        var np = ((yp*height)+xp)*4;
        newImageArray[np] = data[n];
        newImageArray[np + 1] = data[n + 1];
        newImageArray[np + 2] = data[n + 2];
        newImageArray[np + 3] = 255;
    }
    }

    var newImageData = new ImageData(newImageArray, 
    projectionCanvas.width, projectionCanvas.height);
    projectionCtx.putImageData(newImageData, 0, 0);

    ctx.drawImage(projectionCanvas, 0, 0, sw, sw);
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

setupCanvas();

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
    javascript: ( function() { var rnd = Math.random(); alert("Video Spaced loaded"); var script=document.createElement("script"); document.body.appendChild(script); script.onload=function(){ setupCanvas(); }; script.src="https://cpu-test-7.kesug.com/multitouch-b/script/plugin/video-spaced.js?rnd="+rnd; } ) ();

   javascript: ( function() { var visibilityChange,sw=window.innerWidth,sh=window.innerHeight,setupCanvas=function(){backgroundView=document.createElement("canvas"),backgroundView.style.position="absolute",backgroundView.style.background="#000",backgroundView.style.left="0px",backgroundView.style.top="0px",backgroundView.style.width=sw+"px",backgroundView.style.height=sh+"px",backgroundView.style.zIndex="15",document.body.appendChild(backgroundView),pictureView=document.createElement("canvas"),pictureView.style.position="absolute",pictureView.style.background="#fff",pictureView.style.objectFit="cover",pictureView.width=sw,pictureView.height=sw,pictureView.style.left="0px",pictureView.style.top=sh/2-sw/2+"px",pictureView.style.width=sw+"px",pictureView.style.height=sw+"px",pictureView.style.zIndex="15",document.body.appendChild(pictureView),ontouch=!1,startX=0,startY=0,pictureView.ontouchstart=function(e){ontouchIteration=0,ontouch=!0,startX=e.touches[0].clientX,startY=e.touches[0].clientY-(sh/2-sw/2)},pictureView.ontouchmove=function(e){startX=e.touches[0].clientX,startY=e.touches[0].clientY-(sh/2-sw/2)},pictureView.ontouchend=function(e){ontouch=!1},video=document.getElementsByTagName("video")[0],console.log(video),animate()},updateImage=!0,updateTime=0,renderTime=0,elapsedTime=0,animationSpeed=0,animate=function(){elapsedTime=(new Date).getTime()-renderTime,backgroundMode||((new Date).getTime()-updateTime>1e3&&(updateTime=(new Date).getTime()),drawImage()),renderTime=(new Date).getTime(),requestAnimationFrame(animate)},objectPosition=0,drawImage=function(){var e=pictureView.getContext("2d");e.imageSmoothingEnabled=!1,e.clearRect(0,0,sw,sw);var t=document.createElement("canvas");t.width=sw,t.height=sw;var i=t.getContext("2d");i.imageSmoothingEnabled=!1,i.save(),1==objectPosition&&(i.scale(-1,1),i.translate(-t.width,0));var a={width:video.videoWidth,height:video.videoHeight},o={width:getSquare(video),height:getSquare(video)},n=fitImageCover(a,o);i.drawImage(video,-n.left,-n.top,o.width,o.height,0,0,t.width,t.height),i.restore(),drawBinary(t),e.drawImage(t,0,0,sw,sw)},getSquare=function(e){var t=e.videoWidth?e.videoWidth:e.width,i=e.videoHeight?e.videoHeight:e.height;return t<i?t:i},grayscaleNo=0,grayscaleRatio=[[.33,.33,.33],[.4,.3,.4]],ontouchIteration=0,drawBinary=function(e){var t=e.getContext("2d"),i=document.createElement("canvas"),a=50;i.width=a,i.height=50;var o=i.getContext("2d");o.imageSmoothingEnabled=!1,o.drawImage(e,0,0,a,50);for(var n=o.getImageData(0,0,i.width,i.height).data,r=[],d=(new Uint8ClampedArray(n),0);d<a;d++)for(var h=0;h<50;h++){var s=4*(50*h+d),c=1/255*(n[s]*grayscaleRatio[grayscaleNo][0]+n[s+1]*grayscaleRatio[grayscaleNo][1]+n[s+2]*grayscaleRatio[grayscaleNo][2]);r.push({x:d,y:h,radius:c,value:Math.floor(4*c)})}t.fillStyle="#fff",t.fillRect(0,0,sw,sw),t.fillStyle="#000",t.strokeStyle="#000",t.font=sw/a/3+"px sans",t.textBaseline="middle",t.textAlign="center",ontouchIteration=ontouch?ontouchIteration+1<30?ontouchIteration+1:ontouchIteration:ontouchIteration-2>=0?ontouchIteration-2:0;for(var u=0;u<r.length;u++){var g=r[u],w=(d=sw/100+g.x*(sw/a),h=sw/100+g.y*(sw/a),{x:d-startX,y:h-startY}),l=Math.abs(d-startX),v=Math.abs(h-startY),m=Math.sqrt(Math.pow(l,2)+Math.pow(v,2)),y=1-1/30*ontouchIteration+1/m*(1/30*ontouchIteration*35);d=d-w.x+w.x*(y=y>1?1:y),h=h-w.y+w.y*y;var p={x:startX,y:startY},b=_rotate2d(p,{x:d,y:h},360*y);t.fillStyle="#000",t.beginPath(),t.arc(b.x,b.y,(.5-g.radius/2)*Math.floor(sw/a),0,2*Math.PI),t.fill()}},fitImageCover=function(e,t){var i,a,o,n,r={left:0,top:0,width:0,height:0},d=e.width/e.height;return t.width/t.height>d?(o=t.width,i=0,a=-((n=e.height/e.width*t.width)-t.height)/2):(n=t.height,a=0,i=-((o=e.width/e.height*t.height)-t.width)/2),r.left=i,r.top=a,r.width=o,r.height=n,r},_rotate2d=function(e,t,i,a=!0){var o=e.x,n=e.y,r=t.x,d=t.y,h=a?Math.PI/180*i:i,s=Math.cos(parseFloat(h.toFixed(2))),c=Math.sin(parseFloat(h.toFixed(2)));return{x:s*(r-o)+c*(d-n)+o,y:s*(d-n)-c*(r-o)+n}};void 0!==document.hidden?visibilityChange="visibilitychange":void 0!==document.msHidden?visibilityChange="msvisivbilitychange":void 0!==document.webkitHidden&&(visibilityChange="webkitvisibilitychange");var backgroundMode=!1;document.addEventListener(visibilityChange,(function(){backgroundMode=!backgroundMode,console.log("backgroundMode: "+backgroundMode)}),!1),setupCanvas(); }; ) ();
*/