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
    $("#title").css("top", "75px");
    $("#title").css("z-index", "25");

    // O outro nome não era [  ]
    // Teleprompter
    $("#title")[0].innerText = ""; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    voiceMode = 1;
    voiceModeView = document.createElement("span");
    voiceModeView.style.position = "absolute";
    voiceModeView.style.color = "#fff";
    voiceModeView.innerText = 
    voiceMode == 0 ? "MALE" : "FEMALE";
    voiceModeView.style.left = ((sw/2)-50)+"px";
    voiceModeView.style.top = (100)+"px";
    voiceModeView.style.width = (100)+"px";
    voiceModeView.style.height = (50)+"px";
    voiceModeView.style.zIndex = "25";
    document.body.appendChild(voiceModeView);

    voiceModeView.onclick = function() {
        voiceMode = (voiceMode+1) < 2 ? 
        (voiceMode+1) : 0;
        voiceModeView.innerText = 
        voiceMode == 0 ? "MALE" : "FEMALE";

        setup();
    };

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

    micAvgValue = 0;
    micThreshold = 0.5;
    thresholdReached = false;

    recordingEnabled = false;

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        mic.audio.pause();
        mic.record(function(url) {
            mic.audio.src = url;
            mic.audio.load();

            audioButtons[buttonNo].dataAddress = url;
            mic.download();
        });
    };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        micAvgValue = avgValue;

        if (avgValue >= micThreshold && !thresholdReached) {
            thresholdReached = true;
        }

        lineWidth = (avgValue*50);
        resumedWave = resumeWave(freqArray);
    };
    mic.onclose = function() { 
        //mic.download();
    };

    media = new MediaAnalyser(mic.audio);
    media.onupdate = function(freqArray, reachedFreq, avgValue) {
        lineWidth = (avgValue*50);
        resumedWave = resumeWave(freqArray);
    };

    var ab = new Array(50);
    for (var n = 0; n < 50; n++) {
        ab[n] = 0;
    }
    resumedWave = ab;

    mic.audio.style.position = "absolute";
    mic.audio.style.display = "block";
    mic.audio.style.top = (50)+"px";
    mic.audio.style.left = (0)+"px";
    mic.audio.style.width = (sw)+"px";
    mic.audio.controls = "controls";
    mic.audio.class = "track";
    mic.audio.style.zIndex = "25";
    document.body.appendChild(mic.audio);

    buttonMicView = document.createElement("button");
    buttonMicView.style.position = "absolute";
    buttonMicView.style.color = "#000";
    buttonMicView.innerText = "mic: off";
    buttonMicView.style.fontFamily = "Khand";
    buttonMicView.style.fontSize = "15px";
    buttonMicView.style.left = (sw-110)+"px";
    buttonMicView.style.top = (sh-110)+"px";
    buttonMicView.style.width = (100)+"px";
    buttonMicView.style.height = (50)+"px";
    buttonMicView.style.border = "1px solid white";
    buttonMicView.style.borderRadius = "25px";
    buttonMicView.style.zIndex = "15";
    document.body.appendChild(buttonMicView);

    var micStartTime = 0;
    buttonMicView.ontouchstart = function() {
        micStartTime = new Date().getTime();
    };

    buttonMicView.ontouchend = function() {
         recordingEnabled = recordingEnabled ||
         (new Date().getTime() - micStartTime) > 2000;

        if (mic.closed) {
            mic.open();
            buttonMicView.innerText = "mic: on";
        }
        else {
            mic.close();
            buttonMicView.innerText = "mic: off";
        }
    };

    var image_list = [
        ""
    ];

    buttonNo = 0;
    audioButtons = [];

    for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
        audioButtonView = document.createElement("button");
        audioButtonView.style.position = "absolute";
        audioButtonView.style.color = "#000";
        audioButtonView.innerText = "audio #"+((y*4)+x);
        audioButtonView.style.fontFamily = "Khand";
        audioButtonView.style.fontSize = "15px";
        audioButtonView.style.left = (x*(sw/4))+5+"px";
        audioButtonView.style.top = 
        ((sh/2)-(sw/2))+(y*(sw/4))+5+"px";
        audioButtonView.style.width = (sw/4)-10+"px";
        audioButtonView.style.height = (sw/4)-10+"px";
        audioButtonView.style.border = "1px solid white";
        audioButtonView.style.borderRadius = "5px";
        audioButtonView.style.zIndex = "15";
        document.body.appendChild(audioButtonView);

        audioButtonView.x = x;
        audioButtonView.y = y;

        var n = ((y*4)+x);
        audioButtonView.style.backgroundSize = "cover";

        if (n < image_list.length)
        audioButtonView.style.backgroundImage = 
        "url("+image_list[n]+")";

        audioButtonView.no = ((y*4)+x);
        audioButtonView.dataAddress = 
        x != pos.x || y != pos.y ?
        audioPreffix[voiceMode]+
        audio_list[getDirection({ x: x, y: y })] : 
        audioPreffix[voiceMode]+"found.wav";

        audioButtonView.audio = new Audio();
        audioButtonView.audio.src = 
        audioButtonView.dataAddress;
        //audioButtonView.audio.loop = true;

        audioButtonView.onstart = function() {
            audioButtonView.style.background = "lightblue";
        };
        audioButtonView.onended = function() {
            audioButtonView.style.background = "initial";
        };

        audioButtonView.onclick = function() {
            buttonNo = this.no;
            for (var n = 0; n < audioButtons.length; n++) {
                audioButtons[n].style.border = "1px solid white";
            }

            audioButtons[buttonNo].style.border = 
            "1px solid lightblue";

            console.log(this.dataAddress);

            if (!this.audio.paused) {
                mic.audio.pause();
            }
            else {
                mic.audio.pause();
                mic.audio.src = this.dataAddress;
                mic.audio.play();
            }

            if (this.x == pos.x && this.y == pos.y)
            setup();
        };

        audioButtons.push(audioButtonView);
    }
    }

    animate();
});

