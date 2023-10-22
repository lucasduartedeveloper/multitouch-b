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

    angle = 0;
    motion = true;
    gyroUpdated = function(gyro) {
        var co = gyro.accX;
        var ca = gyro.accY;
        angle = -(_angle2d(co, ca) + (Math.PI/2));

        //count = (1-((1/9.8)*Math.abs(gyro.accZ)))*50;
    };

    wavy = true;
    window.onclick = function() {
       wavy = !wavy;
    };

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
        if (updateImage)
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var angle = 0;
var count = 50
var rotation = 0;
var frameCount = 0;
var drawImage = function(crop=false) {
    ctx = frameView.getContext("2d");
    if (!crop)
    ctx.clearRect(0, 0, sw, sh);

    ctx.save();
    if (crop) {
        ctx.beginPath();
        ctx.arc((sw/2), (sh/2), ((sw/2)-50), 0, (Math.PI*2));
        ctx.clip();

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, sw, sh);
    }

    rotation += 1;
    ctx.translate((sw/2), (sh/2));
    //ctx.rotate(((Math.PI*2)/540)*rotation);
    ctx.rotate(crop ? (angle + (Math.PI)) : angle);
    ctx.translate(-(sw/2), -(sh/2));

    var size = (sw / count);
    ctx.lineWidth = size;
    ctx.strokeStyle = "#fff";
    ctx.lineJoin = "round";

    var offset = (((size*8)/60)*frameCount);
    for (var n = -count; n < (count+(count/2)); n++) {
        ctx.beginPath();
        ctx.moveTo((size/2)+((n*2)*size)+(offset), -100);
        for (var k = 0; k < count; k++) {
            var even = k % 2 == 0;
            ctx.lineTo((size/2)+((n*2)*size)+(offset)+
            (!wavy || even ? 0 : 5), 
            ((sh+200)/count)*k);
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

    if (!crop)
    drawImage(true);

    if (frameCount < 60) frameCount += 1;
    else frameCount = 0;
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