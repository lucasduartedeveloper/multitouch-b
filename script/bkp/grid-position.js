var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

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
    $("html, body").css("background", "#000");

    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");
    $("#title").css("top", "10px");
    $("#title").css("z-index", "25");

    // O outro nome não era [  ]
    // Teleprompter
    $("#title")[0].innerText = ""; //"PICTURE DATABASE"; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    tileSize = (sw/7);

    pictureView = document.createElement("canvas");
    pictureView.style.position = "absolute";
    pictureView.style.background = "#fff";
    pictureView.width = (sw);
    pictureView.height = (sh); 
    pictureView.style.left = (0)+"px";
    pictureView.style.top = (0)+"px";
    pictureView.style.width = (sw)+"px";
    pictureView.style.height = (sh)+"px";
    pictureView.style.zIndex = "15";
    document.body.appendChild(pictureView);

    startX = (sw/2);
    startY = (sw/2);

    ontouch = false;
    pictureView.ontouchstart = function(e) {
        ontouchIteration = 0;
        ontouch = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        position.x = startX;
        position.y = startY;

        sendPosition(position);
    };
    pictureView.ontouchmove = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        position.x = startX;
        position.y = startY;

        sendPosition(position);
    };
    pictureView.ontouchend = function(e) {
        ontouch = false;
    };

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "position-data") {
            var obj = JSON.parse(msg[3]);
            var scaleX = sw / obj.sw;
            var scaleY = sh / obj.sh;
            position.x = obj.x*scaleX;
            position.y = obj.y*scaleY;
        }
    };

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        console.log("mic open");
    };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        micAvgValue = avgValue;

        var c0 = {
            x: position0.x,
            y: position0.y
        };
        var p0 = {
            x: c0.x,
            y: c0.y-(micAvgValue*(sw/gridSize))
        }
        var rp0 = _rotate2d(c0, p0, direction0);

        var collided0 = false;
        if (rp0.x < ((sw/gridSize)/2)) {
            collided0 = true;
            rp0.x = ((sw/gridSize)/2);
        }
        if (rp0.y < ((sw/gridSize)/2)) {
            collided0 = true;
            rp0.y = ((sw/gridSize)/2);
        }
        if (rp0.x > sw-((sw/gridSize)/2)) {
            collided0 = true;
            rp0.x = sw-((sw/gridSize)/2);
        }
        if (rp0.y > sh-((sw/gridSize)/2)) {
            collided0 = true;
            rp0.y = sh-((sw/gridSize)/2);
        }

        var c1 = {
            x: position1.x,
            y: position1.y
        };
        var p1 = {
            x: c1.x,
            y: c1.y-(micAvgValue*(sw/gridSize))
        }
        var rp1 = _rotate2d(c1, p1, direction1);

        var collided1 = false;
        if (rp1.x < ((sw/gridSize)/4)) {
            collided1 = true;
            rp1.x = ((sw/gridSize)/4);
        }
        if (rp1.y < ((sw/gridSize)/4)) {
            collided1 = true;
            rp1.y = ((sw/gridSize)/4);
        }
        if (rp1.x > sw-((sw/gridSize)/4)) {
            collided1 = true;
            rp1.x = sw-((sw/gridSize)/4);
        }
        if (rp1.y > sh-((sw/gridSize)/4)) {
            collided1 = true;
            rp1.y = sh-((sw/gridSize)/4);
        }

        var co = Math.abs(rp0.x-rp1.x);
        var ca = Math.abs(rp0.y-rp1.y);
        var hyp = Math.sqrt(
        Math.pow(co, 2)+
        Math.pow(ca, 2));

        var collided = false;
        if (hyp < (((sw/gridSize)/2)+((sw/gridSize)/4))) {
            var r = (1/hyp)*(((sw/gridSize)/2)+((sw/gridSize)/4));
            collided = true;
        }

        if (reachedFreq < 100 && !collided) {
            position0.x = rp0.x;
            position0.y = rp0.y;
        }

        if (reachedFreq > 100 && !collided) {
            position1.x = rp0.x;
            position1.y = rp0.y;
        }

        if (collided0)
        direction0 = Math.floor(Math.random()*360);

        if (collided1)
        direction1 = Math.floor(Math.random()*360);
    };
    mic.onclose = function() { 
        console.log("mic closed");
    };
    var ab = new Array(50);
    for (var n = 0; n < 50; n++) {
        ab[n] = 0;
    }
    resumedWave = ab;

    buttonMicView = document.createElement("button");
    buttonMicView.style.position = "absolute";
    buttonMicView.style.color = "#000";
    buttonMicView.innerText = "mic: off";
    buttonMicView.style.fontFamily = "Khand";
    buttonMicView.style.fontSize = "15px";
    buttonMicView.style.left = (10)+"px";
    buttonMicView.style.top = (sh-35)+"px";
    buttonMicView.style.width = (100)+"px";
    buttonMicView.style.height = (25)+"px";
    buttonMicView.style.border = "1px solid white";
    buttonMicView.style.borderRadius = "25px";
    buttonMicView.style.zIndex = "15";
    document.body.appendChild(buttonMicView);

    buttonMicView.onclick = function() {
        if (mic.closed) {
            mic.open(false, 50);
            buttonMicView.innerText = "mic: on";
        }
        else {
            mic.close();
            buttonMicView.innerText = "mic: off";
        }
    };

    resolution = 0;
    animate();
});

var direction0 = Math.floor(Math.random()*360);
var direction1 = Math.floor(Math.random()*360);

var position0 = {
    x: (sw/2),
    y: (sh/2)
};

var position1 = {
    x: (sw/2),
    y: (sh/2)
};

var gridSize = 10;

var gridPosition = {
    x: 0,
    y: (gridSize-1)
};

var sendPosition = function(pos) {
    var obj = {
        x: pos.x,
        y: pos.y,
        sw: sw,
        sh: sh
    };
    ws.send("PAPER|"+playerId+"|position-data|"+
    JSON.stringify(obj));
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

var offsetValue = 1;
var offsetOrder = [ 0, 0, 0, 0, 0 ];
var offsetNo = 0;

var offsetAngle = -(Math.PI/180);

var drawImage = function(alignmentOverlay=true) {
    var ctx = pictureView.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, sw, sw);

    var resolutionCanvas = document.createElement("canvas");
    resolutionCanvas.width = 
    resolution == 0 ? sw : (8*resolution);
    resolutionCanvas.height = 
    resolution == 0 ? sw : (8*resolution);

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.restore();

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, sw, sh);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    for (var y = 0; y < Math.floor((sh/(sw/gridSize))); y++) {
        ctx.beginPath();
        ctx.moveTo(0, y*(sw/gridSize));
        ctx.lineTo(sw, y*(sw/gridSize));
        ctx.stroke();
    }

    for (var x = 0; x <= gridSize; x++) {
        ctx.beginPath();
        ctx.moveTo(x*(sw/gridSize), 0);
        ctx.lineTo(x*(sw/gridSize), sh);
        ctx.stroke();
    }

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(position0.x, position0.y, ((sw/gridSize)/2), 
    0, (Math.PI*2));
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(position1.x, position1.y, ((sw/gridSize)/4), 
    0, (Math.PI*2));
    ctx.fill();

    ctx.drawImage(resolutionCanvas, 0, 0, sw, sw);
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