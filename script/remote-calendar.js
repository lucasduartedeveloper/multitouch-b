var beepDone = new Audio("audio/beep-done.wav");
var beepMilestone = new Audio("audio/beep-milestone.wav");

var audio = new Audio("audio/phone-lock.wav");
var alarm = new Audio("audio/battleship-alarm.wav");
var coin = new Audio("audio/coin.wav");

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

    fpsGraphView = document.createElement("canvas");
    fpsGraphView.style.position = "absolute";
    fpsGraphView.width = (sw);
    fpsGraphView.height = (50);
    fpsGraphView.style.left = (0)+"px";
    fpsGraphView.style.top = (0)+"px";
    fpsGraphView.style.width = (sw)+"px";
    fpsGraphView.style.height = (50)+"px";
    fpsGraphView.style.zIndex = "15";
    document.body.appendChild(fpsGraphView);

    fpsGraphView.getContext("2d").imageSmoothingEnabled = false;

    remoteGraphView = document.createElement("canvas");
    remoteGraphView.style.position = "absolute";
    remoteGraphView.width = (sw);
    remoteGraphView.height = (50);
    remoteGraphView.style.left = (0)+"px";
    remoteGraphView.style.top = (50)+"px";
    remoteGraphView.style.width = (sw)+"px";
    remoteGraphView.style.height = (50)+"px";
    remoteGraphView.style.zIndex = "15";
    document.body.appendChild(remoteGraphView);

    remoteGraphView.getContext("2d").imageSmoothingEnabled = false;

    running = false;
    toggleView = document.createElement("i");
    toggleView.style.position = "absolute";
    toggleView.style.color = "#fff";
    toggleView.className = "fa-solid fa-power-off";
    toggleView.style.lineHeight = "50px";
    toggleView.style.fontSize = "30px";
    toggleView.style.left = ((sw/2)-25)+"px";
    toggleView.style.top = ((sh/2)-225)+"px";
    toggleView.style.width = (50)+"px";
    toggleView.style.height = (50)+"px"; 
    toggleView.style.scale = "0.9";
    toggleView.style.border = "1px solid #fff";
    toggleView.style.borderRadius = "50%";
    toggleView.style.zIndex = "15";
    document.body.appendChild(toggleView);

    toggleView.onclick = function() {
        running = !running;
        ws.send("PAPER|"+playerId+"|toggle-power|"+running);
    };

    frameView = document.createElement("canvas");
    frameView.style.position = "absolute";
    frameView.style.objectFit = "cover";
    frameView.width = 150;
    frameView.height = 300;
    frameView.style.left = ((sw/2)-75)+"px";
    frameView.style.top = ((sh/2)-150)+"px";
    frameView.style.width = (150)+"px";
    frameView.style.height = (300)+"px"; 
    frameView.style.zIndex = "15";
    document.body.appendChild(frameView);

    startX = 0;
    startY = 0;

    frameView.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        var obj = {
            x: Math.floor(startX - ((sw/2)-75)),
            y: Math.floor(startY - ((sh/2)-150))
        };
        position.x = obj.x;
        position.y = obj.y;

        if (e.touches.length > 1) {
            startX2 = e.touches[1].clientX;
            startY2 = e.touches[1].clientY;

            var obj = {
                x: Math.floor(startX2 - ((sw/2)-75)),
                y: Math.floor(startY2 - ((sh/2)-150))
            };
            position2.x = obj.x;
            position2.y = obj.y;
        }

        ws.send("PAPER|"+playerId+"|touch-position|"+
        JSON.stringify(position));
    };
    frameView.ontouchmove = function(e) {
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;

        var obj = {
            x: Math.floor(moveX - ((sw/2)-75)),
            y: Math.floor(moveY - ((sh/2)-150))
        };

        position.x = obj.x;
        position.y = obj.y;

        if (e.touches.length > 1) {
            moveX2 = e.touches[1].clientX;
            moveY2 = e.touches[1].clientY;

            var obj = {
                x: Math.floor(moveX2 - ((sw/2)-75)),
                y: Math.floor(moveY2 - ((sh/2)-150))
            };
            position2.x = obj.x;
            position2.y = obj.y;
        }

        ws.send("PAPER|"+playerId+"|touch-position|"+
        JSON.stringify(position));
    };

    frameView.getContext("2d").imageSmoothingEnabled = false;

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "touch-position") {
            obj = JSON.parse(msg[3]);
            position2.x = obj.x;
            position2.y = obj.y;
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "toggle-power") {
            running = (msg[3] == "true");
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "fps-update") {
            var fps = parseInt(msg[3]);

            var x = remoteFPSPolygon.length > 0 ? 
            (remoteFPSPolygon[remoteFPSPolygon.length-1].x)+1 : 
            0;

            fpsChange = lastRemoteFPS-fps;
            var p = {
                x: x, y: 25+(fpsChange/4)
            };
            remoteFPSPolygon.push(p);

            if (remoteFPSPolygon.length > sw) {
                remoteFPSPolygon.splice(0, 1);
                for (var n = 0; n < remoteFPSPolygon.length; n++) {
                    remoteFPSPolygon[n].x = remoteFPSPolygon[n].x-1;
                }
            }
            lastRemoteFPS = fps;
            receivedTime = true;
        }
    };

    animate();
});

