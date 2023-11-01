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

    frameView1 = document.createElement("canvas");
    frameView1.style.position = "absolute";
    frameView1.width = (sw);
    frameView1.height = (sh);
    frameView1.style.left = (0)+"px";
    frameView1.style.top = (0)+"px";
    frameView1.style.width = (sw)+"px";
    frameView1.style.height = (sh)+"px"; 
    frameView1.style.zIndex = "15";
    //document.body.appendChild(frameView1);

    frameView1.getContext("2d").imageSmoothingEnabled = false

    angle = 0;
    motion = true;
    gyroUpdated = function(gyro) {
        var co = gyro.accX;
        var ca = gyro.accY;
        angle = -(_angle2d(co, ca) + (Math.PI/2));

        //count = (1-((1/9.8)*Math.abs(gyro.accZ)))*50;
    };

    wavy = 0;
    window.onclick = function() {
       staticImage = !staticImage;
       wavy = !wavy;
    };

    startX = 0;
    startY = 0;
    moveX = 0;
    moveY = 0;
    path = [];

    window.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        var ctx = frameView1.getContext("2d");
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 10;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        console.log(startX, startY);
    };
    window.ontouchmove = function(e) {
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;
        var ctx = frameView1.getContext("2d");
        ctx.lineTo(moveX, moveY);
        ctx.stroke();
        console.log(moveX, moveY);
    };
    window.ontouchend = function(e) {
        
    };

    animate();
});

var staticImage = false;
var updateImage = true;

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if (updateImage)
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var resolution = 10;
var nocrop = false;

var angle = 0;
var count = 50
var rotation = 0;
var frameCount = 0;
var drawImage = function(crop=false, newArray) {
    ctx = frameView.getContext("2d");
    if (!crop)
    ctx.clearRect(0, 0, sw, sh);

    ctx.fillStyle = backgroundColor;
    //ctx.fillRect(0, 0, sw, sh);

    var c = {
        moveX: (sw/2),
        moveY: (sh/2)
    };
    var polygon = createPolygon(c, (sw-150), 1, 1);

    ctx.save();
    if (crop) {
        ctx.beginPath();
        ctx.arc((sw/2), (sh/2), ((sw/2)-50), 0, (Math.PI*2));
        ctx.clip();

        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);
        for (var n = 1; n < polygon.length; n++) {
            ctx.lineTo(polygon[n].x, polygon[n].y);
        }
        //ctx.clip();

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, sw, sh);
    }

    rotation += 1;
    ctx.translate((sw/2), (sh/2));
    //ctx.rotate(((Math.PI*2)/60)*-rotation);
    ctx.rotate(crop ? (angle + (Math.PI)) : angle);
    ctx.translate(-(sw/2), -(sh/2));

    var size = (sw / count);
    ctx.lineWidth = size;
    ctx.strokeStyle = "#fff";
    ctx.lineJoin = "round";

    var offset = (((size*8)/60)*frameCount);
    var c = { 
        x: (sw/2), 
        y: (sh/2)
    };
    var p = {
        x: c.x, 
        y: c.y-((sw/2)-50)
    };

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    if (false)
    for (var n = 1; n < (360*10); n++) {
        var a = n;
        var pn = { ...p };
        pn.y = p.y + ((((sw/2)-50)/(360*10))*n);
        var rp = _rotate2d(c, pn, a);

        ctx.lineTo(rp.x, rp.y);
    }
    ctx.stroke();

    if (staticImage) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, sw, sh);

        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.arc((sw/2), (sh/2), ((sw/2)-50), 0, (Math.PI*2));
        ctx.clip();

        for (var n = -count; n < (count+(count/2)); n++) {
            var even = k % 2 == 0;
            ctx.beginPath();
            ctx.moveTo((size/2)+((n*2)*size), -100);
            for (var k = 0; k < count; k++) {
                ctx.lineTo((size/2)+((n*2)*size)+
                (!wavy || even ? 0 : 10), 
                ((sh+200)/count)*k);
            }
            ctx.stroke();
        }
    }
    else 
    for (var n = -count; n < (count+(count/2)); n++) {
        ctx.beginPath();
        ctx.moveTo((size/2)+((n*2)*size)+(offset), -100);
        for (var k = 0; k < count; k++) {
            ctx.lineTo((size/2)+((n*2)*size)+(offset)+
            (!wavy || even ? 0 : 10), 
            ((sh+200)/count)*k);

            continue;
            var even = k % 2 == 0;
            var c = { 
                x: (size/2)+((n*2)*size)+(offset), 
                y: (((sh+200)/count)*(k*2))
            };
            var p = {
                x: c.x, 
                y: c.y-((sh+200)/count)
            };
            for (var w = 0; w <= 5; w++) {
                var a = (180/5)*w;
                var rp = _rotate2d(c, p, (even ? a : -a));
                rp.x = c.x+((rp.x-c.x)/2);
                ctx.lineTo(rp.x, rp.y);
            };
        }
        ctx.stroke();
    }

    ctx.restore();

    ctx.lineWidth = 2;
    ctx.strokeStyle = backgroundColor;

    ctx.beginPath();
    ctx.moveTo((sw/2)-25, (sh/2));
    ctx.lineTo((sw/2)+25, (sh/2));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((sw/2), (sh/2)-25);
    ctx.lineTo((sw/2), (sh/2)+25);
    ctx.stroke();

    var imageArray = applyView();

    if (!crop)
    drawImage(true, imageArray);
    /*else
    applyData(newArray);*/

    if (frameCount < 60) frameCount += 1;
    else frameCount = 0;
};

