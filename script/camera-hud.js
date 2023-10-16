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

    deviceNo = 1;
    window.onclick = function() {
        if (cameraOn) {
            updateImage = !updateImage;
        }
        else {
            startCamera();
        }
    };

    createMonitor((sw/6)*5, 50, 5, 9, "left");
    createMonitor((sw/6)*4, 50, 5, 9, "left");
    createMonitor((sw/6)*3, 50, 5, 9, "left");
    createMonitor((sw/6)*2, 50, 5, 9, "left");
    createMonitor((sw/6)*1, 50, 5, 9, "left");

    createMonitor((sw/6)*5, (sh-50), 0, 4, "right");
    createMonitor((sw/6)*4, (sh-50), 0, 4, "right");
    createMonitor((sw/6)*3, (sh-50), 0, 4, "right");
    createMonitor((sw/6)*2, (sh-50), 0, 4, "right");
    createMonitor((sw/6)*1, (sh-50), 0, 4, "right");

    imageView = document.createElement("i");
    imageView.style.position = "absolute";
    imageView.style.background = "#000";
    imageView.style.color = "#fff";
    imageView.style.fontSize = (50)+"px";
    imageView.style.lineHeight = (100)+"px";
    imageView.autoplay = true;
    imageView.style.objectFit = "cover";
    imageView.width = ((sw/2)-50);
    imageView.height = ((sh/2)-50); 
    imageView.style.left = (((sw/2)-50))+"px";
    imageView.style.top = (((sh/2)-50))+"px";
    imageView.style.width = (100)+"px";
    imageView.style.height = (100)+"px";
    imageView.style.transform = "rotateZ(-90deg)";
    imageView.style.border = "1px solid #fff";
    imageView.style.zIndex = "15";
    document.body.appendChild(imageView);

    textView = document.createElement("span");
    textView.style.position = "absolute";
    textView.style.color = "#fff";
    textView.innerText = "";
    textView.width = ((sw/2)-100);
    textView.height = ((sh/2)-50); 
    textView.style.fontFamily = "Khand";
    textView.style.left = (((sw/2)-50))+"px";
    textView.style.top = (((sh/2)-50))+"px";
    textView.style.width = (200)+"px";
    textView.style.height = (100)+"px";
    textView.style.transform = "rotateZ(90deg)";
    textView.style.zIndex = "15";
    document.body.appendChild(textView);

    monitor = 0;
    animate();
});

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
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
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