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

    count = 0;
    order = [ 1, 4, 2, 3, 5, 1 ];
    frameView.onclick = function() {
        items.push(img_list[order[count]]);
        count += 1;
    };

    position = {
        x: (sw/2),
        y: (sh/2)
    };

    
    frameView.ontouchstart = function(e) {
        position.x = e.touches[0].clientX;
        position.y = e.touches[0].clientY;
    };
    frameView.ontouchmove = function(e) {
        position.x = e.touches[0].clientX;
        position.y = e.touches[0].clientY;
    };

    loadImages();
    animate();
});

var startTime = 0;
var timerStarted = false;
var ppcm = 50;
var distance = 0;
var path = [];

var imgNo = 0;
var img_list = [
    "img/bread-group.png",
    "img/bread.png",
    "img/tomato-slice.png",
    "img/cheese-slice.png",
    "img/lettuce-leaf.png",
    "img/hamburger.png"
];

var items = [];

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

var updateImage = true;

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if (timerStarted) {
            var timer = new Date().getTime() - startTime;
            timerView.innerText = toTimestamp(timer);
        };

        if (updateImage)
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var resolution = 10;
var imageArray = [];

var drawImage = function() {
    ctx = frameView.getContext("2d");
    ctx.clearRect(0, 0, sw, sh);

    for (var n = 0; n < items.length; n++) {
        var frame = {
             width: 50,
             height: 50
        };
        var format = fitImageCover(items[n], frame);
        console.log(format);

        ctx.drawImage(items[n], 
        (position.x)-(format.width/2)+format.left, 
        (position.y)-(format.height/2)+format.top, 
        format.width, format.height);
    }
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