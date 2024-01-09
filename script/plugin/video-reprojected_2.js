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

    backgroundOffset = 0.1;

    backgroundOffsetView = document.createElement("input");
    backgroundOffsetView.style.position = "absolute";
    backgroundOffsetView.type = "range";
    backgroundOffsetView.value = backgroundOffset;
    backgroundOffsetView.min = 0.01;
    backgroundOffsetView.max = 1;
    backgroundOffsetView.step = 0.01;
    backgroundOffsetView.style.left = (10)+"px";
    backgroundOffsetView.style.top = ((sh/2)-(sw/2)-60)+"px";
    backgroundOffsetView.style.width = (sw-20)+"px";
    backgroundOffsetView.style.height = (50)+"px";
    backgroundOffsetView.style.zIndex = "15";
    document.body.appendChild(backgroundOffsetView);

    backgroundOffsetView.oninput = function(e) {
        backgroundOffset = e.target.value;
    };

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

    resolution = 0;
    var currentResolution = resolution == 0 ? sw : (8*resolution);

    previousVideoCanvas = 
    document.createElement("canvas");
    previousVideoCanvas.width = (currentResolution);
    previousVideoCanvas.height = (currentResolution);

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

    drawVideo(resolutionCanvas);

    ctx.drawImage(resolutionCanvas, 0, 0, sw, sw);
};

var getColorAtPixel = function(imageData, x, y) {
    var {width, data} = imageData

    return {
        r: data[4 * (width * y + x) + 0],
        g: data[4 * (width * y + x) + 1],
        b: data[4 * (width * y + x) + 2],
        a: data[4 * (width * y + x) + 3]
    }
}

var setColorAtPixel = function(imageData, color, x, y) {
    var {width, data} = imageData

    data[4 * (width * y + x) + 0] = color.r & 0xff
    data[4 * (width * y + x) + 1] = color.g & 0xff
    data[4 * (width * y + x) + 2] = color.b & 0xff
    data[4 * (width * y + x) + 3] = color.a & 0xff
}

var colorMatch = function(a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
}

var floodFill = function(imageData, newColor, x, y) {
    var { width, height, data } = imageData;
    var stack = [];
    var baseColor = getColorAtPixel(imageData, x, y);
    var operator = { x, y };

    // Check if base color and new color are the same
    if (colorMatch(baseColor, newColor)) {
        return;
    }

    // Add the clicked location to stack
    stack.push({ x: operator.x, y: operator.y })

    while (stack.length) {
        operator = stack.pop();
        var contiguousDown = true // Vertical is assumed to be true
        var contiguousUp = true // Vertical is assumed to be true
        var contiguousLeft = false
        var contiguousRight = false

        // Move to top most contiguousDown pixel
        while (contiguousUp && operator.y >= 0) {
            operator.y--;
            contiguousUp = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
        }

        // Move downward
        while (contiguousDown && operator.y < height) {
            setColorAtPixel(imageData, newColor, 
            operator.x, operator.y);

            // Check left
            if (operator.x - 1 >= 0 && 
            colorMatch(getColorAtPixel(imageData, 
            operator.x - 1, operator.y), baseColor)) {
                if (!contiguousLeft) {
                    contiguousLeft = true;
                    stack.push({x: operator.x - 1, y: operator.y})
                }
            } else {
                contiguousLeft = false;
            }

            // Check right
            if (operator.x + 1 < width && 
            colorMatch(getColorAtPixel(imageData, 
            operator.x + 1, operator.y), baseColor)) {
                if (!contiguousRight) {
                    stack.push({x: operator.x + 1, y: operator.y})
                    contiguousRight = true;
                }
            } else {
                contiguousRight = false;
            }

            operator.y++
            contiguousDown = 
            colorMatch(getColorAtPixel(imageData, 
            operator.x, operator.y), baseColor)
        }
    }
}

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

