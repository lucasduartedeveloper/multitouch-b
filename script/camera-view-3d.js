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

    camera = document.createElement("video");
    camera.style.position = "absolute";
    camera.style.display = "none";
    camera.autoplay = true;
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

    recordedVideo = document.createElement("video");
    recordedVideo.style.position = "absolute";
    recordedVideo.autoplay = true;
    recordedVideo.controls = true;
    recordedVideo.style.objectFit = "cover";
    recordedVideo.width = (sw/2);
    recordedVideo.height = (sw); 
    recordedVideo.style.left = (sw/2)+"px";
    recordedVideo.style.top = ((sh/2)-(sw/2))+"px";
    recordedVideo.style.width = (sw/2)+"px";
    recordedVideo.style.height = (sw)+"px";
    recordedVideo.style.zIndex = "15";
    document.body.appendChild(recordedVideo);

    recordedVideo.src = 
    "https://192.168.15.4:8443/movies/movie-0.mp4";

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

    deviceNo = 0;
    imageView.onclick = function(e) {
        if (cameraOn) {
            flipX = !flipX;
        }
        else {
            startCamera();
        }
        if (recordedVideo.paused)
        recordedVideo.play();
    };

    var startX = 0;
    var startY = 0;
    updateWidth = false;

    imageView.ontouchstart = function(e) {
        lineWidth = 0;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        updateWidth = true;
    };

    imageView.ontouchmove = function(e) {
        moveX = e.touches[0].clientX - startX;
        moveY = e.touches[0].clientY - startY;

        var co = Math.abs(moveX);
        var ca = Math.abs(moveY);

        var hyp = Math.sqrt(Math.pow(co, 2), Math.pow(ca, 2));
        lineWidth = hyp;
    };

    imageView.ontouchend = function(e) {
        updateWidth = false;
    };

    buttonView = document.createElement("button");
    buttonView.style.position = "absolute";
    buttonView.style.color = "#000";
    buttonView.innerText = "PAUSE";
    buttonView.style.fontFamily = "Khand";
    buttonView.style.left = (10)+"px";
    buttonView.style.top = (sh-110)+"px";
    buttonView.style.width = (100)+"px";
    buttonView.style.height = (50)+"px";
    buttonView.style.border = "1px solid white";
    buttonView.style.borderRadius = "25px";
    buttonView.style.zIndex = "15";
    document.body.appendChild(buttonView);

    var pauseNo = 0;
    var pauseArr = [
        [ 0, 1, 2, 3 ],
        [ 0, 2, 1, 3 ],
        [ 0, 3, 1, 2 ]
    ];

    pause = 0;
    buttonView.onclick = function() {
        setTimeout(function() {
            beepMilestone.play();

            thresholdReached = false;
            pauseNo = (pauseNo+1) < 4 ? (pauseNo+1) : 0;
            pause = pauseArr[pauseOrder][pauseNo];

            if (pause == 0) 
            buttonView.innerText = "PAUSE";
            else if (pause == 1) 
            buttonView.innerText = "PAUSE <";
            else if (pause == 2) 
            buttonView.innerText = "PAUSE >";
            else if (pause == 3) 
            buttonView.innerText = "PAUSE ><";
        }, 5000);
    };

    pauseOrder = 0;
    buttonOrderView = document.createElement("button");
    buttonOrderView.style.position = "absolute";
    buttonOrderView.style.color = "#000";
    buttonOrderView.innerText = "PAUSE ORDER: 0";
    buttonOrderView.style.fontFamily = "Khand";
    buttonOrderView.style.fontSize = "15px";
    buttonOrderView.style.left = (10)+"px";
    buttonOrderView.style.top = (sh-50)+"px";
    buttonOrderView.style.width = (100)+"px";
    buttonOrderView.style.height = (25)+"px";
    buttonOrderView.style.border = "1px solid white";
    buttonOrderView.style.borderRadius = "25px";
    buttonOrderView.style.zIndex = "15";
    document.body.appendChild(buttonOrderView);

    buttonOrderView.onclick = function() {
        pauseOrder = (pauseOrder+1) < 3 ? (pauseOrder+1) : 0;
        buttonOrderView.innerText = 
        "PAUSE ORDER: "+pauseOrder;
    };

    button3DView = document.createElement("button");
    button3DView.style.position = "absolute";
    button3DView.style.color = "#000";
    button3DView.innerText = "3D LOADER";
    button3DView.style.fontFamily = "Khand";
    button3DView.style.fontSize = "15px";
    button3DView.style.left = (120)+"px";
    button3DView.style.top = (sh-110)+"px";
    button3DView.style.width = (100)+"px";
    button3DView.style.height = (50)+"px";
    button3DView.style.border = "1px solid white";
    button3DView.style.borderRadius = "25px";
    button3DView.style.zIndex = "15";
    document.body.appendChild(button3DView);

    threejsEnabled = false;
    button3DView.onclick = function() {
        threejsEnabled = !threejsEnabled;
        renderer.domElement.style.display = 
        threejsEnabled ? "initial" : "none";
        modes.style.display = 
        threejsEnabled ? "initial" : "none";
        eyeSep.style.display = 
        threejsEnabled ? "initial" : "none";
    };

    micAvgValue = 0;
    micThreshold = 0.5;
    thresholdReached = false;

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        mic.audio.pause();
        //mic.audio.srcObject = mic.audioStream.mediaStream;
        //mic.audio.play();
        mic.record();
        startList();
    };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        micAvgValue = avgValue;

        if (avgValue >= micThreshold && !thresholdReached) {
            thresholdReached = true;
            buttonView.click();
        }

        lineWidth = (avgValue*50);
        resumedWave = resumeWave(freqArray);
    };
    mic.onclose = function() { 
        mic.audio.loop = true;
        mic.audio.play();

        mic.download();
    };
    var ab = new Array(50);
    for (var n = 0; n < 50; n++) {
        ab[n] = 0;
    }
    resumedWave = ab;

    audioContainer = document.createElement("div");
    audioContainer.style.position = "absolute";
    audioContainer.style.left = (0)+"px";
    audioContainer.style.top = (50)+"px";
    audioContainer.style.width = (sw)+"px";
    audioContainer.style.height = (50)+"px";
    audioContainer.style.zIndex = "15";
    //document.body.appendChild(audioContainer);

    mic.audio.style.display = "block";
    mic.audio.style.width = (sw)+"px";
    mic.audio.controls = "controls";
    mic.audio.class = "track";
    audioContainer.appendChild(mic.audio);

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

    buttonMicView.onclick = function() {
        if (mic.closed) {
            mic.open();
            buttonMicView.innerText = "mic: on";

            htmlRecorder.start();
        }
        else {
            mic.close();
            buttonMicView.innerText = "mic: off";

            htmlRecorder.stop();
            htmlRecorder.save("filename.webm");
        }
    };

    buttonEffectView = document.createElement("button");
    buttonEffectView.style.position = "absolute";
    buttonEffectView.style.color = "#000";
    buttonEffectView.innerText = "fx: off";
    buttonEffectView.style.fontFamily = "Khand";
    buttonEffectView.style.fontSize = "15px";
    buttonEffectView.style.left = (10)+"px";
    buttonEffectView.style.top = (sh-145)+"px";
    buttonEffectView.style.width = (75)+"px";
    buttonEffectView.style.height = (25)+"px";
    buttonEffectView.style.border = "1px solid white";
    buttonEffectView.style.borderRadius = "25px";
    buttonEffectView.style.zIndex = "15";
    document.body.appendChild(buttonEffectView);

    effect = false;
    buttonEffectView.onclick = function() {
        effect = !effect;
        if (effect)
        buttonEffectView.innerText = "fx: on";
        else
        buttonEffectView.innerText = "fx: off";
    };

    buttonRotateView = document.createElement("button");
    buttonRotateView.style.position = "absolute";
    buttonRotateView.style.color = "#000";
    buttonRotateView.innerText = "single";
    buttonRotateView.style.fontFamily = "Khand";
    buttonRotateView.style.fontSize = "15px";
    buttonRotateView.style.left = (95)+"px";
    buttonRotateView.style.top = (sh-145)+"px";
    buttonRotateView.style.width = (75)+"px";
    buttonRotateView.style.height = (25)+"px";
    buttonRotateView.style.border = "1px solid white";
    buttonRotateView.style.borderRadius = "25px";
    buttonRotateView.style.zIndex = "15";
    document.body.appendChild(buttonRotateView);

    rotated = false;
    buttonRotateView.onclick = function() {
        rotated = !rotated;
        if (rotated) {
            buttonRotateView.innerText = "missing";
            videoCanvas.style.transform = "initial";
        }
        else {
            buttonRotateView.innerText = "single";
            videoCanvas.style.transform = 
            "rotateZ("+(boardAngle*(180/Math.PI))+"deg)";
        }
    };

    buttonPositionView = document.createElement("button");
    buttonPositionView.style.position = "absolute";
    buttonPositionView.style.color = "#000";
    buttonPositionView.innerText = "in front";
    buttonPositionView.style.fontFamily = "Khand";
    buttonPositionView.style.fontSize = "15px";
    buttonPositionView.style.left = (180)+"px";
    buttonPositionView.style.top = (sh-145)+"px";
    buttonPositionView.style.width = (75)+"px";
    buttonPositionView.style.height = (25)+"px";
    buttonPositionView.style.border = "1px solid white";
    buttonPositionView.style.borderRadius = "25px";
    buttonPositionView.style.zIndex = "15";
    document.body.appendChild(buttonPositionView);

    inFront = true;
    buttonPositionView.onclick = function() {
        inFront = !inFront;
        if (inFront)
        buttonPositionView.innerText = "in front";
        else
        buttonPositionView.innerText = "behind";
    };

    buttonTextReceiverView = 
    document.createElement("button");
    buttonTextReceiverView.style.position = "absolute";
    buttonTextReceiverView.style.color = "#000";
    buttonTextReceiverView.innerText = "camera";
    buttonTextReceiverView.style.fontFamily = "Khand";
    buttonTextReceiverView.style.fontSize = "15px";
    buttonTextReceiverView.style.left = (265)+"px";
    buttonTextReceiverView.style.top = (sh-145)+"px";
    buttonTextReceiverView.style.width = (75)+"px";
    buttonTextReceiverView.style.height = (25)+"px";
    buttonTextReceiverView.style.border = "1px solid white";
    buttonTextReceiverView.style.borderRadius = "25px";
    buttonTextReceiverView.style.zIndex = "15";
    document.body.appendChild(buttonTextReceiverView);

    isCamera = false;
    buttonTextReceiverView.onclick = function() {
        isCamera = !isCamera;
        if (isCamera) {
            textView.style.display = "none";
            buttonTextReceiverView.innerText = "camera";
        }
        else {
            textView.style.display = "initial";
            buttonTextReceiverView.innerText = "text";
        }
    };

    textView = document.createElement("span");
    textView.style.position = "absolute";
    textView.style.display = "none";
    textView.style.background = backgroundColor;
    textView.style.color = "#fff";
    textView.innerText = "ABERTO";
    textView.style.textWrap = "wrap";
    textView.style.fontWeight = (900)+"px";
    textView.style.fontFamily = "Khand";
    textView.style.fontSize = (sw/8)+"px";
    textView.style.lineHeight = (sw)+"px";
    textView.style.left = (-(sh-sw)/2)+"px";
    textView.style.top = ((sh/2)-(sw/2))+"px";
    textView.style.width = (sh)+"px";
    textView.style.height = (sw)+"px";
    textView.style.transform = "rotateY(-180deg) rotateZ(90deg)";
    textView.style.zIndex = "35";
    document.body.appendChild(textView);

    viewerCountView = document.createElement("span");
    viewerCountView.style.position = "absolute";
    viewerCountView.style.color = "#fff";
    viewerCountView.innerText = viewerCount + " viewers";
    viewerCountView.style.textWrap = "wrap";
    viewerCountView.style.fontWeight = (900)+"px";
    viewerCountView.style.fontFamily = "Khand";
    viewerCountView.style.fontSize = (15)+"px";
    viewerCountView.style.lineHeight = (15)+"px";
    viewerCountView.style.left = (sw-110)+"px";
    viewerCountView.style.top = ((sh/2)-(sw/2)-25)+"px";
    viewerCountView.style.width = (100)+"px";
    viewerCountView.style.height = (25)+"px";
    viewerCountView.style.zIndex = "15";
    document.body.appendChild(viewerCountView);

    viewerCountView.onclick = function() {
        viewerCount += 1;
        viewerCountView.innerText = viewerCount + " viewers";
    };

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "new-text") {
            $("#title")[0].innerText = msg[3].replace("#", "\n");
            textView.innerText = msg[3].replace("#", "\n");
        }
    };

    squareCanvas = document.createElement("canvas");
    squareCanvas.width = sw;
    squareCanvas.height = sw;

    videoCanvas = document.createElement("canvas");
    videoCanvas.width = sw;
    videoCanvas.height = sw;
    videoCanvas.style.left = (0)+"px";
    videoCanvas.style.top = ((sh/2)-(sw/2))+"px";
    videoCanvas.style.width = (sw)+"px";
    videoCanvas.style.height = (sw)+"px";
    videoCanvas.style.zIndex = "25";
    document.body.appendChild(videoCanvas);

    squareAngles = [];

    rotatedX = -1;
    rotatedY = -1;

    videoCanvas.onclick = function(e) {
        var offsetX = 0;
        var offsetY = (sh/2)-(sw/2);

        var posX = Math.floor((e.clientX-offsetX)/(sw/4));
        var posY = Math.floor((e.clientY-offsetY)/(sw/4));

        rotatedX = posX;
        rotatedY = posY;

        var defined = false;
        for (var n = 0; n < squareAngles.length; n++) {
            if (squareAngles[n].rotatedX == rotatedX && 
            squareAngles[n].rotatedY == rotatedY) {
                defined = true;
                squareAngles[n].angle += -(Math.PI/2);
                if (squareAngles[n].angle < -((Math.PI/2)*3))
                squareAngles[n].angle = 0;

                if (boardAngle != 0)
                squareAngles[n].angle = boardAngle;
            }
        }

        if (!defined) {
            squareAngles.push({
                rotatedX: rotatedX,
                rotatedY: rotatedY,
                angle: 0
            });
        }

        if (!rotated) {
            textObj.value = prompt();
            textObj.posX = rotatedX;
            textObj.posY = rotatedY;
        }
    };

    var htmlRecorder = new CanvasRecorder(videoCanvas);

    boardAngle = 0;
    boardAngleView = document.createElement("span");
    boardAngleView.style.position = "absolute";
    boardAngleView.style.color = "#fff";
    boardAngleView.innerText = boardAngle+"°";
    boardAngleView.style.textWrap = "wrap";
    boardAngleView.style.fontWeight = (900)+"px";
    boardAngleView.style.fontFamily = "Khand";
    boardAngleView.style.fontSize = (15)+"px";
    boardAngleView.style.lineHeight = (15)+"px";
    boardAngleView.style.left = (sw-110)+"px";
    boardAngleView.style.top = ((sh/2)-(sw/2)-50)+"px";
    boardAngleView.style.width = (100)+"px";
    boardAngleView.style.height = (25)+"px";
    boardAngleView.style.zIndex = "15";
    document.body.appendChild(boardAngleView);

    boardAngleView.onclick = function() {
        boardAngle += -(Math.PI/2);
        if (boardAngle < -((Math.PI/2)*3))
        boardAngle = 0;

        var angle = boardAngle*(180/Math.PI);
        angle = angle < -90 ? -angle-180 : angle;

        if (!rotated)
        videoCanvas.style.transform = 
        "rotateZ("+(boardAngle*(180/Math.PI))+"deg)";

        boardAngleView.innerText = angle+"°";
    };

    videoBackgroundView = document.createElement("div");
    videoBackgroundView.style.position = "absolute";
    videoBackgroundView.style.background= "#000";
    videoBackgroundView.style.left = (0)+"px";
    videoBackgroundView.style.top = (0)+"px";
    videoBackgroundView.style.width = (sw)+"px";
    videoBackgroundView.style.height = (sh)+"px";
    videoBackgroundView.style.zIndex = "15";
    document.body.appendChild(videoBackgroundView);

    videoBackgroundTitleView = 
    document.createElement("span");
    videoBackgroundTitleView.style.position = "absolute";
    videoBackgroundTitleView.style.color = "#fff";
    videoBackgroundTitleView.innerText = 
    "ADICIONE OS NÚMEROS";
    videoBackgroundTitleView.style.textAlign = "center";
    videoBackgroundTitleView.style.fontWeight = (900)+"px";
    videoBackgroundTitleView.style.fontFamily = "Khand";
    videoBackgroundTitleView.style.fontSize = (15)+"px";
    videoBackgroundTitleView.style.lineHeight = (25)+"px";
    videoBackgroundTitleView.style.left = (10)+"px";
    videoBackgroundTitleView.style.top = 
    ((sh/2)-(sw/2)-25)+"px";
    videoBackgroundTitleView.style.width = (sw-20)+"px";
    videoBackgroundTitleView.style.height = (25)+"px";
    videoBackgroundTitleView.style.zIndex = "15";
    videoBackgroundView
    .appendChild(videoBackgroundTitleView);

    videoGuestNameView = 
    document.createElement("span");
    videoGuestNameView.style.position = "absolute";
    videoGuestNameView.style.color = "#fff";
    videoGuestNameView.innerText = 
    "CONVIDADO (A)";
    videoGuestNameView.style.textAlign = "right";
    videoGuestNameView.style.fontWeight = (900)+"px";
    videoGuestNameView.style.fontFamily = "Khand";
    videoGuestNameView.style.fontSize = (15)+"px";
    videoGuestNameView.style.lineHeight = (25)+"px";
    videoGuestNameView.style.left = (10)+"px";
    videoGuestNameView.style.bottom = 
    (((sh-sw)/2)-25)+"px";
    videoGuestNameView.style.width = (sw-20)+"px";
    videoGuestNameView.style.height = (25)+"px";
    videoGuestNameView.style.zIndex = "15";
    videoBackgroundView
    .appendChild(videoGuestNameView);

    videoGuestNameView.onclick = function() {
        videoGuestNameView.innerText = prompt();
    };

    hasBackground = false;
    videoBackgroundToggleView = document.createElement("i");
    videoBackgroundToggleView.style.position = "absolute";
    videoBackgroundToggleView.className= 
    "fa-solid fa-film";
    videoBackgroundToggleView.style.color= "#fff";
    videoBackgroundToggleView.style.left = (sw-50)+"px";
    videoBackgroundToggleView.style.top = (50)+"px";
    videoBackgroundToggleView.style.width = (50)+"px";
    videoBackgroundToggleView.style.height = (50)+"px";
    videoBackgroundToggleView.style.zIndex = "15";
    document.body.appendChild(videoBackgroundToggleView);

    videoBackgroundToggleView.onclick = function() {
        hasBackground = !hasBackground;
        if (hasBackground)
        videoBackgroundView.style.display = "initial";
        else
        videoBackgroundView.style.display = "none";
    };

    document.onfullscreenchange = function(e) {
        if (document.fullscreenElement) {
            videoBackgroundView.style.height = 
            (window.innerHeight)+"px";
        }
        else {
            videoBackgroundView.style.height = (sh)+"px";
        }
    };

    videoBackgroundView.onclick = function() {
        document.body.requestFullscreen();
    };

    loadImages();

    wordList = [];
    for (var n = 0; n <= 1000; n++) {
        wordList.push(n.toString());
    }

    load3D();
    animate();
});

