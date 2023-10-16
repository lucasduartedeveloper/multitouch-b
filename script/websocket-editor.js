var beepDone = new Audio("audio/beep-done.wav");
var beepMilestone = new Audio("audio/beep-milestone.wav");

var bgmNo = 0;
var bgm = new Audio();
var playbackRate = 1;
bgm.oncanplay = function() {
    bgm.playbackRate = playbackRate;
};

var reverseBgm = new Audio();

var sw = window.innerWidth;
var sh = window.innerHeight;

var audioBot = false;
var playerId = new Date().getTime();

var canvasBackgroundColor = "rgba(255,255,255,1)";
var backgroundColor = "rgba(50,50,65,1)";
var buttonColor = "rgba(75,75,90,1)";

// Botão de gravação
$(document).ready(function() {
    $("html, body").css("overscroll-behavior", "none");
    $("html, body").css("overflow", "hidden");
    $("html, body").css("background", backgroundColor);
    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");

    $("#title")[0].innerText = "";

    camera = document.createElement("video");
    camera.style.position = "absolute";
    camera.autoplay = true;
    camera.style.objectFit = "cover";
    camera.width = (sw);
    camera.height = (sh); 
    camera.style.left = (0)+"px";
    camera.style.top = (0)+"px";
    camera.style.width = (sw)+"px";
    camera.style.height = (sh)+"px";
    camera.style.transform = (deviceNo == 0) ? 
    "rotateY(-180deg)" : "initial";
    camera.style.zIndex = "15";
    document.body.appendChild(camera);
    cameraElem = camera;

    frameView = document.createElement("canvas");
    frameView.style.position = "absolute";
    frameView.width = (sw);
    frameView.height = (sh);
    frameView.style.left = (0)+"px";
    frameView.style.top = (0)+"px";
    frameView.style.width = (sw)+"px";
    frameView.style.height = (sh)+"px"; 
    frameView.style.zIndex = "15";
    document.body.appendChild(frameView);

    frameView.getContext("2d").imageSmoothingEnabled = false;

    frameView.onclick = function() {
        if (cameraOn) {
            updateImage = !updateImage;
        }
        else {
            startCamera();
        }
    };

    var startX = 0;
    var startY = 0;
    var x = 0;
    var y = 0;

    /*
    frameView.ontouchstart = function(e) {
        var size = (sw/resolution);

        x = Math.floor(e.touches[0].clientX / size);
        y = Math.floor(e.touches[0].clientY / size);

        var moveX = (e.touches[0].clientX / size);
        var moveY = (e.touches[0].clientY / size);
        updatePosition(moveX, moveY);
    };

    frameView.ontouchmove = function(e) {
        var size = (sw/resolution);

        var moveX = (e.touches[0].clientX / size);
        var moveY = (e.touches[0].clientY / size);
        //updatePosition(moveX, moveY);
    };*/

    resolutionView = document.createElement("canvas");
    resolutionView.width = (sw);
    resolutionView.height = (sh);

    resolutionView.getContext("2d").imageSmoothingEnabled = false;

    downloadView = document.createElement("span");
    downloadView.style.position = "absolute";
    downloadView.style.background = backgroundColor;
    downloadView.style.background = "#fff";
    downloadView.style.color = "#000";
    downloadView.style.fontWeight = "900";
    downloadView.innerText = "DOWNLOAD";
    downloadView.style.lineHeight = "50px";
    downloadView.style.fontSize = "15px";
    downloadView.style.textAlign = "center";
    downloadView.style.fontFamily = "Khand";
    downloadView.style.left = (10)+"px";
    downloadView.style.top = ((sh-60))+"px";
    downloadView.style.width = (100)+"px";
    downloadView.style.height = (50)+"px"; 
    downloadView.style.scale = "0.9";
    downloadView.style.border = "1px solid #000"; 
    downloadView.style.borderRadius= "25px";
    downloadView.style.zIndex = "15";
    document.body.appendChild(downloadView);

    downloadView.onclick = function() {
        var dataURL = frameView.toDataURL();
        var hiddenElement = document.createElement('a');
        hiddenElement.href = dataURL;
        hiddenElement.target = "_blank";
        hiddenElement.download = "photo.png";
        hiddenElement.click();
    };

    var typeList = 
    [ "ONE TYPE", "TWO TYPES", "TRIANGLES", "HEXAGONS", 
    "RECTANGLES" ];
    var typeNo = 1;
    typeView = document.createElement("span");
    typeView.style.position = "absolute";
    typeView.style.background = backgroundColor;
    typeView.style.background = "#fff";
    typeView.style.color = "#000";
    typeView.style.fontWeight = "900";
    typeView.innerText = typeList[typeNo];
    typeView.style.lineHeight = "50px";
    typeView.style.fontSize = "15px";
    typeView.style.textAlign = "center";
    typeView.style.fontFamily = "Khand";
    typeView.style.left = (110)+"px";
    typeView.style.top = ((sh-60))+"px";
    typeView.style.width = (100)+"px";
    typeView.style.height = (50)+"px"; 
    typeView.style.scale = "0.9";
    typeView.style.border = "1px solid #000"; 
    typeView.style.borderRadius= "25px";
    typeView.style.zIndex = "15";
    document.body.appendChild(typeView);

    typeView.onclick = function() {
        typeNo = (typeNo+1) < 5 ? (typeNo+1) : 0;
        type = typeNo;
        typeView.innerText = typeList[typeNo];
    };

    countView = document.createElement("span");
    countView.style.position = "absolute";
    countView.style.background = backgroundColor;
    countView.style.background = "#fff";
    countView.style.color = "#000";
    countView.style.fontWeight = "900";
    countView.innerText = (resolution+"x");
    countView.style.lineHeight = "50px";
    countView.style.fontSize = "15px";
    countView.style.textAlign = "center";
    countView.style.fontFamily = "Khand";
    countView.style.left = (210)+"px";
    countView.style.top = ((sh-60))+"px";
    countView.style.width = (100)+"px";
    countView.style.height = (50)+"px"; 
    countView.style.scale = "0.9";
    countView.style.border = "1px solid #000"; 
    countView.style.borderRadius= "25px";
    countView.style.zIndex = "15";
    document.body.appendChild(countView);

    countView.onclick = function() {
        resolution = 
        ((Math.floor(resolution/5)*5)+5) < 30 ? 
        ((Math.floor(resolution/5)*5)+5) : 5;
        updateResolution(resolution);
        countView.innerText = (resolution+"x");
    };

    deviceList = [ "front", "back", "back1", "back2", "back3" ];
    deviceView = document.createElement("span");
    deviceView.style.position = "absolute";
    deviceView.style.background = backgroundColor;
    deviceView.style.background = "#fff";
    deviceView.style.color = "#000";
    deviceView.style.fontWeight = "900";
    deviceView.innerText = deviceList[deviceNo];
    deviceView.style.lineHeight = "50px";
    deviceView.style.fontSize = "15px";
    deviceView.style.textAlign = "center";
    deviceView.style.fontFamily = "Khand";
    deviceView.style.left = (10)+"px";
    deviceView.style.top = ((sh-110))+"px";
    deviceView.style.width = (50)+"px";
    deviceView.style.height = (50)+"px"; 
    deviceView.style.scale = "0.9";
    deviceView.style.border = "1px solid #000"; 
    deviceView.style.borderRadius= "25px";
    deviceView.style.zIndex = "15";
    document.body.appendChild(deviceView);

    deviceView.onclick = function() {
        deviceNo = (deviceNo+1) < videoDevices.length ? 
        (deviceNo+1) : 0;
        deviceView.innerText = deviceList[deviceNo];
    };

    colorMode = 0;
    colorModeView = document.createElement("span");
    colorModeView.style.position = "absolute";
    colorModeView.style.background = backgroundColor;
    colorModeView.style.background = "#fff";
    colorModeView.style.color = "#000";
    colorModeView.style.fontWeight = "900";
    colorModeView.innerText = "0";
    colorModeView.style.lineHeight = "50px";
    colorModeView.style.fontSize = "15px";
    colorModeView.style.textAlign = "center";
    colorModeView.style.fontFamily = "Khand";
    colorModeView.style.left = (60)+"px";
    colorModeView.style.top = ((sh-110))+"px";
    colorModeView.style.width = (50)+"px";
    colorModeView.style.height = (50)+"px"; 
    colorModeView.style.scale = "0.9";
    colorModeView.style.border = "1px solid #000"; 
    colorModeView.style.borderRadius= "25px";
    colorModeView.style.zIndex = "15";
    document.body.appendChild(colorModeView);

    colorModeView.onclick = function() {
        colorMode = (colorMode+1) < 3 ? (colorMode+1) : 0;
        colorModeView.innerText = colorMode;
    };

    moveView = document.createElement("i");
    moveView.style.position = "absolute";
    moveView.style.color = "#888";
    moveView.style.lineHeight = (sh)+"px";
    moveView.className = "fa-solid fa-plus";
    moveView.style.left = (0)+"px";
    moveView.style.top = (0)+"px";
    moveView.style.width = (sw)+"px";
    moveView.style.height = (sh)+"px"; 
    moveView.style.border = "1px dashed #888";
    moveView.style.zIndex = "15";
    document.body.appendChild(moveView);

    updateResolution(5);
    animate();
});

