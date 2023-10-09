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

    loadArray();
});

var count = 1;
var websocketArr = [];

var sortArray = function(arr) {
    var result = [ ...arr ];
    for (var n = 0; n < arr.length; n++) {
        var w = Math.floor(Math.random()*arr.length);
        var n0 = result[n];
        var n1 = result[w];
        result[n] = n1;
        result[w] = n0;
    }

    return result;
};

var loadArray = function() {
    for (var n = 0; n < websocketArr.length; n++) {
        websocketArr[n].remove();
    }
    websocketArr = [];

    var list = [];
    for (var n = 0; n < (count*count); n++) {
        list.push(n);
    }
    var result = sortArray(list);

    var n0 = result[0];
    var n1 = result[1];

    var x0 = Math.floor(n0 % count);
    var y0 = Math.floor(n0 / count);

    var x1 = Math.floor(n1 % count);
    var y1 = Math.floor(n1 / count);

    var angle0 = (180/Math.PI)*angleTo(x0, y0, x1, y1);
    var angle1 = (180/Math.PI)*angleTo(x1, y1, x0, y0);

    var size = ((sw/2)/count);
    for (var y = 0; y < count; y++) {
        for (var x = 0; x < count; x++) {
             var pos = { x: x, y: y };

             setTimeout(function() {
             var websocket = 
             document.createElement("i");
             websocket.style.position = "absolute";
             websocket.style.background = "#fff";
             websocket.style.fontSize = (size/1.5)+"px";
             websocket.style.lineHeight = (size)+"px";
             websocket.style.left = 
             ((sw/2)-((count/2)*size)+(this.x*size))+"px";
             websocket.style.top = 
             ((sh/2)-((count/2)*size)+(this.y*size))+"px";
             websocket.style.width = (size)+"px";
             websocket.style.height = (size)+"px";
             if (((this.y*count)+this.x) == n0) {
                 websocket.className = "fa-solid fa-arrow-up";
                 websocket.style.border = "1px solid orange";
                 websocket.style.transform = "rotateZ("+angle0+"deg)";
             }
             if (((this.y*count)+this.x) == n1) {
                 websocket.className = "fa-solid fa-arrow-up";
                 websocket.style.border = "1px solid limegreen";
                 websocket.style.transform = "rotateZ("+angle1+"deg)";
             }
             websocket.style.borderRadius = "50%";
             websocket.style.scale = "0.9";
             websocket.style.zIndex = "15";
             document.body.appendChild(websocket);

             if (((this.y*count)+this.x) == n0)
             websocket.onclick = function() {
                 count += 1;
                 loadArray();
             };

             if (((this.y*count)+this.x) == n1)
             websocket.onclick = function() {
                 count -= 1;
                 loadArray();
             };

             websocketArr.push(websocket);
             }.bind(pos), 10);
        }
    }
};

var angleTo = function(x0, y0, x1, y1) {
    var co = x1-x0;
    var ca = y1-y0;
    var angle = _angle2d(co, ca);
    console.log(angle);
    return angle;
};

var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if (audioLoaded) {
            updateTime();
            drawTimestamp();
        }

        if (lyricsLoaded)
        syncLyrics();

        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var drawImage = function() {

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