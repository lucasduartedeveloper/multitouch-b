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
var sh = window.innerHeight < 832 ? window.innerHeight : 669;

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

    loadImages();
    //loadPath();
    animate();
});

var w = 0;
var receivedData = false;

var distance = 0;
var path = [];

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

        rotate();
        //updateAudio(angle);
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var img_list = [
    "img/image-0.png", 
    "img/mic-icon.png", 
    "img/image-1.png", 
    "img/image-3.png"
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

var angle = 180;
var drawImage = function() {
    var ctx = imageView.getContext("2d");
    ctx.clearRect(0, 0, sw, sh);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, sw, sh);

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc((sw/2), (sh/2), 
    100, 0, (Math.PI * 2));
    ctx.fill();
};

var getHeight = function(h) {
    var co = Math.sqrt(Math.pow(h, 2) - Math.pow(h/2, 2));
    return co;
};

var getWidth = function(h) {
    var co = (1/Math.sin((Math.PI*2)/3))*h;
    return co;
};

var convert2d = function() {
     var result = {
         x: (sh/2)-(position.x * (sh/2)),
         y: (sw/2)-(position.y * (sw/2))
     };
     return result;
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