var updateImage = true;

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if (!(!updateImage && colorMode == 1))
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var updateResolution = function(n) {
    resolution = n;
    var r = (sw/sh);

    resolutionView.width = (resolution);
    resolutionView.height = Math.floor((resolution/r))+1;

    moveView.style.width = (sw/resolution)+"px";
    moveView.style.height = (sw/resolution)+"px"; 
    moveView.style.lineHeight = (sw/resolution)+"px";

    createArray();
};

var resolution = 10;

var imageArray = [];

var drawImage = function() {
    ctxResolution = resolutionView.getContext("2d");
    ctxResolution.save();
    if (deviceNo == 0) {
        ctxResolution.scale(-1, 1);
        ctxResolution.translate(-resolution, 0);
    }

    if (updateImage) {
        var r = (vw/vh);
        var image = {
            width: resolution,
            height: resolution/r
        };

        var frame = {
            width: resolutionView.width,
            height: resolutionView.height
        };

        var format = fitImageCover(image, frame);

        ctxResolution.drawImage(camera, format.left, 
        format.top, format.width, format.height);

        ctxResolution.restore();
    }

    ctx = frameView.getContext("2d");
    ctx.clearRect(0, 0, sw, sh);

    if (colorMode == 1) {
        var image = {
            width: vw,
            height: vh
        };

        var frame = {
            width: sw,
            height: sh
        };

        var format = fitImageCover(image, frame);
        ctx.drawImage(camera, format.left,
        format.top, format.width, format.height);
    }

    ctx.lineWidth = 2;
    var size = (sw/resolution);

    updateArray();

    var width = resolutionView.width;
    var height = resolutionView.height;
    for (var n = 0; n < positionArray.length; n++) {
        if (cameraOn)
        ctx.strokeStyle = "#000";
        else
        ctx.strokeStyle = positionArray[n].selected ? 
        "orange" : "#888";

        ctx.save();
        var c = positionArray[n];

        var w = ((c.y*resolution)+c.x)*4;
        ctx.fillStyle = "rgba("+
        imageArray[w]+","+
        imageArray[w+1]+","+
        imageArray[w+2]+",1)";

        var polygon; 
        if (type < 2)
        polygon = createPolygon(c, size, c.x, c.y);
        else if (type == 2)
        polygon = createPolygon3(c, size, c.x, c.y, 0);
        else if (type == 3)
        polygon = createPolygon6(c, size, c.x, c.y, 0);
        else if (type == 4)
        polygon = createPolygon8(c, size, c.x, c.y, 0);

        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);
        for (var k = 1; k < polygon.length; k++) {
            ctx.lineTo(polygon[k].x, polygon[k].y);
        }
        ctx.stroke();
        if (colorMode == 0)
        ctx.fill();

        if (type == 2 || type == 4) {
            var red = Math.floor(Math.random()*255);
            var green = Math.floor(Math.random()*255);
            var blue = Math.floor(Math.random()*255);

            var brightness = 0.7;
            ctx.fillStyle = "rgba("+
            Math.floor(imageArray[w]*brightness)+","+
            Math.floor(imageArray[w+1]*brightness)+","+
            Math.floor(imageArray[w+2]*brightness)+",1)";

            var polygon;
            if (type == 2)
            polygon = createPolygon3(c, size, c.x, c.y, 3);
            else if (type == 4)
            polygon = createPolygon8(c, size, c.x, c.y, 1);

            ctx.beginPath();
            ctx.moveTo(polygon[0].x, polygon[0].y);
            for (var k = 1; k < polygon.length; k++) {
                ctx.lineTo(polygon[k].x, polygon[k].y);
            }
            ctx.stroke();
            if (colorMode == 0)
            ctx.fill();
        }

        ctx.restore();
    }
};