var lastRemoteFPS = 0;
var remoteFPSPolygon = [];
var receivedTime = true;

var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (receivedTime) {
        var fps = Math.floor(1000/elapsedTime);
        ws.send("PAPER|"+playerId+"|fps-update|"+fps);
        receivedTime = false;
    }
    if (!backgroundMode) {
        drawFPSGraph();
        drawRemoteGraph();
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var lastFps = 0;
var fpsPolygon = [];
var drawFPSGraph = function() {
    var ctx = fpsGraphView.getContext("2d");
    ctx.clearRect(0, 0, sw, 50);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, sw, 50);

    var fps = Math.floor(1000/elapsedTime);
    var x = fpsPolygon.length > 0 ?
    (fpsPolygon[fpsPolygon.length-1].x)+1 : 0;

    fpsChange = lastFps-fps;
    var p = {
        x: x, y: 25+(fpsChange/4)
    };

    fpsPolygon.push(p);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "limegreen";
    if (fpsPolygon.length > 1) {
        ctx.beginPath();
        ctx.moveTo(fpsPolygon[0].x, fpsPolygon[0].y);
        for (var n = 1; n < fpsPolygon.length; n++) {
            ctx.lineTo(fpsPolygon[n].x, fpsPolygon[n].y);
        }
        ctx.stroke();
    }

    if (fpsPolygon.length > sw) {
        fpsPolygon.splice(0, 1);
        for (var n = 0; n < fpsPolygon.length; n++) {
            fpsPolygon[n].x = fpsPolygon[n].x-1;
        }
    }

    lastFps = fps;
};

var drawRemoteGraph = function() {
    var ctx = remoteGraphView.getContext("2d");
    ctx.clearRect(0, 0, sw, 50);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, sw, 50);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "yellow";
    if (remoteFPSPolygon.length > 1) {
        ctx.beginPath();
        ctx.moveTo(remoteFPSPolygon[0].x, 
        remoteFPSPolygon[0].y);
        for (var n = 1; n < remoteFPSPolygon.length; n++) {
            ctx.lineTo(remoteFPSPolygon[n].x, 
            remoteFPSPolygon[n].y);
        }
        ctx.stroke();
    }
};

var animationSpeed = 1;
var animationFrame = 0;
var drawImage = function() {
    var ctx = frameView.getContext("2d");
    ctx.clearRect(0, 0, 150, 300);

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#fff";
    for (var n = 0; n < 30; n++) {
        var height = 
        Math.abs(position.y - ((n*10)+5)) < 20

        ctx.beginPath();
        ctx.moveTo(0, ((n*10)+5)+animationFrame);
        ctx.lineTo(75, 
        ((n*10)+5)+animationFrame);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(150, ((n*10)+5)+animationFrame);
        ctx.lineTo(75, 
        ((n*10)+5)+animationFrame);
        ctx.stroke();
    }

    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(position.x, position.y, 20, 0, (Math.PI*2));
    ctx.fill();

    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(position2.x, position2.y, 20, 0, (Math.PI*2));
    ctx.fill();

    if (position.x > -20 && position.x < 170 && running) {
        position.y += 0.5;
    }
    if (position2.x > -20 && position2.x < 170 && running) {
        position2.y += 0.5;
    }

    if (running)
    navigator.vibrate(100);

    if (animationFrame == 10 && running)
    animationFrame = 0
    else if (running)
    animationFrame += animationSpeed;
};

var position = {
    x: -20, y: 150
};

var position2 = {
    x: 170, y: 150
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