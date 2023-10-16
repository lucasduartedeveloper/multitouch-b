var beepDone = new Audio("audio/beep-done.wav");
var beepMilestone = new Audio("audio/beep-milestone.wav");

var bgmNo = 0;
var bgm = new Audio("audio/eletronic-0.wav");

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

    $("#title")[0].innerText = "";

    lineView0 = document.createElement("canvas");
    lineView0.style.position = "absolute";
    lineView0.width = (sw);
    lineView0.height = (sh); 
    lineView0.style.left = (0)+"px";
    lineView0.style.top = (0)+"px";
    lineView0.style.width = (sw)+"px";
    lineView0.style.height = (sh)+"px"; 
    //lineView0.style.scale = "0.9";
    lineView0.style.zIndex = "15";
    document.body.appendChild(lineView0);

    textView = document.createElement("span");
    textView.style.position = "absolute";
    textView.style.color = "#f0f";
    textView.innerText = "";
    textView.fontWeight = "900";
    textView.style.lineHeight = "150px";
    textView.style.fontSize = "150px";
    textView.style.fontFamily = "Arial";
    textView.style.left = ((sw/2)-100)+"px";
    textView.style.top = ((sh/2)-25)+"px";
    textView.style.width = (sw)+"px";
    textView.style.height = (50)+"px"; 
    textView.style.transform = "rotateY(180deg) rotateZ(90deg)";
    textView.style.scale = "0.9";
    textView.style.zIndex = "15";
    document.body.appendChild(textView);

    textView.onclick = function() {
        var text = prompt();
        textView.innerText = text;
    };

    tileView0 = document.createElement("div");
    tileView0.style.position = "absolute";
    tileView0.style.background = "orange";
    tileView0.style.left = (sw-60)+"px";
    tileView0.style.top = ((sh/2)-100)+"px";
    tileView0.style.width = (50)+"px";
    tileView0.style.height = (50)+"px"; 
    tileView0.style.scale = "0.9";
    tileView0.style.zIndex = "15";
    document.body.appendChild(tileView0);

    tileView1 = document.createElement("div");
    tileView1.style.position = "absolute";
    tileView1.style.background = "#fff";
    tileView1.style.left = (sw-60)+"px";
    tileView1.style.top = ((sh/2)-40)+"px";
    tileView1.style.width = (50)+"px";
    tileView1.style.height = (50)+"px"; 
    tileView1.style.scale = "0.9";
    tileView1.style.zIndex = "15";
    document.body.appendChild(tileView1);

    tileView2 = document.createElement("div");
    tileView2.style.position = "absolute";
    tileView2.style.background = "limegreen";
    tileView2.style.left = (sw-60)+"px";
    tileView2.style.top = ((sh/2)+20)+"px";
    tileView2.style.width = (50)+"px";
    tileView2.style.height = (50)+"px"; 
    tileView2.style.scale = "0.9";
    tileView2.style.zIndex = "15";
    document.body.appendChild(tileView2);

    window.onclick = function() {
        if (bgm.paused) 
        bgm.play();
        else 
        bgm.pause();
    };
    animate();
});

var colors = [ "#fff", "#000", "#fff" ];

var pushColors = function() {
    var color0 = colors[1];
    var color1 = colors[2];
    var color2 = colors[0];
    colors[0] = color0;
    colors[1] = color1;
    colors[2] = color2;
};

var switchColors = function() {
    var color0 = colors[1];
    var color1 = colors[0];
    colors[0] = color0;
    colors[1] = color1;
};

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if (new Date().getTime()-updateTime > 1000) {
            switchColors();
            updateTime = new Date().getTime();
        }

        tileView0.style.background = colors[0];
        tileView1.style.background = colors[1];
        tileView2.style.background = colors[2];

        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var drawImage = function() {
     var ctx = lineView0.getContext("2d");
     ctx.clearRect(0, 0, sw, sh);

     ctx.lineWidth = 1;
     ctx.strokeStyle = "#555";

     ctx.beginPath();
     ctx.moveTo((sw/2)-50, 0);
     ctx.lineTo((sw/2)-50, 450);
     ctx.stroke();

     ctx.beginPath();
     ctx.moveTo((sw/2)-65, 435);
     ctx.lineTo((sw/2)-50, 450);
     ctx.stroke();

     ctx.beginPath();
     ctx.moveTo((sw/2)-35, 435);
     ctx.lineTo((sw/2)-50, 450);
     ctx.stroke();

     ctx.beginPath();
     ctx.moveTo((sw/2)+50, 0);
     ctx.lineTo((sw/2)+50, 450);
     ctx.stroke();

     ctx.beginPath();
     ctx.moveTo((sw/2)+35, 435);
     ctx.lineTo((sw/2)+50, 450);
     ctx.stroke();

     ctx.beginPath();
     ctx.moveTo((sw/2)+65, 435);
     ctx.lineTo((sw/2)+50, 450);
     ctx.stroke();
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