var drawToShape = function(ctx) {
    ctx.clip();

    var image = {
        width: vw,
        height: vh
    };

    var frame = {
        width: sw,
        height: sh
    };

    var offsetX = (c.x-1)*size;
    var offsetY = (c.y-1)*size;

    var format = fitImageCover(image, frame);
    ctx.drawImage(camera, (format.left+offsetX), 
    (format.top+offsetY), size*2, size*2, 
    offsetX, offsetY, size*2, size*2);
};

var positionArray = [];
var createArray = function() {
    var width = resolutionView.width;
    var height = resolutionView.height;
    positionArray = [];
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var pos = {
                x: x, y: y,
                moveX: (x+0.5),
                moveY: (y+0.5) 
            };
            positionArray.push(pos);
        }
    }
};

var updatePosition = function(moveX, moveY) {
    var size = (sw/resolution);
    var reverseArray = positionArray.toReversed();

    var nr = reverseArray.findIndex((o) => { 
        if ((o.moveX*size) > ((moveX*size)-size) && 
        (o.moveX*size) < ((moveX*size)+size) && 
        (o.moveY*size) > ((moveY*size)-size) && 
        (o.moveY*size) < ((moveY*size)+size)) {
            console.log((o.moveX*size) + " > " + 
            ((moveX*size)-size));
            console.log((o.moveX*size) + " < " + 
            ((moveX*size)+size));
            console.log((o.moveY*size) + " > " + 
            ((moveY*size)-size));
            console.log((o.moveY*size) + " < " + 
            ((moveY*size)+size));
        }

        return (o.moveX*size) > ((moveX*size)-size) && 
        (o.moveX*size) < ((moveX*size)+size) && 
        (o.moveY*size) > ((moveY*size)-size) && 
        (o.moveY*size) < ((moveY*size)+size);
    });

    var n = (positionArray.length-1)-nr;
    console.log(n);

    var offsetX = (moveX % 0.5);
    var offsetY = (moveY % 0.5);
    console.log(moveX, moveY, offsetX, offsetY);
    var positionX = (moveX-offsetX);
    var positionY = (moveY-offsetY);

    for (var k = 0; k < positionArray.length; k++) {
        positionArray[k].selected = false
    }

    /*positionArray[n].moveX = positionX; //moveX;
    positionArray[n].moveY = positionY; //moveY;*/
    positionArray[n].selected = true;

    moveView.style.left = ((moveX*size)-(size/2))+"px";
    moveView.style.top = ((moveY*size)-(size/2))+"px";

    var pos = positionArray.splice(n, 1)[0];
    positionArray.push(pos);
};

