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

    previewLyricsView = document.createElement("span");
    previewLyricsView.style.position = "absolute";
    previewLyricsView.style.color = "#fff";
    previewLyricsView.innerText = "";
    previewLyricsView.style.lineHeight = "25px";
    previewLyricsView.style.fontSize = "15px";
    previewLyricsView.style.fontFamily = "Khand";
    previewLyricsView.style.left = (0)+"px";
    previewLyricsView.style.top = (0)+"px";
    previewLyricsView.style.width = (sw)+"px";
    previewLyricsView.style.height = (50)+"px"; 
    //previewLyricsView.style.scale = "0.9";
    previewLyricsView.style.zIndex = "15";
    document.body.appendChild(previewLyricsView);

    lyricsView = document.createElement("div");
    lyricsView.style.position = "absolute";
    //lyricsView.style.background = "#fff";
    lyricsView.style.color = "#fff";
    lyricsView.style.fontFamily = "Khand";
    lyricsView.style.lineHeight = "50px";
    lyricsView.style.fontSize = "20px";
    lyricsView.style.left = (0)+"px";
    lyricsView.style.top = ((sh/2)-150)+"px";
    lyricsView.style.width = (sw)+"px";
    lyricsView.style.height = (300)+"px"; 
    //lyricsView.style.scale = "0.9";
    lyricsView.style.outline = "1px solid #fff";
    lyricsView.style.overflowY = "scroll";
    lyricsView.style.zIndex = "15";
    document.body.appendChild(lyricsView);

    speedView = document.createElement("span");
    speedView.style.position = "absolute";
    speedView.style.color = "#fff";
    speedView.innerText = playbackRate+"x";
    speedView.style.lineHeight = "50px";
    speedView.style.fontSize = "25px";
    speedView.style.fontFamily = "Khand";
    speedView.style.left = ((sw/2)-150)+"px";
    speedView.style.top = ((sh/2)-250)+"px";
    speedView.style.width = (50)+"px";
    speedView.style.height = (50)+"px"; 
    speedView.style.scale = "0.9";
    speedView.style.zIndex = "15";
    document.body.appendChild(speedView);

    speedView.onclick = function() {
        playbackRate = 
        Math.floor((playbackRate+1)) <= 3 ? 
        Math.floor((playbackRate+1)) : 0.5;
        bgm.playbackRate = playbackRate;
        speedView.innerText = playbackRate+"x";
    };

    audioView = document.createElement("span");
    audioView.style.position = "absolute";
    audioView.style.color = "#fff";
    audioView.innerText = "00:00";
    audioView.style.lineHeight = "50px";
    audioView.style.fontSize = "15px";
    audioView.style.fontFamily = "Khand";
    audioView.style.left = ((sw/2)-100)+"px";
    audioView.style.top = ((sh/2)-250)+"px";
    audioView.style.width = (50)+"px";
    audioView.style.height = (50)+"px"; 
    audioView.style.scale = "0.9";
    audioView.style.zIndex = "15";
    document.body.appendChild(audioView);

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
        if (running) {
            if (!reverseBgm.paused) {
                reverseBgm.pause();
                source.stop();
            }
            bgm.play();
        }
        else {
            bgm.pause();
        }
    };

    toggleReverseView = document.createElement("i");
    toggleReverseView.style.position = "absolute";
    toggleReverseView.style.display = "none";
    toggleReverseView.style.color = "#fff";
    toggleReverseView.className = "fa-solid fa-arrow-left";
    toggleReverseView.style.lineHeight = "50px";
    toggleReverseView.style.fontSize = "30px";
    toggleReverseView.style.left = (sw-50)+"px";
    toggleReverseView.style.top = ((sh/2)-200)+"px";
    toggleReverseView.style.width = (50)+"px";
    toggleReverseView.style.height = (50)+"px"; 
    toggleReverseView.style.scale = "0.7";
    //toggleReverseView.style.border = "1px solid #fff";
    //toggleReverseView.style.borderRadius = "50%";
    toggleReverseView.style.zIndex = "15";
    document.body.appendChild(toggleReverseView);

    toggleReverseView.onclick = function() {
        toggleReverseView.style.display = "none";
        //console.log(source, duration, now);
        source.connect(streamNode);
        //source.connect(context.destination);
        reverseBgm.srcObject = streamNode.stream;
        reverseBgm.load();
        source.start(0);
        reverseBgm.play();
    };

    loadBgmView = document.createElement("i");
    loadBgmView.style.position = "absolute";
    loadBgmView.style.color = "#fff";
    loadBgmView.className = "fa-solid fa-music";
    loadBgmView.style.lineHeight = "50px";
    loadBgmView.style.fontSize = "30px";
    loadBgmView.style.left = ((sw/2)+25)+"px";
    loadBgmView.style.top = ((sh/2)-250)+"px";
    loadBgmView.style.width = (50)+"px";
    loadBgmView.style.height = (50)+"px"; 
    loadBgmView.style.scale = "0.9";
    loadBgmView.style.border = "1px solid #fff";
    loadBgmView.style.borderRadius = "50%";
    loadBgmView.style.zIndex = "15";
    document.body.appendChild(loadBgmView);

    loadBgmView.onclick = function() {
        audioLoaded = false;
        fileInput.click();
    };

    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".wav, .mp3";

    fileInput.onchange = function(e) {
        if (!e.target.files.length) return;
        //reverseAudio(e.target.files[0]);

        var urlObj = URL.createObjectURL(e.target.files[0]);
        bgm.src = urlObj;
        bgm.load();

        audioLoaded = true;
    };

    loadLyricsView = document.createElement("i");
    loadLyricsView.style.position = "absolute";
    loadLyricsView.style.color = "#fff";
    loadLyricsView.className = "fa-solid fa-file";
    loadLyricsView.style.lineHeight = "50px";
    loadLyricsView.style.fontSize = "30px";
    loadLyricsView.style.left = ((sw/2)+75)+"px";
    loadLyricsView.style.top = ((sh/2)-250)+"px";
    loadLyricsView.style.width = (50)+"px";
    loadLyricsView.style.height = (50)+"px"; 
    loadLyricsView.style.scale = "0.9";
    loadLyricsView.style.border = "1px solid #fff";
    loadLyricsView.style.borderRadius = "50%";
    loadLyricsView.style.zIndex = "15";
    document.body.appendChild(loadLyricsView);

    loadLyricsView.onclick = function() {
        txtFileInput.click();
    };

    txtFileInput = document.createElement("input");
    txtFileInput.type = "file";
    txtFileInput.accept = ".txt";

    txtFileInput.onchange = function(e) {
        if (!e.target.files.length) return;
        loadLyrics(e.target.files[0]);
    };

    timestampView = document.createElement("canvas");
    timestampView.style.position = "absolute";
    timestampView.style.left = (25)+"px";
    timestampView.width = (sw-50);
    timestampView.height = 50;
    timestampView.style.top = ((sh/2)-200)+"px";
    timestampView.style.width = (sw-50)+"px";
    timestampView.style.height = (50)+"px"; 
    timestampView.style.scale = "0.9";
    timestampView.style.zIndex = "15";
    document.body.appendChild(timestampView);

    var setTime = function(e) {
        var time = 
        ((1/(sw-50))*(e.touches[0].clientX-25))*bgm.duration;
        bgm.currentTime = time;
    };

    timestampView.ontouchstart = setTime;
    timestampView.ontouchmove = setTime;

    moveDown = document.createElement("i");
    moveDown.style.position = "absolute";
    moveDown.style.color = "#fff";
    moveDown.className = "fa-solid fa-arrow-down";
    moveDown.style.lineHeight = "50px";
    moveDown.style.fontSize = "30px";
    moveDown.style.left = ((sw/2)+50)+"px";
    moveDown.style.top = ((sh/2)+150)+"px";
    moveDown.style.width = (50)+"px";
    moveDown.style.height = (50)+"px"; 
    moveDown.style.scale = "0.7";
    moveDown.style.border = "1px solid #fff";
    moveDown.style.borderRadius = "50%";
    moveDown.style.zIndex = "15";
    document.body.appendChild(moveDown);

    moveDown.onclick = function() {
        currentLine = (currentLine+1) < lyrics.length-1 ? 
        (currentLine+1) : 0;
        markLine(currentLine);
        moveTo(currentLine);
    };

    moveUp = document.createElement("i");
    moveUp.style.position = "absolute";
    moveUp.style.color = "#fff";
    moveUp.className = "fa-solid fa-arrow-up";
    moveUp.style.lineHeight = "50px";
    moveUp.style.fontSize = "30px";
    moveUp.style.left = ((sw/2)+100)+"px";
    moveUp.style.top = ((sh/2)+150)+"px";
    moveUp.style.width = (50)+"px";
    moveUp.style.height = (50)+"px"; 
    moveUp.style.scale = "0.7";
    moveUp.style.border = "1px solid #fff";
    moveUp.style.borderRadius = "50%";
    moveUp.style.zIndex = "15";
    document.body.appendChild(moveUp);

    moveUp.onclick = function() {
        currentLine = (currentLine-1) >= 0 ? 
        (currentLine-1) : (lyrics.length-1);
        markLine(currentLine);
        moveTo(currentLine);
    };

    fixLine = document.createElement("i");
    fixLine.style.position = "absolute";
    fixLine.style.color = "#fff";
    fixLine.className = "fa-solid fa-check";
    fixLine.style.lineHeight = "50px";
    fixLine.style.fontSize = "30px";
    fixLine.style.left = ((sw/2)+100)+"px";
    fixLine.style.top = ((sh/2)+200)+"px";
    fixLine.style.width = (50)+"px";
    fixLine.style.height = (50)+"px"; 
    fixLine.style.scale = "0.9";
    fixLine.style.border = "1px solid #fff";
    fixLine.style.borderRadius = "50%";
    fixLine.style.zIndex = "15";
    document.body.appendChild(fixLine);

    fixLine.onclick = function() {
        lyrics[currentLine].timestamp = (bgm.currentTime*1000);
        lyrics[currentLine].time = formatTime(bgm.currentTime);
        lyrics[currentLine].timeView.innerText = 
        lyrics[currentLine].time;

        currentLine = (currentLine+1) < lyrics.length ? 
        (currentLine+1) : 0;
        markLine(currentLine);
    };

    followingTime = false;
    followView = document.createElement("span");
    followView.style.position = "absolute";
    followView.style.background = "#fff";
    followView.style.color = "#000";
    followView.innerText = followingTime ? "ON" : "OFF";
    followView.style.fontFamily = "Khand";
    followView.style.lineHeight = "50px";
    followView.style.fontSize = "20px";
    followView.style.left = ((sw/2)-150)+"px";
    followView.style.top = ((sh/2)+200)+"px";
    followView.style.width = (50)+"px";
    followView.style.height = (50)+"px"; 
    followView.style.scale = "0.9";
    followView.style.border = "1px solid #fff";
    followView.style.borderRadius = "50%";
    followView.style.zIndex = "15";
    document.body.appendChild(followView);

    followView.onclick = function() {
        followingTime = !followingTime;
        followView.innerText = followingTime ? "ON" : "OFF";
    };

    markView = document.createElement("div");
    markView.style.position = "absolute";
    markView.style.background = mark == 0 ? 
    "orange" : "limegreen";
    markView.style.lineHeight = "50px";
    markView.style.fontSize = "20px";
    markView.style.left = ((sw/2)-150)+"px";
    markView.style.top = ((sh/2)+150)+"px";
    markView.style.width = (50)+"px";
    markView.style.height = (50)+"px"; 
    markView.style.scale = "0.7";
    //markView.style.border = "1px solid #fff";
    markView.style.borderRadius = "50%";
    markView.style.zIndex = "15";
    document.body.appendChild(markView);

    downloadView = document.createElement("span");
    downloadView.style.position = "absolute";
    downloadView.style.background = "#fff";
    downloadView.style.color = "#000";
    downloadView.innerText = "DOWNLOAD";
    downloadView.style.fontFamily = "Khand";
    downloadView.style.lineHeight = "50px";
    downloadView.style.fontSize = "20px";
    downloadView.style.left = ((sw/2)-50)+"px";
    downloadView.style.top = ((sh/2)+200)+"px";
    downloadView.style.width = (100)+"px";
    downloadView.style.height = (50)+"px"; 
    downloadView.style.scale = "0.9";
    downloadView.style.border = "1px solid #fff";
    downloadView.style.borderRadius = "25px";
    downloadView.style.zIndex = "15";
    document.body.appendChild(downloadView);

    downloadView.onclick = function() {
        saveToFile();
    };

    animate();
})

