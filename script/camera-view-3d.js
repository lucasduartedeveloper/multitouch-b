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

    recordedVideo = document.createElement("video");
    recordedVideo.style.position = "absolute";
    recordedVideo.autoplay = true;
    //recordedVideo.controls = true;
    recordedVideo.style.objectFit = "cover";
    recordedVideo.width = (sw/2);
    recordedVideo.height = (sw/2); 
    recordedVideo.style.left = (sw/4)+"px";
    recordedVideo.style.top = ((sh/2)-(sw/2)+(sw/4))+"px";
    recordedVideo.style.width = (sw/2)+"px";
    recordedVideo.style.height = (sw/2)+"px";
    recordedVideo.style.zIndex = "15";
    document.body.appendChild(recordedVideo);

    recordedVideo.src = 
    "https://192.168.15.4:8443/movies/avengers.mp4";

    imageView = document.createElement("canvas");
    imageView.style.position = "absolute";
    imageView.width = sw;
    imageView.height = sh;
    imageView.style.left = (0)+"px";
    imageView.style.top = (0)+"px";
    imageView.style.width = (sw)+"px";
    imageView.style.height = (sh)+"px";
    imageView.style.zIndex = "15";
    document.body.appendChild(imageView);

    deviceNo = 0;
    imageView.onclick = function() {
        if (cameraOn) {
            flipX = !flipX;
        }
        else {
            startCamera();
        }
        if (recordedVideo.paused)
        recordedVideo.play();
    };

    var startX = 0;
    var startY = 0;
    updateWidth = false;

    imageView.ontouchstart = function(e) {
        lineWidth = 0;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        updateWidth = true;
    };

    imageView.ontouchmove = function(e) {
        moveX = e.touches[0].clientX - startX;
        moveY = e.touches[0].clientY - startY;

        var co = Math.abs(moveX);
        var ca = Math.abs(moveY);

        var hyp = Math.sqrt(Math.pow(co, 2), Math.pow(ca, 2));
        lineWidth = hyp;
    };

    imageView.ontouchend = function(e) {
        updateWidth = false;
    };

    buttonView = document.createElement("button");
    buttonView.style.position = "absolute";
    buttonView.style.color = "#000";
    buttonView.innerText = "PAUSE";
    buttonView.style.fontFamily = "Khand";
    buttonView.style.left = (10)+"px";
    buttonView.style.top = (sh-110)+"px";
    buttonView.style.width = (100)+"px";
    buttonView.style.height = (50)+"px";
    buttonView.style.border = "1px solid white";
    buttonView.style.borderRadius = "25px";
    buttonView.style.zIndex = "15";
    document.body.appendChild(buttonView);

    buttonView.onclick = function() {
        if (camera.paused)
        camera.play();
        else
        camera.pause();
    };

    button3DView = document.createElement("button");
    button3DView.style.position = "absolute";
    button3DView.style.color = "#000";
    button3DView.innerText = "3D LOADER";
    button3DView.style.fontFamily = "Khand";
    button3DView.style.fontSize = "15px";
    button3DView.style.left = (120)+"px";
    button3DView.style.top = (sh-110)+"px";
    button3DView.style.width = (100)+"px";
    button3DView.style.height = (50)+"px";
    button3DView.style.border = "1px solid white";
    button3DView.style.borderRadius = "25px";
    button3DView.style.zIndex = "15";
    document.body.appendChild(button3DView);

    threejsEnabled = false;
    button3DView.onclick = function() {
        threejsEnabled = !threejsEnabled;
        renderer.domElement.style.display = 
        threejsEnabled ? "initial" : "none";
        modes.style.display = 
        threejsEnabled ? "initial" : "none";
        eyeSep.style.display = 
        threejsEnabled ? "initial" : "none";
    };

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        mic.audio.srcObject = mic.audioStream.mediaStream;
        mic.audio.play();
    };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        lineWidth = (avgValue*50);
        resumedWave = resumeWave(freqArray);
    };
    mic.onclose = function() { };
    var ab = new Array(50);
    for (var n = 0; n < 50; n++) {
        ab[n] = 0;
    }
    resumedWave = ab;

    audioContainer = document.createElement("div");
    audioContainer.style.position = "absolute";
    audioContainer.style.left = (0)+"px";
    audioContainer.style.top = (50)+"px";
    audioContainer.style.width = (sw)+"px";
    audioContainer.style.height = (50)+"px";
    audioContainer.style.zIndex = "15";
    //document.body.appendChild(audioContainer);

    mic.audio.style.display = "block";
    mic.audio.style.width = (sw)+"px";
    mic.audio.controls = "controls";
    mic.audio.class = "track";
    audioContainer.appendChild(mic.audio);

    buttonMicView = document.createElement("button");
    buttonMicView.style.position = "absolute";
    buttonMicView.style.color = "#000";
    buttonMicView.innerText = "mic: off";
    buttonMicView.style.fontFamily = "Khand";
    buttonMicView.style.fontSize = "15px";
    buttonMicView.style.left = (sw-110)+"px";
    buttonMicView.style.top = (sh-110)+"px";
    buttonMicView.style.width = (100)+"px";
    buttonMicView.style.height = (50)+"px";
    buttonMicView.style.border = "1px solid white";
    buttonMicView.style.borderRadius = "25px";
    buttonMicView.style.zIndex = "15";
    document.body.appendChild(buttonMicView);

    buttonMicView.onclick = function() {
        if (mic.closed) {
            mic.open();
            buttonMicView.innerText = "mic: on";
        }
        else {
            mic.close();
            buttonMicView.innerText = "mic: off";
        }
    };

    buttonEffectView = document.createElement("button");
    buttonEffectView.style.position = "absolute";
    buttonEffectView.style.color = "#000";
    buttonEffectView.innerText = "fx: off";
    buttonEffectView.style.fontFamily = "Khand";
    buttonEffectView.style.fontSize = "15px";
    buttonEffectView.style.left = (10)+"px";
    buttonEffectView.style.top = (sh-145)+"px";
    buttonEffectView.style.width = (75)+"px";
    buttonEffectView.style.height = (25)+"px";
    buttonEffectView.style.border = "1px solid white";
    buttonEffectView.style.borderRadius = "25px";
    buttonEffectView.style.zIndex = "15";
    document.body.appendChild(buttonEffectView);

    effect = false;
    buttonEffectView.onclick = function() {
        effect = !effect;
        if (effect)
        buttonEffectView.innerText = "fx: on";
        else
        buttonEffectView.innerText = "fx: off";
    };

    loadImages();

    load3D();
    animate();
});