var wordList = [];
var wordNo1 = 0;
var wordNo2 = 0;

var listInterval = false;
var startList = function() {
    var posList = [];
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            posList.push({
                x: x,
                y: y
            });
        }
    }

    wordNo1 = 0;
    wordNo2 = 0;
    listInterval = setInterval(function() {
        var filteredList = posList.filter((o) => {
            return residueArea1.x != o.x &&
            residueArea1.y != o.y
        });
        filteredList = filteredList.filter((o) => {
            return residueArea2.x != o.x &&
            residueArea2.y != o.y
        });
        var rnd = Math.floor(Math.random()*filteredList.length);
        var pos1 = filteredList[rnd];

        filteredList = filteredList.filter((o) => {
            return pos1.x != o.x &&
            pos1.y != o.y
        });
        var rnd = Math.floor(Math.random()*filteredList.length);
        var pos2 = filteredList[rnd];

        /*var filteredList = wordList.toSpliced(wordNo, 1);
        wordNo = wordList.indexOf(
        filteredList[
        Math.floor(Math.random()*filteredList.length)]);*/

        wordNo1 = Math.floor(Math.random()*100);
        wordNo2 = Math.floor(Math.random()*100);

        residueArea1.x = pos1.x;
        residueArea1.y = pos1.y

        residueArea2.x = pos2.x;
        residueArea2.y = pos2.y;
    }, 10000);
};