var mark = 0;
var startMark = -1;
var endMark = -1;

var lyricsLoaded = false;
var currentLine = 0;
var lyrics = [];

var loadLyrics = function(data) {
    currentLine = 0;
    lyrics = [];
    lyricsView.innerHTML = "LOADING FILE";

    var fileReader = new FileReader(); 
    fileReader.onload = function(e) { 
        lyricsView.innerHTML = "";
        //console.log(e.target.result);
        var arr = fileReader.result.split("\n");
        for (var n = 0; n < arr.length; n++) {
            var line = arr[n].split(" # ");
            if (line.length != 2)
            line = [ "00:00", line[0] ];
            var obj = {
                n: n,
                timestamp: toMiliseconds(line[0]),
                time: line[0],
                lyrics: line[1]
            };
            timeView = document.createElement("span");
            timeView.style.position = "absolute";
            timeView.className = "time-view";
            timeView.style.color = "#fff";
            timeView.innerText = obj.time;
            timeView.style.lineHeight = "25px";
            timeView.style.fontSize = "15px";
            timeView.style.textAlign = "center";
            timeView.style.fontFamily = "Khand";
            timeView.style.left = (0)+"px";
            timeView.style.top = (n*25)+"px";
            timeView.style.width = (50)+"px";	
            timeView.style.height = (25)+"px"; 
            timeView.obj = obj;
            //timeView.style.scale = "0.9";
            timeView.style.zIndex = "15";
            lyricsView.appendChild(timeView);
            obj.timeView = timeView;

            timeView.onclick = function() {
                currentLine = this.obj.n;
                markLine(currentLine);
                moveTo(currentLine);

                markTime(currentLine);
            };

            lineView = document.createElement("span");
            lineView.style.position = "absolute";
            lineView.className = "line-view";
            lineView.style.color = "#fff";
            lineView.innerText = obj.lyrics;
            lineView.style.lineHeight = "25px";
            lineView.style.fontSize = "15px";
            lineView.style.textAlign = "left";
            lineView.style.fontFamily = "Khand";
            lineView.style.left = (50)+"px";
            lineView.style.top = (n*25)+"px";
            lineView.style.width = (sw-50)+"px";
            lineView.style.height = (25)+"px"; 
            //lineView.style.scale = "0.9";
            lineView.obj = obj;
            lineView.style.overflow = "hidden";
            lineView.style.zIndex = "15";
            lyricsView.appendChild(lineView);
            obj.lineView = lineView;

            lineView.onclick = function() {
                currentLine = this.obj.n;
                markLine(this.obj.n);
            };

            lyrics.push(obj);
        }
        markLine(currentLine);
        lyricsLoaded = true;
    };
    fileReader.readAsText(data, "UTF-8");
};