var drawAB = 
function(freqArray=false, avgValue=0) {

    var canvas = imageView;
    var ctx = canvas.getContext("2d");

    var offset = 0;
    var polygon = [];

    // create waveform A
    if (freqArray) 
    offset = (canvas.width/freqArray.length)/2;
    if (freqArray) 
    for (var n = 0; n < freqArray.length; n++) {
        var obj = {
            x: offset+(n*(canvas.width/freqArray.length)),
            y0: (25)+
            (-freqArray[n]*25),
            y1: (25)+
            (freqArray[n]*25)
        };
        polygon.push(obj);
    }

    // draw waveform A
    ctx.strokeStyle = "#fff";

    if (freqArray) {
        ctx.lineWidth = (canvas.width/freqArray.length)-2;
        //ctx.clearRect(0, 0, canvas.width, 100);
    }
    if (freqArray)
    for (var n = 0; n < polygon.length; n++) {
        ctx.beginPath();
        ctx.moveTo(polygon[n].x, polygon[n].y0-1);
        ctx.lineTo(polygon[n].x, polygon[n].y1+1);
        ctx.stroke();
    }
};

var resumeWave = function(freqArray) {
    var blocks = 50;
    var blockSize = Math.floor(freqArray.length / blocks);

    var resumedArray = [];
    var sum = 0;
    for (var n = 0; n < blocks; n++) {
        sum = 0;
        for (var k = 0; k < blockSize; k++) {
            var m = (n * blockSize) + k;
             if ((m+1) <= freqArray.length) {
                 sum += freqArray[m];
             }
        }

        resumedArray.push(sum/blockSize);
    }
    //console.log(blockSize);
    //console.log(resumedArray);

    return resumedArray;
};

var img_list = [
    "img/image-5.png",
    "img/image-105.png"
];