var updateArray = function() {
    var ctxResolution = resolutionView.getContext("2d");
    var imageData = ctxResolution.getImageData(0, 0,
    resolutionView.width, resolutionView.height);
    imageArray = imageData.data;
};

var type = 1;
var createPolygon = function(pos, size, x, y) {
    var lineEven = y % 2 == 0;
    var columnEven = x % 2 == 0;
    var polygon = [];

    polygon.push({ x: -1 , y: 1 });
    polygon.push({ x: -1 , y: (2/6) });

    if (x > 0 && type == 0) {
    var c = { x: -1, y: 0 };
    var p = { x: -1, y: (2/6) };
    for (var n = 0; n < 60; n++) {
        var rp = _rotate2d(c, p, (n*(180/60)));
        polygon.push(rp);
    };
    }

    if (x > 0 && type == 1) {
    var c = { x: -1, y: 0 };
    var p = { x: -1, y: (2/6) };
    for (var n = 0; n < 60; n++) {
        var rp = lineEven ? 
        (columnEven ? 
        _rotate2d(c, p, (n*(180/60))) :
        _rotate2d(c, p, -(n*(180/60)))) : 
        (columnEven ? 
        _rotate2d(c, p, -(n*(180/60))) :
        _rotate2d(c, p, (n*(180/60))));
        polygon.push(rp);
    };
    }

    polygon.push({ x: -1, y: -(2/6) });
    polygon.push({ x: -1, y: -1 });
    polygon.push({ x: -(2/6), y: -1 });

    if (y > 0 && type == 0) {
    var c = { x: 0, y: -1 };
    var p = { x: -(2/6), y: -1 };
    for (var n = 0; n < 60; n++) {
        var rp = _rotate2d(c, p, -(n*(180/60)));
        polygon.push(rp);
    };
    }

    if (y > 0 && type == 1) {
    var c = { x: 0, y: -1 };
    var p = { x: -(2/6), y: -1 };
    for (var n = 0; n < 60; n++) {
        var rp = columnEven ? 
        (lineEven ? 
        _rotate2d(c, p, -(n*(180/60))) :
        _rotate2d(c, p, (n*(180/60)))) : 
        (lineEven ? 
        _rotate2d(c, p, (n*(180/60))) :
        _rotate2d(c, p, -(n*(180/60))));
        polygon.push(rp);
    };
    }

    polygon.push({ x: (2/6), y: -1 });
    polygon.push({ x: 1 , y: -1 });
    polygon.push({ x: 1 , y: -(2/6) });

    if (x < (resolution-1) && type == 0) {
    var c = { x: 1, y: 0 };
    var p = { x: 1, y: -(2/6) };
    for (var n = 0; n < 60; n++) {
        var rp = _rotate2d(c, p, -(n*(180/60)));
        polygon.push(rp);
    };
    }

    if (x < (resolution-1) && type == 1) {
    var c = { x: 1, y: 0 };
    var p = { x: 1, y: -(2/6) };
    for (var n = 0; n < 60; n++) {
        var rp = lineEven ? 
        (columnEven ? 
        _rotate2d(c, p, (n*(180/60))) :
        _rotate2d(c, p, -(n*(180/60)))) : 
        (columnEven ? 
        _rotate2d(c, p, -(n*(180/60))) :
        _rotate2d(c, p, (n*(180/60))));
        polygon.push(rp);
    };
    }

    polygon.push({ x: 1, y: (2/6) });
    polygon.push({ x: 1 , y: 1 });
    polygon.push({ x: (2/6), y: 1 });

    var height = resolutionView.height;
    if (y < (height-1) && type == 0) {
    var c = { x: 0, y: 1 };
    var p = { x: (2/6), y: 1 };
    for (var n = 0; n < 60; n++) {
        var rp = _rotate2d(c, p, (n*(180/60)));
        polygon.push(rp);
    };
    }

    if (y < (height-1) && type == 1) {
    var c = { x: 0, y: 1 };
    var p = { x: (2/6), y: 1 };
    for (var n = 0; n < 60; n++) {
        var rp = columnEven ? 
        (lineEven ? 
        _rotate2d(c, p, -(n*(180/60))) :
        _rotate2d(c, p, (n*(180/60)))) : 
        (lineEven ? 
        _rotate2d(c, p, (n*(180/60))) :
        _rotate2d(c, p, -(n*(180/60))));
        polygon.push(rp);
    };
    }

    polygon.push({ x: -(2/6), y: 1 });
    polygon.push({ x: -1, y: 1 });

    for (var n = 0; n < polygon.length; n++) {
        polygon[n].x = (pos.moveX + (polygon[n].x/2))*size;
        polygon[n].y = (pos.moveY + (polygon[n].y/2))*size;
    }

    //console.log(polygon);
    return polygon;
};