var type = 1;
var createPolygon = function(pos, size, x, y, removed) {
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

    if (y > 0 && type == 0 && !(removed == 1) ) {
    var c = { x: 0, y: -1 };
    var p = { x: -(2/6), y: -1 };
    for (var n = 0; n < 60; n++) {
        var rp = _rotate2d(c, p, -(n*(180/60)));
        polygon.push(rp);
    };
    }

    if (y > 0 && type == 1 && !(removed == 1)) {
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

    var height = resolution;
    if (y < (height-1) && type == 0 && !(removed == 0)) {
    var c = { x: 0, y: 1 };
    var p = { x: (2/6), y: 1 };
    for (var n = 0; n < 60; n++) {
        var rp = _rotate2d(c, p, (n*(180/60)));
        polygon.push(rp);
    };
    }

    if (y < (height-1) && type == 1 && !(removed == 0)) {
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
        polygon[n].base = {
            x: polygon[n].x,
            y: polygon[n].y
        };
        polygon[n].x = (pos.moveX + ((polygon[n].x/2)*size));
        polygon[n].y = (pos.moveY + ((polygon[n].y/2)*size));
    }

    //console.log(polygon);
    return polygon;
};

var applyView = function() {
    var ctx = frameView.getContext("2d");
    var imageData = ctx.getImageData(0, 0, sw, sh);
    var imageArray = imageData.data;

    var ctx1 = frameView1.getContext("2d");
    var imageData1 = ctx1.getImageData(0, 0, sw, sh);
    var imageArray1 = imageData1.data;

    var newArray = new Uint8ClampedArray(imageArray);
    for (var n = 0; n < newArray.length; n+=4) {
        if (imageArray1[n+3] != 0) {
            newArray[n+3] = 0;
        }
    }

    var newImageData = new ImageData(newArray, 
    imageData.width, imageData.height);

    return newArray;
};

var applyData = function(imageArray1) {
    var ctx = frameView.getContext("2d");
    var imageData = ctx.getImageData(0, 0, sw, sh);
    var imageArray = imageData.data;

    var newArray = new Uint8ClampedArray(imageArray1);
    for (var n = 0; n < newArray.length; n+=4) {
        if (imageArray1[n+3] == 0) {
            newArray[n] = imageArray[n];
            newArray[n+1] = imageArray[n+1];
            newArray[n+2] = imageArray[n+2];
            newArray[n+3] = imageArray[n+3];
        }
    }

    var newImageData = new ImageData(newArray, 
    imageData.width, imageData.height);

    ctx.putImageData(newImageData, 0, 0);
};

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

/*
    var position = [ 0, 1, 2 ];
    var logPosition = function() {
        var ordered_position = position.toSorted(
        (a, b) => { return b - a; });
        var position = ordered_position;
        console.log(ordered_position, position);
    };
    logPosition();
*/