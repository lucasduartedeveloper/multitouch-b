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

    resolution = 0;
    animate();
});

var position = {
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
    ctx.arc(position.x, position.y, ((sw/gridSize)/2), 
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