var stopList = function() {
    if (listInterval)
    clearInterval(listInterval);
};

var residueArea1 = {
    x: -1,
    y: -1
};

var residueArea2 = {
    x: -1,
    y: -1
};

var viewerCount = 0;

var sendText = function(text) {
    ws.send("PAPER|"+playerId+"|new-text|"+text);
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

var img_list = [
    "img/image-5.png",
    "img/image-105.png"
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

    var orientated = img_list[0].width > img_list[0].height;
    var format = {
        left: 
        orientated ? (img_list[0].width/2) - (img_list[0].height/2) : 0,
        top: 
        orientated ? 0 : (img_list[0].height/2) - (img_list[0].width/2),
        width: orientated ? img_list[0].height : img_list[0].width,
        height: orientated ? img_list[0].height : img_list[0].width
    };

    /*
    if (imagesLoaded)
    ctx.drawImage(img_list[1], 
    format.left, format.top, format.width, format.height,
    0, (sh/2)-(sw/2), (sw/4), (sw/4));*/

    var videoCtx = videoCanvas.getContext("2d");

    if (cameraOn)
    drawToSquare(videoCtx, camera, true);

    if (!cameraOn && imagesLoaded)
    drawToSquare(videoCtx, img_list[1]);

    if (updateWidth)
    lineWidth += 2;
};

var textObj = {
    value: "ABERTO",
    posX: -1,
    posY: -1
};

var textureMap = [
    { x: 1, y: 1, no: 0 },
    { x: 2, y: 1, no: 1 },
    { x: 1, y: 2, no: 2 },
    { x: 2, y: 2, no: 3 },
    { x: 1, y: 0, no: 4 },
    { x: 2, y: 0, no: 5 }
];

var drawToSquare = 
    function(ctx, image, camera=false, size=4) {
    ctx.lineWidth = 1;

    var canvas = squareCanvas;
    var squareCtx = canvas.getContext("2d");

    squareCtx.save();
    if (inFront && cameraOn) {
        squareCtx.scale(-1, 1);
        squareCtx.translate(-sw, 0);
    }

    var format;
    if (!camera) {
        format = fitImageCover(image, canvas);

        squareCtx.drawImage(image, 
        -format.left, -format.top, 
        (image.width/2), image.width, 
        format.left, format.top, 
        (format.width/2), format.height);

        squareCtx.drawImage(image, 
        -format.left + (image.width/2), -format.top, 
        (image.width/2), image.width, 
        format.left + (sw/2), format.top, 
        (format.width/2), format.height);
    }
    else {
        var video = {
            width: vw,
            height: vh
        }
        format = fitImageCover(video, canvas);

        if ((pause == 0 || pause == 2) && !(pause == 3))
        squareCtx.drawImage(image, 
        -format.left, -format.top, 
        (video.width/2), video.width, 
        format.left, 0, 
        (format.width/2), format.width);

        if ((pause == 0 || pause == 1) && !(pause == 3))
        squareCtx.drawImage(image, 
        -format.left + (video.width/2), -format.top, 
        (video.width/2), video.width, 
        format.left + (sw/2), 0, 
        (format.width/2), format.width);

        /*
        var video = {
            width: recordedVideo.videoWidth,
            height: recordedVideo.videoHeight
        }
        format = fitImageCover(video, canvas);

        if ((pause == 0 || pause == 1) && !(pause == 3))
        squareCtx.drawImage(recordedVideo, 
        -format.left + (video.height/2) - (video.height/4), 
        -format.top, 
        (video.height/2), video.height, 
        0, format.top, 
        (format.height/2), format.height);*/
    }

    squareCtx.restore();

    var circles = [];
    for (var n = 0; n < (size/2); n++) {
        var obj = {
            x: (sw/2),
            y: (sh/2),
            radius: (size/2)-(n+0.5),
            parts: []
        };
        circles.push(obj);
    };

    var offsetX = 0;
    var offsetY = 0; //mic.closed ? (sh/2)-(sw/2) : 0;

    var co = (size/2);
    var ca = (size/2);
    var max = Math.sqrt(
    Math.pow(co, 2)+
    Math.pow(ca, 2));

    var parts = [];
    for (var n = 0; n < (size*size); n++) {
        var x = (n%size);
        var y = Math.floor(n/size);

        var left = (x*(sw/size));
        var top = (y*(sw/size));

        var dirX = (x < (size/2) ? -1 : 1);
        var offX = ((size/2)-
        Math.abs((x - (size/2)) < 0 ? 
        (x - (size/2)) : 1+(x - (size/2))));
        dirX = dirX * offX;

        var dirY = (y < (size/2) ? -1 : 1);
        var offY = ((size/2)-
        Math.abs((y - (size/2)) < 0 ? 
        (y - (size/2)) : 1+(y - (size/2))));
        dirY = dirY * offY;

        var diffX = Math.abs((x - (size/2)) < 0 ? 
        (x - (size/2)) : 1+(x - (size/2)));
        var diffY = Math.abs((y - (size/2)) < 0 ? 
        (y - (size/2)) : 1+(y - (size/2)));

        var pcXY = (1/diffY)*diffX;
        var pcYX = (1/diffX)*diffY;

        /*pcXY = pcXY > 1 ? 1 : pcXY;
        pcYX = pcYX > 1 ? 1 : pcYX;*/

        var co = diffX-0.5;
        var ca = diffY-0.5;
        var hyp = Math.sqrt(
        Math.pow(co, 2)+
        Math.pow(ca, 2));

        var r = 1-((1/max)*hyp);

        var order = (offX + offY);
        var obj = {
             hyp: hyp,
             dirX: dirX,
             dirY: dirY,
             diffX: diffX,
             diffY: diffY,
             pcXY: pcXY,
             pcYX: pcYX,
             pos: { x: x, y: y },
             order: order,
             srcX: left,
             srcY: top,
             destX: offsetX + left + 
             (effect ? ((dirX*(lineWidth/2)) * (pcXY * r)) : 0),
             destY: offsetY + top + 
             (effect ? ((dirY*(lineWidth/2)) * (pcYX * r)) : 0)
        };
        parts.push(obj);
    }

    var ordered = parts.sort(function(a, b) {
        return a.order > b.order ? 1 : -1;
    });

    for (var n = 0; n < parts.length; n++) {
        var obj = parts[n];

        var lastDiff = Math.abs(obj.hyp - circles[0].radius);
        var cn = 0;
        for (var k = 0; k < circles.length; k++) {
            diff = Math.abs(obj.hyp - circles[k].radius);
            if (diff < lastDiff)
            cn = k;
            lastDiff = diff;
        }

        circles[cn].parts.push(obj);
    }

    for (var n = 0; n < circles.length; n++) {
        var obj = circles[n];

        var c = { x: 0, y: 0 };
        var p = { x: -1, y: 0 };
        var rp = _rotate2d(c, p, (n*(90/(size/2))));

        var radius = obj.radius + rp.y*(lineWidth/2);
        var diff = radius - obj.radius;
        obj.radius = radius;

        obj.diff = diff;

        for (var k = 0; k < obj.parts.length; k++) {
            var part = obj.parts[k];

            //part.destX += part.dirX * (diff);
            //part.destY += part.dirY * (diff);

            /*part.destX += ((part.dirX*(lineWidth/2)) * 
            (part.pcXY * r));
            part.destY += ((part.dirX*(lineWidth/2)) * 
            (part.pcXY * r));*/

            var defined = false;

            if (rotated)
            for (var w = 0; w < squareAngles.length; w++) {
            if (squareAngles[w].rotatedX == part.pos.x && 
            squareAngles[w].rotatedY == part.pos.y) {
                defined = true;
                ctx.save();
                ctx.translate(part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)));
                ctx.rotate(squareAngles[w].angle);
                ctx.drawImage(canvas, part.srcX, part.srcY, 
                (sw/size), (sw/size),
                -(sw/(size*2)), -(sw/(size*2)), (sw/size), (sw/size));
                ctx.restore();
            }
            }

            if (!rotated || !defined)
            ctx.drawImage(canvas, part.srcX, part.srcY, 
            (sw/size), (sw/size),
            part.destX, part.destY, (sw/size), (sw/size));

            ctx.strokeStyle = "#000";
            ctx.strokeRect(part.destX, part.destY, 
            (sw/size), (sw/size));

            if (part.pos.x == textObj.posX && 
                part.pos.y == textObj.posY) {
                ctx.fillStyle = "#fff";
                ctx.font = (sw/(size*4))+"px sans serif"; //(sw/(size*5));
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(textObj.value, part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)));
            }

            if (part.pos.x == residueArea1.x && 
                part.pos.y == residueArea1.y) {
                ctx.beginPath();
                ctx.fillStyle = "#000";
                ctx.font = 
                (sw/(size*3))+
                "px sans serif"; //(sw/(size*5));
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.arc(part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)), ((sw/size)/3),
                0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.fillText(wordNo1, 
                part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)));
            }

            if (part.pos.x == residueArea2.x && 
                part.pos.y == residueArea2.y) {
                ctx.beginPath();
                ctx.fillStyle = "#000";
                ctx.font = 
                (sw/(size*3))+
                "px sans serif"; //(sw/(size*5));
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.arc(part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)), ((sw/size)/3),
                0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.fillText(wordNo2, 
                part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)));
            }

            for (var w = 0; w < textureMap.length; w++) {
                if (part.pos.x == textureMap[w].x && 
                part.pos.y == textureMap[w].y) {
                    var textureCanvas = 
                    document.createElement("canvas");
                    textureCanvas.width = (sw/size);
                    textureCanvas.height = (sw/size);

                    var textureCtx = textureCanvas.getContext("2d");

                    textureCtx.drawImage(canvas, part.srcX, part.srcY, 
                (sw/size), (sw/size),
                    0, 0, (sw/size), (sw/size));

                    setTexture(w, textureCanvas.toDataURL());
                }
            }
        }

        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius*(sw/size), 0, Math.PI*2);
        //ctx.stroke();
    };
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