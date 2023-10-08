var beepDone = new Audio("audio/beep-done.wav");
var beepMilestone = new Audio("audio/beep-milestone.wav");

var rnd = Math.random();
var bgm0 = new Audio("audio/bgm-0.wav?rnd="+rnd);
var bgm1 = new Audio("audio/bgm-1.wav?rnd="+rnd);
var bgm2 = new Audio("audio/bgm-2.wav?rnd="+rnd);

var bgmNo = 0;
var bgm = bgm0;

var flipAudio = function() {
    bgmNo = (bgmNo+1) < 3 ? (bgmNo+1) : 0;
    if (bgmNo == 0)
    bgm = bgm0;
    else if (bgmNo == 1)
    bgm = bgm1;
    else
    bgm = bgm2;

    bgm.currentTime = 0;
    loadLyrics();
};

bgm0.playbackRate = 1;
bgm1.playbackRate = 1;
bgm2.playbackRate = 1;

bgm0.onended = flipAudio;
bgm1.onended = flipAudio;
bgm2.onended = flipAudio;

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

    lyricsView = document.createElement("span");
    lyricsView.style.position = "absolute";
    lyricsView.style.color = "#fff";
    lyricsView.innerText = "";
    lyricsView.style.lineHeight = "25px";
    lyricsView.style.fontSize = "15px";
    lyricsView.style.fontFamily = "Khand";
    lyricsView.style.left = (0)+"px";
    lyricsView.style.top = (0)+"px";
    lyricsView.style.width = (sw)+"px";
    lyricsView.style.height = (50)+"px"; 
    lyricsView.style.scale = "0.9";
    lyricsView.style.zIndex = "15";
    document.body.appendChild(lyricsView);

    distance = 0;
    distanceView = document.createElement("span");
    distanceView.style.position = "absolute";
    distanceView.style.color = "#fff";
    distanceView.innerText = distance+" px";
    distanceView.style.lineHeight = "50px";
    distanceView.style.fontSize = "15px";
    distanceView.style.fontFamily = "Khand";
    distanceView.style.left = ((sw/2)-100)+"px";
    distanceView.style.top = ((sh/2)-250)+"px";
    distanceView.style.width = (50)+"px";
    distanceView.style.height = (50)+"px"; 
    distanceView.style.scale = "0.9";
    distanceView.style.zIndex = "15";
    document.body.appendChild(distanceView);

    bpm = 0;
    lastBpm = 0;
    bpmView = document.createElement("span");
    bpmView.style.position = "absolute";
    bpmView.style.color = "#fff";
    bpmView.innerText = (bpm)+" bpm";
    bpmView.style.lineHeight = "50px";
    bpmView.style.fontSize = "15px";
    bpmView.style.fontFamily = "Khand";
    bpmView.style.left = ((sw/2)-75)+"px";
    bpmView.style.top = ((sh/2)-225)+"px";
    bpmView.style.width = (50)+"px";
    bpmView.style.height = (50)+"px"; 
    bpmView.style.scale = "0.9";
    bpmView.style.zIndex = "15";
    document.body.appendChild(bpmView);

    running = false;
    toggleView = document.createElement("i");
    toggleView.style.position = "absolute";
    toggleView.style.color = "#fff";
    toggleView.className = "fa-solid fa-power-off";
    toggleView.style.lineHeight = "50px";
    toggleView.style.fontSize = "30px";
    toggleView.style.left = ((sw/2)-25)+"px";
    toggleView.style.top = ((sh/2)-250)+"px";
    toggleView.style.width = (50)+"px";
    toggleView.style.height = (50)+"px"; 
    toggleView.style.scale = "0.9";
    toggleView.style.border = "1px solid #fff";
    toggleView.style.borderRadius = "50%";
    toggleView.style.zIndex = "15";
    document.body.appendChild(toggleView);

    toggleView.onclick = function() {
        running = !running;
        bgm.pause();
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

    var bpmStart = 0;
    var bgmTimeout = 0;

    frameView.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        var obj = {
            x: Math.floor(startX - ((sw/2)-75)),
            y: Math.floor(startY - ((sh/2)-150))
        };
        if (lastSide == 0) {
            position.x = obj.x;
            position.y = obj.y;
        }
        else {
            position2.x = obj.x;
            position2.y = obj.y;
        }

        if (lastSide == 0) {
            distance += (position.y-position2.y)*-1;
            distanceView.innerText = distance+" px";
        }
        else {
            distance += (position2.y-position.y)*-1;
            distanceView.innerText = distance+" px";
        }

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

        var bpmTime = (new Date().getTime() - bpmStart);
        bpm = (60000 / bpmTime).toFixed(1);
        bpmStart = new Date().getTime();
        lastBpm = bpm;
        bpmView.innerText = (bpm)+" bpm";

        if (bgm.paused)
        bgm.play();
        clearTimeout(bgmTimeout);
        bgmTimeout = setTimeout(function() {
            bgm.pause();
        }, (bpmTime*2));

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
        if (lastSide == 0) {
            position.x = obj.x;
            position.y = obj.y;
        }
        else {
            position2.x = obj.x;
            position2.y = obj.y;
        }

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
    frameView.ontouchend = function() {
        lastSide = lastSide == 0 ? 1 : 0;
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
    };

    loadLyrics();
    animate();
})

var lyricsLoaded = false;
var lyrics = [];

var loadLyrics = function() {
    lyricsLoaded = false;
    currentLine = 0;
    lyricsView.innerText = "";
    lyrics = [];
    var rnd = Math.random();
    var fileName = ("audio/bgm-"+bgmNo+".txt?rnd="+rnd);
    $.get(fileName, function(data) {
        var arr = data.split("\n");
        for (var n = 0; n < arr.length; n++) {
            var line = arr[n].split(" # ");
            if (line.length != 2) continue;
            var obj = {
                timestamp: toMiliseconds(line[0]),
                lyrics: line[1]
            };
            lyrics.push(obj);
        }
        lyricsLoaded = true;
    })
    .fail(function() {
        lyricsView.innerText = "LYRICS NOT FOUND";
    });
};

var toMiliseconds = function(timestamp) {
    var arr = timestamp.split(":");
    var minute = parseInt(arr[0]*60000);
    var seconds = parseInt(arr[1]*1000);
    var result = (minute+seconds);
    return result;
};

var syncLyrics = function() {
    var synchronized = false;
    var n0 = 0;
    var n1 = 1;
    for (var n = 0; n < lyrics.length; n++) {
        if (lyrics[n].timestamp > ((bgm.currentTime*1000)-(1000)) && n > 0) {
            n0 = (n-1);
            n1 = n;
            synchronized = true;
            break;
        }
    }
    if (synchronized)
    lyricsView.innerText = lyrics[n0].lyrics + "\n" + lyrics[n1].lyrics;
    else
    lyricsView.innerText = "";
};

var lastSide = 0;

var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if (lyricsLoaded)
        syncLyrics();
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
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

    if (position.x > -20 && position.x < 170 &&
        position.y > 320 && running) {
        position.y = -20;
    }
    if (position2.x > -20 && position2.x < 170 &&
        position2.y > 320 && running) {
        position2.y = -20;
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