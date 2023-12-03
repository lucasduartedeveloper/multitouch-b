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

    count = 0;
    open = false;

    textView = document.createElement("span");
    textView.style.position = "absolute";
    textView.style.color = "#fff";
    textView.innerText = count;
    textView.style.fontFamily = "Khand";
    textView.style.fontSize = "50px";
    textView.style.lineHeight = "50px";
    textView.style.left = ((sw/2)-50)+"px";
    textView.style.top = ((sh/2)-25)+"px";
    textView.style.width = (100)+"px";
    textView.style.height = (50)+"px";
    //textView.style.border = "2px solid #fff";
    //squareView.style.borderRadius = "50%"
    textView.style.zIndex = "20";
    document.body.appendChild(textView);

    textView.onclick = function() {
        if (open) {
            count += 1;
            textView.innerText = count;
            open = false;
        }
    };

    squareView = document.createElement("div");
    squareView.style.position = "absolute";
    squareView.style.left = ((sw/2)-50)+"px";
    squareView.style.top = ((sh/2)-50)+"px";
    squareView.style.width = (100)+"px";
    squareView.style.height = (100)+"px";
    squareView.style.border = "2px solid #fff";
    //squareView.style.borderRadius = "50%"
    squareView.style.zIndex = "20";
    document.body.appendChild(squareView);

    setInterval(function() {
        updateState();
    }, 1000);

    loadImages();
    //loadPath();
    animate();
});

var updateState = function() {
    var rnd = 1+Math.floor(Math.random()*10);
    if (rnd == 1) {
        open = true;
        textView.innerText = "+1";
        beepMilestone.play();
    }
    else {
        open = false;
        textView.innerText = count;
    }
};

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
    ctx.strokeStyle = "#000";

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

var w = 0;
var receivedData = false;

var distance = 0;
var path = [];

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var position = { x: (sw/2), y: (sh/2) };

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

var activeAudio = null;
var updateAudio = function(angle) {
    var w = activeAudio;
    for (var n = 0; n < textList.length; n++) {
        if (angle >= textList[n].start && 
        angle < textList[n].end) {
            w = n;
        }
    }
    if (activeAudio == w) return;
    activeAudio = w;

    for (var n = 0; n < textList.length; n++) {
        textList[n].audio.pause();
    }
    textList[w].audio.play();
};

var getImage = function(angle) {
    for (var n = 0; n < textList.length; n++) {
        if (angle >= textList[n].start && 
        angle < textList[n].end) {
            return img_list[n];
        }
    }
    return null;
};

var drawImage = function() {
    var ctx = imageView.getContext("2d");
    ctx.clearRect(0, 0, sw, sh);
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