var drawVideo = function(canvas) {
    var videoCtx = canvas.getContext("2d");

    var videoImgData = 
    videoCtx.getImageData(0, 0, 
    canvas.width, canvas.height);
    var videoData = videoImgData.data;

    var previousVideoCtx = 
    previousVideoCanvas.getContext("2d");

    var previousVideoImgData = 
    previousVideoCtx.getImageData(0, 0, 
    previousVideoCanvas.width, previousVideoCanvas.height);
    var previousVideoData = previousVideoImgData.data;

    var currentResolution = resolution == 0 ? sw : (8*resolution);

    var newImageArray = 
    new Uint8ClampedArray(videoData);

    var previousNewImageArray = 
    new Uint8ClampedArray(previousVideoData);

    var x = (currentResolution/2);
    var y = (currentResolution/2);
    var n = ((y*currentResolution)+x)*4;
    var newColor =  {
        r: 255, // videoData[n],
        g: 255, //videoData[n + 1],
        b: 0, //videoData[n + 2],
        a: 255
    };

    for (var y = 0; y < currentResolution; y++) {
    for (var x = 0; x < currentResolution; x++) {

        var n = ((y*currentResolution)+x)*4;

        var brightness = 
        (1/255) * 
        ((videoData[n] * grayscaleRatio[grayscaleNo][0]) + 
        (videoData[n + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (videoData[n + 2] * grayscaleRatio[grayscaleNo][2]));

        var previousBrightness = 
        (1/255) * 
        ((previousVideoData[n] * grayscaleRatio[grayscaleNo][0]) + 
        (previousVideoData[n + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (previousVideoData[n + 2] * grayscaleRatio[grayscaleNo][2]));

        newImageArray[n] = 
        videoData[n] * grayscaleRatio[grayscaleNo][0];
        newImageArray[n + 1] = 
        videoData[n + 1] * grayscaleRatio[grayscaleNo][1];
        newImageArray[n + 2] = 
        videoData[n + 2] * grayscaleRatio[grayscaleNo][2];

        if (Math.abs((brightness - previousBrightness)) > backgroundOffset) {
            previousNewImageArray[n] = videoData[n];
            previousNewImageArray[n + 1] = videoData[n + 1];
            previousNewImageArray[n + 2] = videoData[n + 2];

            newImageArray[n] = 255;
            newImageArray[n + 1] = 255;
            newImageArray[n + 2] = 255;
        }

        if (Math.abs((brightness - previousBrightness)) <= backgroundOffset) {
            newImageArray[n] = 0;
            newImageArray[n + 1] = 0;
            newImageArray[n + 2] = 0;
        }

    }
    }

    var x = (currentResolution/2);
    var y = (currentResolution/2);
    var n = ((y*currentResolution)+x)*4;
    var baseColor =  {
        r: newImageArray[n],
        g: newImageArray[n + 1],
        b: newImageArray[n + 2],
        a: 255
    };

    var newImageData = new ImageData(newImageArray, canvas.width, canvas.height);

    /*
    if (baseColor.r == 255 && 
    baseColor.g == 255 && 
    baseColor.b == 255)
    floodFill(newImageData, newColor, 
    (currentResolution/2), (currentResolution/2));*/

    videoCtx.putImageData(newImageData, 0, 0);

    var previousNewImageData = new ImageData(
    previousNewImageArray, 
    previousVideoCanvas.width, previousVideoCanvas.height);
    previousVideoCtx.putImageData(
    previousNewImageData, 0, 0);
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
    javascript: ( function() { var rnd = Math.random(); alert("Video Spaced loaded"); var script=document.createElement("script"); document.body.appendChild(script); script.onload=function(){ setupCanvas(); }; script.src="https://cpu-test-7.kesug.com/multitouch-b/script/plugin/video-spaced.js?rnd="+rnd; } ) ();

   javascript: ( function() { var visibilityChange,sw=window.innerWidth,sh=window.innerHeight,setupCanvas=function(){backgroundView=document.createElement("canvas"),backgroundView.style.position="absolute",backgroundView.style.background="#000",backgroundView.style.left="0px",backgroundView.style.top="0px",backgroundView.style.width=sw+"px",backgroundView.style.height=sh+"px",backgroundView.style.zIndex="15",document.body.appendChild(backgroundView),pictureView=document.createElement("canvas"),pictureView.style.position="absolute",pictureView.style.background="#fff",pictureView.style.objectFit="cover",pictureView.width=sw,pictureView.height=sw,pictureView.style.left="0px",pictureView.style.top=sh/2-sw/2+"px",pictureView.style.width=sw+"px",pictureView.style.height=sw+"px",pictureView.style.zIndex="15",document.body.appendChild(pictureView),ontouch=!1,startX=0,startY=0,pictureView.ontouchstart=function(e){ontouchIteration=0,ontouch=!0,startX=e.touches[0].clientX,startY=e.touches[0].clientY-(sh/2-sw/2)},pictureView.ontouchmove=function(e){startX=e.touches[0].clientX,startY=e.touches[0].clientY-(sh/2-sw/2)},pictureView.ontouchend=function(e){ontouch=!1},video=document.getElementsByTagName("video")[0],console.log(video),animate()},updateImage=!0,updateTime=0,renderTime=0,elapsedTime=0,animationSpeed=0,animate=function(){elapsedTime=(new Date).getTime()-renderTime,backgroundMode||((new Date).getTime()-updateTime>1e3&&(updateTime=(new Date).getTime()),drawImage()),renderTime=(new Date).getTime(),requestAnimationFrame(animate)},objectPosition=0,drawImage=function(){var e=pictureView.getContext("2d");e.imageSmoothingEnabled=!1,e.clearRect(0,0,sw,sw);var t=document.createElement("canvas");t.width=sw,t.height=sw;var i=t.getContext("2d");i.imageSmoothingEnabled=!1,i.save(),1==objectPosition&&(i.scale(-1,1),i.translate(-t.width,0));var a={width:video.videoWidth,height:video.videoHeight},o={width:getSquare(video),height:getSquare(video)},n=fitImageCover(a,o);i.drawImage(video,-n.left,-n.top,o.width,o.height,0,0,t.width,t.height),i.restore(),drawBinary(t),e.drawImage(t,0,0,sw,sw)},getSquare=function(e){var t=e.videoWidth?e.videoWidth:e.width,i=e.videoHeight?e.videoHeight:e.height;return t<i?t:i},grayscaleNo=0,grayscaleRatio=[[.33,.33,.33],[.4,.3,.4]],ontouchIteration=0,drawBinary=function(e){var t=e.getContext("2d"),i=document.createElement("canvas"),a=50;i.width=a,i.height=50;var o=i.getContext("2d");o.imageSmoothingEnabled=!1,o.drawImage(e,0,0,a,50);for(var n=o.getImageData(0,0,i.width,i.height).data,r=[],d=(new Uint8ClampedArray(n),0);d<a;d++)for(var h=0;h<50;h++){var s=4*(50*h+d),c=1/255*(n[s]*grayscaleRatio[grayscaleNo][0]+n[s+1]*grayscaleRatio[grayscaleNo][1]+n[s+2]*grayscaleRatio[grayscaleNo][2]);r.push({x:d,y:h,radius:c,value:Math.floor(4*c)})}t.fillStyle="#fff",t.fillRect(0,0,sw,sw),t.fillStyle="#000",t.strokeStyle="#000",t.font=sw/a/3+"px sans",t.textBaseline="middle",t.textAlign="center",ontouchIteration=ontouch?ontouchIteration+1<30?ontouchIteration+1:ontouchIteration:ontouchIteration-2>=0?ontouchIteration-2:0;for(var u=0;u<r.length;u++){var g=r[u],w=(d=sw/100+g.x*(sw/a),h=sw/100+g.y*(sw/a),{x:d-startX,y:h-startY}),l=Math.abs(d-startX),v=Math.abs(h-startY),m=Math.sqrt(Math.pow(l,2)+Math.pow(v,2)),y=1-1/30*ontouchIteration+1/m*(1/30*ontouchIteration*35);d=d-w.x+w.x*(y=y>1?1:y),h=h-w.y+w.y*y;var p={x:startX,y:startY},b=_rotate2d(p,{x:d,y:h},360*y);t.fillStyle="#000",t.beginPath(),t.arc(b.x,b.y,(.5-g.radius/2)*Math.floor(sw/a),0,2*Math.PI),t.fill()}},fitImageCover=function(e,t){var i,a,o,n,r={left:0,top:0,width:0,height:0},d=e.width/e.height;return t.width/t.height>d?(o=t.width,i=0,a=-((n=e.height/e.width*t.width)-t.height)/2):(n=t.height,a=0,i=-((o=e.width/e.height*t.height)-t.width)/2),r.left=i,r.top=a,r.width=o,r.height=n,r},_rotate2d=function(e,t,i,a=!0){var o=e.x,n=e.y,r=t.x,d=t.y,h=a?Math.PI/180*i:i,s=Math.cos(parseFloat(h.toFixed(2))),c=Math.sin(parseFloat(h.toFixed(2)));return{x:s*(r-o)+c*(d-n)+o,y:s*(d-n)-c*(r-o)+n}};void 0!==document.hidden?visibilityChange="visibilitychange":void 0!==document.msHidden?visibilityChange="msvisivbilitychange":void 0!==document.webkitHidden&&(visibilityChange="webkitvisibilitychange");var backgroundMode=!1;document.addEventListener(visibilityChange,(function(){backgroundMode=!backgroundMode,console.log("backgroundMode: "+backgroundMode)}),!1),setupCanvas(); }; ) ();
*/