var imagesLoaded = false;
var loadImages = function(callback) {
    var count = 0;
    for (var n = 0; n < img_list.length; n++) {
        var img = document.createElement("img");
        img.n = n;
        img.onload = function() {
            count += 1;
            img_list[this.n] = this;
            if (count == img_list.length) {
                imagesLoaded = true;
                callback();
            }
        };
        var rnd = Math.random();
        img.src = img_list[n]+"?f="+rnd;
    }
};

var monitors = [];
var createMonitor = function(x, y, from, to, side) {
    var newMonitor = document.createElement("span");
    newMonitor.style.position = "absolute";
    newMonitor.side = side;
    newMonitor.from = from;
    newMonitor.to = to;
    newMonitor.active = false;
    newMonitor.style.fontFamily = "Khand";
    newMonitor.style.lineHeight = "50px";
    newMonitor.style.left = ((x)-(25))+"px";
    newMonitor.style.top = ((y)-(25))+"px";
    newMonitor.style.width = (50)+"px";
    newMonitor.style.height = (50)+"px";
    newMonitor.style.borderRadius = "50%";
    newMonitor.style.border = "1px solid #fff";
    newMonitor.style.transform = "rotateZ(90deg)";
    newMonitor.style.zIndex = "15";
    document.body.appendChild(newMonitor);

    newMonitor.onclick = function() {
        var n = this.from+
        Math.floor(Math.random()*((this.to+1)-this.from));

        imageView.className = "initial";

        var active = false;
        for (var k = 0; k < monitors.length; k++) {
            if (monitors[k].active) active = true;
            monitors[k].innerText = "";
            monitors[k].active = false;
            monitors[k].style.background = 
            monitors[k].active ? "#fff" : "rgba(255, 255, 255, 0)";
        }

        if (active) return;
        if (this.side == "left")
        imageView.className = "fa-solid fa-arrow-right";
        else
        imageView.className = "fa-solid fa-arrow-left";

        beepMilestone.play();

        monitors[n].innerText = 8+Math.floor(Math.random()*3);
        monitors[n].active = !monitors[n].active;
        monitors[n].style.background = 
        monitors[n].active ? "#fff" : "rgba(255, 255, 255, 0)";
    };

    monitors.push(newMonitor);
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

var lineWidth = 0;
var flipX = true;
var drawImage = function() {
    var ctx = imageView.getContext("2d");
    ctx.clearRect(0, 0, sw, sh);

    ctx.fillStyle = "#fff";
    //ctx.fillRect(0, 0, sw, sh);

    ctx.lineWidth = lineWidth;

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo((sw/2), 0);
    ctx.lineTo((sw/2), sh);
    //ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, (sh/2));
    ctx.lineTo(sw, (sh/2));
    //ctx.stroke();

    drawAB(resumedWave);

    var orientated = img_list[0].width > img_list[0].height;
    var format = {
        left: 
        orientated ? (img_list[0].width/2) - (img_list[0].height/2) : 0,
        top: 
        orientated ? 0 : (img_list[0].height/2) - (img_list[0].width/2),
        width: orientated ? img_list[0].height : img_list[0].width,
        height: orientated ? img_list[0].height : img_list[0].width
    };

    if (imagesLoaded)
    ctx.drawImage(img_list[0], 
    format.left, format.top, format.width, format.height,
    0, (sh/2)-(sw/2), (sw/4), (sw/4));

    if (cameraOn)
    drawToSquare(ctx, camera, true);

    if (!cameraOn && imagesLoaded)
    drawToSquare(ctx, img_list[1]);

    if (updateWidth)
    lineWidth += 2;
};

var drawToSquare = 
    function(ctx, image, camera=false, size=4) {
    var canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sw;

    ctx.lineWidth = 1;

    var squareCtx = canvas.getContext("2d");

    squareCtx.save();
    if (cameraOn) {
        squareCtx.scale(-1, 1);
        squareCtx.translate(-sw, 0);
    }

    var format;
    if (!camera)
    format = fitImageCover(image, canvas);
    else {
        var video = {
            width: vw,
            height: vh
        }
        format = fitImageCover(video, canvas);
    }

    squareCtx.drawImage(image, format.left, format.top, 
    format.width, format.height);

    squareCtx.restore();

    var circles = [];
    for (var n = 0; n < (size/2); n++) {
        var obj = {
            x: (sw/2),
            y: (sh/2),
            radius: (size/2)-(n+0.5),
            parts: []
        };
        circles.push(obj);
    };

    var offsetX = 0;
    var offsetY = (sh/2)-(sw/2);

    var co = (size/2);
    var ca = (size/2);
    var max = Math.sqrt(
    Math.pow(co, 2)+
    Math.pow(ca, 2));

    var parts = [];
    for (var n = 0; n < (size*size); n++) {
        var x = (n%size);
        var y = Math.floor(n/size);

        var left = (x*(sw/size));
        var top = (y*(sw/size));

        var dirX = (x < (size/2) ? -1 : 1);
        var offX = ((size/2)-
        Math.abs((x - (size/2)) < 0 ? 
        (x - (size/2)) : 1+(x - (size/2))));
        dirX = dirX * offX;

        var dirY = (y < (size/2) ? -1 : 1);
        var offY = ((size/2)-
        Math.abs((y - (size/2)) < 0 ? 
        (y - (size/2)) : 1+(y - (size/2))));
        dirY = dirY * offY;

        var diffX = Math.abs((x - (size/2)) < 0 ? 
        (x - (size/2)) : 1+(x - (size/2)));
        var diffY = Math.abs((y - (size/2)) < 0 ? 
        (y - (size/2)) : 1+(y - (size/2)));

        var pcXY = (1/diffY)*diffX;
        var pcYX = (1/diffX)*diffY;

        /*pcXY = pcXY > 1 ? 1 : pcXY;
        pcYX = pcYX > 1 ? 1 : pcYX;*/

        var co = diffX-0.5;
        var ca = diffY-0.5;
        var hyp = Math.sqrt(
        Math.pow(co, 2)+
        Math.pow(ca, 2));

        var r = 1-((1/max)*hyp);

        var order = (offX + offY);
        var obj = {
             hyp: hyp,
             dirX: dirX,
             dirY: dirY,
             diffX: diffX,
             diffY: diffY,
             pcXY: pcXY,
             pcYX: pcYX,
             pos: { x: x, y: y },
             order: order,
             srcX: left,
             srcY: top,
             destX: offsetX + left + 
             (effect ? ((dirX*(lineWidth/2)) * (pcXY * r)) : 0),
             destY: offsetY + top + 
             (effect ? ((dirY*(lineWidth/2)) * (pcYX * r)) : 0)
        };
        parts.push(obj);
    }

    var ordered = parts.sort(function(a, b) {
        return a.order > b.order ? 1 : -1;
    });

    for (var n = 0; n < parts.length; n++) {
        var obj = parts[n];

        var lastDiff = Math.abs(obj.hyp - circles[0].radius);
        var cn = 0;
        for (var k = 0; k < circles.length; k++) {
            diff = Math.abs(obj.hyp - circles[k].radius);
            if (diff < lastDiff)
            cn = k;
            lastDiff = diff;
        }

        circles[cn].parts.push(obj);
    }

    for (var n = 0; n < circles.length; n++) {
        var obj = circles[n];

        var c = { x: 0, y: 0 };
        var p = { x: -1, y: 0 };
        var rp = _rotate2d(c, p, (n*(90/(size/2))));

        var radius = obj.radius + rp.y*(lineWidth/2);
        var diff = radius - obj.radius;
        obj.radius = radius;

        obj.diff = diff;

        for (var k = 0; k < obj.parts.length; k++) {
            var part = obj.parts[k];

            //part.destX += part.dirX * (diff);
            //part.destY += part.dirY * (diff);

            /*part.destX += ((part.dirX*(lineWidth/2)) * 
            (part.pcXY * r));
            part.destY += ((part.dirX*(lineWidth/2)) * 
            (part.pcXY * r));*/

            ctx.drawImage(canvas, part.srcX, part.srcY, 
            (sw/size), (sw/size),
            part.destX, part.destY, (sw/size), (sw/size));

            ctx.strokeStyle = "#000";
            ctx.strokeRect(part.destX, part.destY, 
            (sw/size), (sw/size));
        }

        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius*(sw/size), 0, Math.PI*2);
        //ctx.stroke();
    };
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