var markLine = function(n) {
    $(".line-view").css("border-bottom", "initial");
    lyrics[n].lineView.style.borderBottom = "1px solid lightblue";

    if (followingTime)
    lyricsView.scrollTo({
        left: 0,
        top: (n*25)
    });
};

var markTime = function(n) {
    $(".time-view").css("border-bottom", "initial");

    if (mark == 0)
    startMark = n;
    else
    endMark = n;

    if (startMark > -1)
    lyrics[startMark].timeView.style.borderBottom = "1px solid orange";
    if (endMark > -1)
    lyrics[endMark].timeView.style.borderBottom = "1px solid limegreen";

    mark = mark == 0 ? 1 : 0;
    markView.style.background = mark == 0 ? 
    "orange" : "limegreen";
};

var moveTo = function(n) {
    bgm.currentTime = (lyrics[n].timestamp/1000);
};

var saveToFile = function() {
    var result = "";
    for (var n = 0; n < lyrics.length; n++) {
        result += lyrics[n].time + " # " + lyrics[n].lyrics;
        if (n < (lyrics.length-1))
        result += "\n";
    }

    var dataURL = 
    ("data:text/plain;charset=utf-8," + 
    encodeURIComponent(result));

    var hiddenElement = document.createElement('a');
    hiddenElement.href = dataURL;
    hiddenElement.target = "_blank";
    hiddenElement.download = "bgm-edit.txt";
    hiddenElement.click();
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
    if (synchronized) {
        previewLyricsView.innerText = 
        lyrics[n0].lyrics + "\n" + lyrics[n1].lyrics;
        if (followingTime) {
            currentLine = n0;
            markLine(currentLine);

            if (currentLine > endMark) {
                currentLine = startMark;
                markLine(currentLine);
                moveTo(currentLine);
            }
        }
    }
    else {
        previewLyricsView.innerText = "";
    }
};