var pos = {
    x: Math.floor(Math.random()*4),
    y: Math.floor(Math.random()*4)
};

var audioPreffix = [
    "audio/audio-picture/m_",
    "audio/audio-picture/f_"
];

var audio_list = [
    "move_left.wav",
    "move_up.wav",
    "move_right.wav",
    "move_down.wav"
];

var getDirection = function(p) {
    var diffX = p.x-pos.x;
    var diffY = p.y-pos.y;

    var move = diffX != 0 && diffY != 0 ? 
    Math.floor(Math.random()*2) : 
    (diffX != 0 ? 0 : 1);

    if (move == 0)
    return diffX < 0 ? 2 : 0;
    else if (move == 1)
    return diffY < 0 ? 3 : 1;
};

var setup = function() {
    pos = {
        x: Math.floor(Math.random()*4),
        y: Math.floor(Math.random()*4)
    };
    for (var n = 0; n < audioButtons.length; n++) {
        var x = (n%4);
        var y = Math.floor(n/4);

        audioButtons[n].dataAddress = 
        x != pos.x || y != pos.y ?
        audioPreffix[voiceMode]+
        audio_list[getDirection({ x: x, y: y })] : 
        audioPreffix[voiceMode]+"found.wav";
    }
};

var listAudios = function() {
    for (var n = 0; n < audioButtons.length; n++) {
        console.log(
        audioButtons[n].dataAddress);
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
    ctx.strokeStyle = "#fff";

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

var updateImage = true;

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
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var lineWidth = 0;
var flipX = true;
var drawImage = function() {
    var ctx = imageView.getContext("2d");
    ctx.clearRect(0, 0, sw, sh);

    ctx.fillStyle = "#fff";
    ctx.lineWidth = 5;

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(10, 150);
    ctx.lineTo(10, 150-(100*micAvgValue));
    ctx.stroke();

    ctx.lineWidth = 0.5;

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, 150-(100*micThreshold));
    ctx.lineTo(15, 150-(100*micThreshold));
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "10px sans serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(micAvgValue.toFixed(2), 35, 150);

    drawAB(resumedWave);
};

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisivbilitychange";
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