var createPolygon3 = function(pos, size, x, y, dir) {
    var polygon = [];

    switch (dir) {
        case 0:
            polygon.push({ x: 1 , y: -1 });
            polygon.push({ x: -1 , y: -1 });
            polygon.push({ x: -1 , y: 1 });
            polygon.push({ x: 1 , y: -1 });
            break;

        case 1:
            polygon.push({ x: -1 , y: -1 });
            polygon.push({ x: -1 , y: 1 });
            polygon.push({ x: 1 , y: 1 });
            polygon.push({ x: -1 , y: -1 });
            break;

        case 2:
            polygon.push({ x: 1 , y: -1 });
            polygon.push({ x: -1 , y: -1 });
            polygon.push({ x: -1 , y: 1 });
            polygon.push({ x: 1 , y: -1 });
            break;

        case 3:
            polygon.push({ x: 1 , y: -1 });
            polygon.push({ x: 1 , y: 1 });
            polygon.push({ x: -1 , y: 1 });
            polygon.push({ x: 1 , y: -1 });
            break;
    }

    for (var n = 0; n < polygon.length; n++) {
        polygon[n].x = (pos.moveX + (polygon[n].x/2))*size;
        polygon[n].y = (pos.moveY + (polygon[n].y/2))*size;
    }

    return polygon
}