var updateTime = function() {
    if (!reverseBgm.paused)
    bgm.currentTime = 
    (source.buffer.duration - context.currentTime);

    audioView.innerText = 
    reverseBgm.paused ? 
    formatTime(bgm.currentTime) : 
    formatTime(source.buffer.duration - context.currentTime);
};

var showMilliseconds = false;
var formatTime = function(timestamp) {
    var minute = Math.floor((timestamp*1000)/60000);
    var seconds = Math.floor(((timestamp*1000)%60000)/1000);
    var milliseconds = 
    Math.floor(((timestamp*1000)%1000));

    var result = 
    minute.toString().padStart(2, "0")+":"+
    seconds.toString().padStart(2, "0")+
    (showMilliseconds ? 
    ("."+milliseconds.toString().padStart(2, "0")) : "");

    return result;
};

var reverseBgm = new Audio();
reverseBgm.onload = function() {
    reverseBgm.play();
};

var context = new AudioContext();
var source = context.createBufferSource();
var streamNode = context.createMediaStreamDestination();

var reverseAudio = function(data) {
    var fileReader = new FileReader(); 
    fileReader.onload = function(e) { 
        context.decodeAudioData(e.target.result,  function(buffer){
            source.buffer = buffer;
            var duration = buffer.duration;
            var now = context.currentTime;
            Array.prototype.reverse.call( buffer.getChannelData(0) );
            Array.prototype.reverse.call( buffer.getChannelData(1) );

            toggleReverseView.style.display = "initial";
        });
    };
    fileReader.readAsArrayBuffer(data);
};

var lastSide = 0;

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

var toMiliseconds = function(timestamp) {
    var arr = timestamp.split(":");
    var minute = parseInt(arr[0]*60000);
    var seconds = parseInt(arr[1]*1000);
    var result = (minute+seconds);
    return result;
};

var audioLoaded = false;
var drawTimestamp = function() {
    var ctx = timestampView.getContext("2d");
    ctx.clearRect(0, 0, (sw-50), 50);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#aaa";

    ctx.beginPath();
    ctx.moveTo(0, 25);
    ctx.lineTo((sw-50), 25);
    ctx.stroke();

    ctx.strokeStyle = "limegreen";
    var length = reverseBgm.paused ? 
    ((1/bgm.duration)*bgm.currentTime)*(sw-50) : 
    (1-((1/source.buffer.duration)*context.currentTime))*(sw-50);
    ctx.beginPath();
    ctx.moveTo(0, 25);
    ctx.lineTo(length, 25);
    ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(length, 20);
    ctx.lineTo(length, 30);
    ctx.stroke();
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