var createPolygon6 = function(pos, size, x, y) {
    var lineEven = y % 2 == 0;

    var polygon = [];

    var c = { x: (lineEven ? 0 : -1.15), y: -1 };
    var p = { x: (lineEven ? 0 : -1.15), y: -2.3 };
    for (var n = 0; n < 6; n++) {
        var rp = _rotate2d(c, p, (n*(360/6)));
        rp.x = (rp.x/1.15);
        polygon.push(rp);
    };

    for (var n = 0; n < polygon.length; n++) {
        polygon[n].x = (pos.moveX + (polygon[n].x/2))*(size*1.15);
        polygon[n].y = (pos.moveY + (polygon[n].y/2))*size;
    }

    return polygon
}

var createPolygon8 = function(pos, size, x, y, dir) {
    var lineEven = y % 2 == 0;

    var polygon = [];

    switch (dir) {
        case 0:
            polygon.push({ x: -1 , y: -1 });
            polygon.push({ x: 0 , y: -1 });
            polygon.push({ x: 0 , y: 1 });
            polygon.push({ x: -1 , y: 1 });
            polygon.push({ x: -1 , y: -1 });
            break;

        case 1:
            polygon.push({ x: 0 , y: -1 });
            polygon.push({ x: 1 , y: -1 });
            polygon.push({ x: 1 , y: 1 });
            polygon.push({ x: 0 , y: 1 });
            polygon.push({ x: 0 , y: -1 });
            break;
    }

    for (var n = 0; n < polygon.length; n++) {
        polygon[n].x = (pos.moveX + (polygon[n].x/2))*size;
        polygon[n].y = (pos.moveY + (polygon[n].y/2))*size;
    }

    return polygon
}

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisibilitychange";
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