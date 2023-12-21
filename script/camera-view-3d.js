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
    recordedVideo.loop = true;
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
    buttonView.style.fontSize = "15px";
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
        [ 0, 3, 1, 2 ],
        [ 0, 4 ]
    ];

    pause = 0;
    buttonView.onclick = function() {
        setTimeout(function() {
            beepMilestone.play();

            thresholdReached = false;
            pauseNo = 
            (pauseNo+1) < pauseArr[pauseOrder].length ? 
            (pauseNo+1) : 0;
            pause = pauseArr[pauseOrder][pauseNo];

            if (pause == 0) 
            buttonView.innerText = "PAUSE";
            else if (pause == 1) 
            buttonView.innerText = "PAUSE <";
            else if (pause == 2) 
            buttonView.innerText = "PAUSE >";
            else if (pause == 3) 
            buttonView.innerText = "PAUSE ><";
            else if (pause == 4) 
            buttonView.innerText = "PAUSE 50%";
        }, (timerValue*1000));
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
        pauseOrder = 
        (pauseOrder+1) < pauseArr.length ? 
        (pauseOrder+1) : 0;
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
        //setTimeout(function() {
        //beepMilestone.play();
        threejsEnabled = !threejsEnabled;
        if (threejsEnabled) {
            createLightMap_preloaded();
            renderer.domElement.style.opacity = 
            recordingEnabled ? "0" : "initial";
            startAnimation();
        }
        else {
            pauseAnimation();
        }

        if (threejsEnabled)
        imageDepthPositionerView.style.display = "none";
        else
        imageDepthPositionerView.style.display = "initial";

        renderer.domElement.style.display = 
        threejsEnabled ? "initial" : "none";
        modes.style.display = 
        threejsEnabled ? "initial" : "none";
        eyeSep.style.display = 
        threejsEnabled ? "initial" : "none";
        //}, 5000);
    };

    micAvgValue = 0;
    micThreshold = 0.5;
    thresholdReached = false;

    recordingEnabled = false;

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        mic.audio.pause();
        if (!recordingEnabled) {
            mic.audio.srcObject = mic.audioStream.mediaStream;
            if (outputEnabled)
            mic.audio.play();
        }
        else {
            mic.record();
            startList();
        }
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
        //mic.audio.loop = true;
        //mic.audio.play();

        if (recordingEnabled)
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

    var micStartTime = 0;
    buttonMicView.ontouchstart = function() {
        micStartTime = new Date().getTime();
    };

    buttonMicView.ontouchend = function() {
         recordingEnabled = recordingEnabled ||
         (new Date().getTime() - micStartTime) > 2000;

        if (mic.closed) {
            startAvatarText();

            mic.open();
            buttonMicView.innerText = "mic: on";

            if (recordingEnabled)
            htmlRecorder.start();
        }
        else {
            stopAvatarText();

            mic.close();
            buttonMicView.innerText = "mic: off";

            if (recordingEnabled) {
                htmlRecorder.stop();
                htmlRecorder.save("filename.webm");
                recordingEnabled = false;
            }
        }
    };

    buttonOutputView = document.createElement("i");
    buttonOutputView.style.position = "absolute"; 
    buttonOutputView.style.background = "#fff";
    buttonOutputView.style.color = "#000";
    buttonOutputView.className = "fa-solid fa-volume-high";
    buttonOutputView.style.fontSize = "15px";
    buttonOutputView.style.lineHeight = "25px";
    buttonOutputView.style.left = (sw-135)+"px";
    buttonOutputView.style.top = (sh-110)+"px";
    buttonOutputView.style.width = (25)+"px";
    buttonOutputView.style.height = (25)+"px";
    buttonOutputView.style.border = "1px solid white";
    buttonOutputView.style.borderRadius = "25px";
    buttonOutputView.style.zIndex = "15";
    document.body.appendChild(buttonOutputView);

    outputEnabled = true;
    buttonOutputView.onclick = function() {
        outputEnabled = !outputEnabled;
        buttonOutputView.className = 
        outputEnabled ?
        "fa-solid fa-volume-high" : 
        "fa-solid fa-volume-xmark";
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

    remoteCanvas = document.createElement("canvas");
    remoteCanvas.width = (sw/4);
    remoteCanvas.height = (sw/4);

    var remoteCtx = remoteCanvas.getContext("2d");
    remoteCtx.fillStyle = "#000";
    //remoteCtx.fillRect(0, 0, sw, sw);

    receivedImageCount = 0;
    remoteImageRendered = true;
    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "new-text") {
            $("#title")[0].innerText = msg[3].replace("#", "\n");
            textView.innerText = msg[3].replace("#", "\n");
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "image-data") {
            receivedImageCount += 1;
            videoBackgroundTitleView.innerText = 
            "RECEIVED: "+receivedImageCount;
            if (!remoteImageRendered) return;

            var img = document.createElement("img");
            img.onload = function() {
                var remoteCtx = remoteCanvas.getContext("2d");
                remoteCtx.drawImage(img, 0, 0, (sw/4), (sw/4));
                remoteImageRendered = true;
            };
            img.src = msg[3];
        }
    };

    squareCanvas = document.createElement("canvas");
    squareCanvas.style.position = "absolute";
    squareCanvas.width = sw;
    squareCanvas.height = sw;
    squareCanvas.style.left = ((sw/2))+"px";
    squareCanvas.style.top = ((sh/2)-(sw/2)-(sw/4))+"px";
    squareCanvas.style.width = (sw/4)+"px";
    squareCanvas.style.height = (sw/4)+"px";
    squareCanvas.style.zIndex = "25";
    //document.body.appendChild(squareCanvas);

    squareZeroCanvas = document.createElement("canvas");
    squareZeroCanvas.style.position = "absolute";
    squareZeroCanvas.width = sw;
    squareZeroCanvas.height = sw;
    squareZeroCanvas.style.left = ((sw/2)-(sw/4))+"px";
    squareZeroCanvas.style.top = ((sh/2)-(sw/2)-(sw/4))+"px";
    squareZeroCanvas.style.width = (sw/4)+"px";
    squareZeroCanvas.style.height = (sw/4)+"px";
    squareZeroCanvas.style.zIndex = "25";
    //document.body.appendChild(squareZeroCanvas);

    var squareZeroCanvasCtx = 
    squareZeroCanvas.getContext("2d");

    squareZeroCanvasCtx.imageSmoothingEnabled = false;

    videoCanvas = document.createElement("canvas");
    videoCanvas.style.position = "absolute";
    videoCanvas.width = sw;
    videoCanvas.height = sw;
    videoCanvas.style.left = (0)+"px";
    videoCanvas.style.top = ((sh/2)-(sw/2))+"px";
    videoCanvas.style.width = (sw)+"px";
    videoCanvas.style.height = (sw)+"px";
    videoCanvas.style.zIndex = "25";
    document.body.appendChild(videoCanvas);

    gestureCanvas = document.createElement("canvas");
    gestureCanvas.style.position = "absolute";
    gestureCanvas.style.display = "none";
    gestureCanvas.width = sw;
    gestureCanvas.height = sw;
    gestureCanvas.style.left = (0)+"px";
    gestureCanvas.style.top = ((sh/2)-(sw/2))+"px";
    gestureCanvas.style.width = (sw)+"px";
    gestureCanvas.style.height = (sw)+"px";
    gestureCanvas.style.zIndex = "25";
    document.body.appendChild(gestureCanvas);

    buttonRecordGestureView = 
    document.createElement("button");
    buttonRecordGestureView.style.position = "absolute";
    buttonRecordGestureView.style.color = "#000";
    buttonRecordGestureView.innerText = "OFF";
    buttonRecordGestureView.style.fontFamily = "Khand";
    buttonRecordGestureView.style.fontSize = "15px";
    buttonRecordGestureView.style.left = ((sw/2)-110)+"px";
    buttonRecordGestureView.style.top = 
    ((sh/2)-(sw/2)-105)+"px";
    buttonRecordGestureView.style.width = (50)+"px";
    buttonRecordGestureView.style.height = (25)+"px";
    buttonRecordGestureView.style.border = "1px solid white";
    buttonRecordGestureView.style.borderRadius = "25px";
    buttonRecordGestureView.style.zIndex = "15";
    document.body.appendChild(buttonRecordGestureView);

    gestureRecordingTime = 0;
    gestureData = [];

    recordingGesture = false;
    buttonRecordGestureView.onclick = function() {
        recordingGesture = !recordingGesture;

        if (recordingGesture) {
            recordedVideo.src = null;
            gestureCanvas.style.display = "initial";
            buttonRecordGestureView.innerText = "REC";

            var gestureCtx = gestureCanvas.getContext("2d");
            gestureCtx.clearRect(0, 0, sw, sw);

            gestureRecordingTime = new Date().getTime();
            playingGesture = false;
            gestureData = [];
            var obj = { 
                type: "start",
                x: startX, 
                y: startY, 
                time: new Date().getTime() - gestureRecordingTime 
            };
            gestureData.push(obj);
        }
        else {
            gestureCanvas.style.display = "none";
            buttonRecordGestureView.innerText = "OFF";

            var gestureCtx = gestureCanvas.getContext("2d");
            gestureCtx.clearRect(0, 0, sw, sw);

            gesturePlayingTime = 0;
            gestureNo = 0; //-1;
            gestureLastTime = new Date().getTime();
            playingGesture = true;
        }
    };

    var startX = 0;
    var startY = 0;

    gestureCanvas.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY-((sh/2)-(sw/2));

        var ctx = gestureCanvas.getContext("2d");

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        var obj = { 
            type: "pointerdown",
            x: startX, 
            y: startY, 
            time: new Date().getTime() - gestureRecordingTime 
        };
        gestureData.push(obj);
    };
    gestureCanvas.ontouchmove = function(e) {
        var moveX = e.touches[0].clientX;
        var moveY = e.touches[0].clientY-((sh/2)-(sw/2));

        var ctx = gestureCanvas.getContext("2d");
        ctx.lineTo(moveX, moveY);
        ctx.stroke();

        var obj = { 
            type: "pointermove",
            x: moveX, 
            y: moveY, 
            time: new Date().getTime() - gestureRecordingTime 
        };
        gestureData.push(obj);
    };

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

    imageDepthPositionerView = document.createElement("img");
    imageDepthPositionerView.style.position = "absolute";
    imageDepthPositionerView.style.display = "none";
    imageDepthPositionerView.width = sw;
    imageDepthPositionerView.height = sw;
    imageDepthPositionerView.style.left = (0)+"px";
    imageDepthPositionerView.style.top = ((sh/2)-(sw/2))+"px";
    imageDepthPositionerView.style.width = (sw)+"px";
    imageDepthPositionerView.style.height = (sw)+"px";
    imageDepthPositionerView.style.zIndex = "25";
    document.body.appendChild(imageDepthPositionerView);

    var rnd = Math.random();
    imageDepthPositionerView.src = "img/image_depth_positioner.png?rnd="+rnd;

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

        boardAngleView.innerText = angle+"°";
    };

    buttonGridView = document.createElement("button");
    buttonGridView.style.position = "absolute";
    buttonGridView.style.color = "#000";
    buttonGridView.innerText = "GRID: ON";
    buttonGridView.style.fontFamily = "Khand";
    buttonGridView.style.fontSize = "15px";
    buttonGridView.style.left = ((sw/2)-50)+"px";
    buttonGridView.style.top = ((sh/2)-(sw/2)-105)+"px";
    buttonGridView.style.width = (100)+"px";
    buttonGridView.style.height = (25)+"px";
    buttonGridView.style.border = "1px solid white";
    buttonGridView.style.borderRadius = "25px";
    buttonGridView.style.zIndex = "15";
    document.body.appendChild(buttonGridView);

    gridEnabled = true;
    buttonGridView.onclick = function() {
        gridEnabled = !gridEnabled;
        buttonGridView.innerText = gridEnabled ? 
        "GRID: ON" : "GRID: OFF";
    };

    auto3D = false;
    buttonAutoNavigateView = 
    document.createElement("button");
    buttonAutoNavigateView.style.position = "absolute";
    buttonAutoNavigateView.style.color = "#000";
    buttonAutoNavigateView.innerText = "FREE 3D";
    buttonAutoNavigateView.style.fontFamily = "Khand";
    buttonAutoNavigateView.style.fontSize = "15px";
    buttonAutoNavigateView.style.left = ((sw/2)-50)+"px";
    buttonAutoNavigateView.style.top = ((sh/2)-(sw/2)-70)+"px";
    buttonAutoNavigateView.style.width = (100)+"px";
    buttonAutoNavigateView.style.height = (25)+"px";
    buttonAutoNavigateView.style.border = "1px solid white";
    buttonAutoNavigateView.style.borderRadius = "25px";
    buttonAutoNavigateView.style.zIndex = "15";
    document.body.appendChild(buttonAutoNavigateView);

    buttonAutoNavigateView.onclick = function() {
        auto3D = !auto3D;
        if (auto3D)
        imageDepthPositionerView.style.display = "initial";
        else
        imageDepthPositionerView.style.display = "none";

        buttonAutoNavigateView.innerText = auto3D ?
        "AUTO 3D" : "FREE 3D";
    };

    var timerValue = 0;
    buttonTimerConfigView = document.createElement("button");
    buttonTimerConfigView.style.position = "absolute";
    buttonTimerConfigView.style.color = "#000";
    buttonTimerConfigView.innerText = timerValue + " s";
    buttonTimerConfigView.style.fontFamily = "Khand";
    buttonTimerConfigView.style.fontSize = "15px";
    buttonTimerConfigView.style.left = ((sw/2)-110)+"px";
    buttonTimerConfigView.style.top = ((sh/2)-(sw/2)-35)+"px";
    buttonTimerConfigView.style.width = (50)+"px";
    buttonTimerConfigView.style.height = (25)+"px";
    buttonTimerConfigView.style.border = "1px solid white";
    buttonTimerConfigView.style.borderRadius = "25px";
    buttonTimerConfigView.style.zIndex = "15";
    document.body.appendChild(buttonTimerConfigView);

    buttonTimerConfigView.onclick = function() {
        timerValue = (timerValue+5) < 20 ? (timerValue+5) : 0;
        buttonTimerConfigView.innerText = timerValue + " s";
    };

    buttonGrayscaleView = document.createElement("button");
    buttonGrayscaleView.style.position = "absolute";
    buttonGrayscaleView.style.color = "#000";
    buttonGrayscaleView.innerText = "OFF";
    buttonGrayscaleView.style.fontFamily = "Khand";
    buttonGrayscaleView.style.fontSize = "15px";
    buttonGrayscaleView.style.left = ((sw/2)-110)+"px";
    buttonGrayscaleView.style.top = ((sh/2)-(sw/2)-70)+"px";
    buttonGrayscaleView.style.width = (50)+"px";
    buttonGrayscaleView.style.height = (25)+"px";
    buttonGrayscaleView.style.border = "1px solid white";
    buttonGrayscaleView.style.borderRadius = "25px";
    buttonGrayscaleView.style.zIndex = "15";
    document.body.appendChild(buttonGrayscaleView);

    buttonGrayscaleView.onclick = function() {
        grayscaleEnabled = !grayscaleEnabled;

        if (grayscaleEnabled) {
            buttonGrayscaleView.innerText = 
            "ON: "+(grayscaleNo);
        }
        else {
            buttonGrayscaleView.innerText = "OFF";
        }
    };

    buttonClearPoseView = document.createElement("button");
    buttonClearPoseView.style.position = "absolute";
    buttonClearPoseView.style.color = "#000";
    buttonClearPoseView.innerText = "CLEAR POSE";
    buttonClearPoseView.style.fontFamily = "Khand";
    buttonClearPoseView.style.fontSize = "15px";
    buttonClearPoseView.style.left = ((sw/2)-50)+"px";
    buttonClearPoseView.style.top = ((sh/2)-(sw/2)-35)+"px";
    buttonClearPoseView.style.width = (100)+"px";
    buttonClearPoseView.style.height = (25)+"px";
    buttonClearPoseView.style.border = "1px solid white";
    buttonClearPoseView.style.borderRadius = "25px";
    buttonClearPoseView.style.zIndex = "15";
    document.body.appendChild(buttonClearPoseView);

    buttonClearPoseView.onclick = function() {
        var squareZeroCtx = squareZeroCanvas.getContext("2d");
        squareZeroCtx.clearRect(0, 0, sw, sw);
        storedPosition = false;

        var gestureCtx = gestureCanvas.getContext("2d");
        gestureCtx.clearRect(0, 0, sw, sw);

        if (recordingGesture) {
            var obj = { 
                type: "clear",
                x: (sw/2), 
                y: (sw/2), 
                time: new Date().getTime() - gestureRecordingTime 
            };
            gestureData.push(obj);
        }
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

    buttonDownloadView = document.createElement("button");
    buttonDownloadView.style.position = "absolute";
    buttonDownloadView.style.color = "#000";
    buttonDownloadView.innerText = "DOWNLOAD";
    buttonDownloadView.style.fontFamily = "Khand";
    buttonDownloadView.style.fontSize = "15px";
    buttonDownloadView.style.left = (120)+"px";
    buttonDownloadView.style.top = (sh-50)+"px";
    buttonDownloadView.style.width = (100)+"px";
    buttonDownloadView.style.height = (25)+"px";
    buttonDownloadView.style.border = "1px solid white";
    buttonDownloadView.style.borderRadius = "25px";
    buttonDownloadView.style.zIndex = "15";
    document.body.appendChild(buttonDownloadView);

    buttonDownloadView.onclick = function() {
        const name = 'download.png';
        const url = videoCanvas.toDataURL();
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    buttonDeviceView = document.createElement("button");
    buttonDeviceView.style.position = "absolute";
    buttonDeviceView.style.color = "#000";
    buttonDeviceView.innerText = "dvc: "+deviceNo;
    buttonDeviceView.style.fontFamily = "Khand";
    buttonDeviceView.style.fontSize = "15px";
    buttonDeviceView.style.left = (230)+"px";
    buttonDeviceView.style.top = (sh-50)+"px";
    buttonDeviceView.style.width = (50)+"px";
    buttonDeviceView.style.height = (25)+"px";
    buttonDeviceView.style.border = "1px solid white";
    buttonDeviceView.style.borderRadius = "25px";
    buttonDeviceView.style.zIndex = "15";
    document.body.appendChild(buttonDeviceView);

    buttonDeviceView.onclick = function() {
        deviceNo = (deviceNo+1) < videoDevices.length ? 
        (deviceNo+1) : 0;
        buttonDeviceView.innerText = "dvc: "+deviceNo;
    };

    buttonPowerView = document.createElement("button");
    buttonPowerView.style.position = "absolute";
    buttonPowerView.style.color = "#000";
    buttonPowerView.innerText = "OFF";
    buttonPowerView.style.fontFamily = "Khand";
    buttonPowerView.style.fontSize = "15px";
    buttonPowerView.style.left = (sw-60)+"px";
    buttonPowerView.style.top = (sh-50)+"px";
    buttonPowerView.style.width = (50)+"px";
    buttonPowerView.style.height = (25)+"px";
    buttonPowerView.style.border = "1px solid white";
    buttonPowerView.style.borderRadius = "25px";
    buttonPowerView.style.zIndex = "15";
    document.body.appendChild(buttonPowerView);

    deviceNo = 0;
    buttonPowerView.onclick = function() {
        if (cameraOn) {
            buttonPowerView.innerText = "OFF";
            stopCamera();
        }
        else {
            buttonPowerView.innerText = "ON";
            startCamera();
        }
    };

    avatarTextView = document.createElement("span");
    avatarTextView.style.position = "absolute";
    avatarTextView.style.display = "none";
    avatarTextView.style.background = "#fff";
    avatarTextView.style.color = "#000";
    avatarTextView.style.textAlign = "left";
    avatarTextView.innerText = "";
    avatarTextView.style.fontSize = "15px";
    avatarTextView.style.left = ((sw/4)+20)+"px";
    avatarTextView.style.top = 
    ((sh/2)-(sw/2)+((sw/4)*3)+20)+"px";
    avatarTextView.style.width = (((sw/4)*3)-40)+"px";
    avatarTextView.style.height = ((sw/4)-40)+"px";
    //avatarTextView.style.border = "1px solid white";
    avatarTextView.style.zIndex = "25";
    //document.body.appendChild(avatarTextView);

    buttonBackgroundView = document.createElement("button");
    buttonBackgroundView.style.position = "absolute";
    buttonBackgroundView.style.color = "#000";
    buttonBackgroundView.innerText = "BG";
    buttonBackgroundView.style.fontFamily = "Khand";
    buttonBackgroundView.style.fontSize = "15px";
    buttonBackgroundView.style.left = ((sw/2)+60)+"px";
    buttonBackgroundView.style.top = ((sh/2)-(sw/2)-35)+"px";
    buttonBackgroundView.style.width = (25)+"px";
    buttonBackgroundView.style.height = (25)+"px";
    buttonBackgroundView.style.border = "1px solid white";
    buttonBackgroundView.style.borderRadius = "25px";
    buttonBackgroundView.style.zIndex = "15";
    document.body.appendChild(buttonBackgroundView);

    backgroundStored = false;
    buttonBackgroundView.onclick = function() {
        var squareZeroCtx = squareZeroCanvas.getContext("2d");

        backgroundStored = !backgroundStored;
        if (backgroundStored) {
            squareZeroCtx.drawImage(videoCanvas, 0, 0, 
            sw, sw);
            buttonBackgroundView.style.background = 
            "lightblue";
        }
        else {
            squareZeroCtx.clearRect(0, 0, sw, sw);
            buttonBackgroundView.style.background = 
            "";
        }
    };

    img_list.push(drawGradient());

    loadImageDepth_array();
    loadImages();

    wordList = [];
    for (var n = 0; n <= 1000; n++) {
        wordList.push(n.toString());
    }

    load3D();
    animate();
});

var avatarEnabled = false;
var avatarNo = 0;
var avatarText = "";
var textList = [
    { avatar: 0, text: "SÃO DOIS BALŌEZINHOS SÓ..." },
    { avatar: 0, text: "O PRIMEIRO BALÃOZINHO PRECISA SER MEDIDO DUAS VEZES PARA SOBRAR ESPAÇO." },
    { avatar: 2, text: "EMPREGAMOS ELA." },
];

var avatarTextInterval = false;
var startAvatarText = function() {
    if (!avatarEnabled) return;
    avatarTextView.style.display = "initial";

    var currentText = 0;
    var currentChar = 0;
    var text = "";
    avatarTextInterval = setInterval(function() {
        if (currentChar > (textList[currentText].text.length-1)) {
            currentText = (currentText+1) < textList.length ? 
            (currentText+1) : 0;
            currentChar = 0;
            avatarNo = textList[currentText].avatar;
        }
        text = "";
        for (var n = 0; n < (currentChar+1); n++) {
            text += textList[currentText].text[n];
        }
        avatarText = text;
        avatarTextView.innerText = text;
        currentChar += 1;
    }, (1000/5));
};

var stopAvatarText = function() {
    avatarTextView.style.display = "none";

    if (avatarTextInterval)
    clearInterval(avatarTextInterval);
    avatarTextView.innerText = "";
};

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
    }, 15000);
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

var sendImage = function(dataURL) {
    ws.send("PAPER|"+playerId+"|image-data|"+dataURL);
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
    "img/image-105.png",
    "img/avatar-state-0.png",
    "img/avatar-state-1.png",
    "img/avatar-1_state-0.png",
    "img/avatar-1_state-1.png",
    "img/avatar-2_state-0.png",
    "img/avatar-2_state-1.png",
    "img/background-store/video-background-0.png",
    "img/bubble-0.png"
];

var imagesLoaded = false;
var loadImages = function(callback) {
    var count = 0;
    for (var n = 0; n < img_list.length; n++) {
        var img = document.createElement("img");
        img.n = n;
        img.onload = function() {
            count += 1;
            console.log("loading ("+count+"/"+img_list.length+")");
            img_list[this.n] = this;
            if (count == img_list.length) {
                imagesLoaded = true;
                callback();
            }
        };
        var rnd = Math.random();
        img.src = img_list[n].includes("img") ? 
        img_list[n]+"?f="+rnd : 
        img_list[n];
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

var drawGradient = function() {
    var canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sw;

    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";

    ctx.fillStyle = "#050"
    ctx.fillRect(0, 0, sw, sw);

    return canvas.toDataURL();
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
    drawToSquare(videoCtx, img_list[10]);

    if (threejsEnabled && recordingEnabled) {
        videoCtx.drawImage(renderer.domElement, 0, 0, sw, sw);
    }

    if (playingGesture) {
        var gestureCtx = gestureCanvas.getContext("2d");

        var gestureArr = currentGesture();
        if (gestureArr.length > 0) {
            var gesture = gestureArr[0];
            if (gesture.type == "pointerdown") {
                gestureCtx.beginPath();
                gestureCtx.moveTo(gesture.x, gesture.y);
            }
            else if (gesture.type == "pointermove") {
                gestureCtx.lineTo(gesture.x, gesture.y);
                gestureCtx.stroke();
            }
            else if (gesture.type == "clear") {
                gestureCtx.clearRect(0, 0, sw, sw);
            }
        }

        videoCtx.filter = "blur(2px)";
        videoCtx.drawImage(gestureCanvas, 0, 0, sw, sw);
        videoCtx.filter = "none";

        if (gestureNo == (gestureData.length-1)) {
            gestureCtx.clearRect(0, 0, sw, sw);
            gesturePlayingTime = 0;
            gestureNo = 0;
        }
    }

    if (!mic.closed)
    drawAB_rounded(resumedWave);

    if (!cameraOn && backgroundStored)
    videoCtx.drawImage(squareZeroCanvas, 0, 0, sw, sw);
    else if (backgroundStored)
    drawOutline();

    if (updateWidth)
    lineWidth += 2;
};

var drawAB_rounded = 
function(freqArray=false, avgValue=0) {
    var canvas = videoCanvas;
    var ctx = canvas.getContext("2d");

    var offset = 0;
    var polygon = [];

    // create waveform A
    if (freqArray) 
    for (var n = 0; n < freqArray.length; n++) {
        var c = { 
            x: (sw/2),
            y: (sw/2)
        };
        var p0 = { 
            x: (sw/2),
            y: (sw/2)-(sw/4)
        };
        var p1 = { 
            x: (sw/2),
            y: (sw/2)-(sw/4)-(freqArray[n]*25)
        };

        var rp0 = _rotate2d(c, p0, -(n*(360/freqArray.length)));
        var rp1 = _rotate2d(c, p1, -(n*(360/freqArray.length)));

        var obj = {
            x0: rp0.x,
            y0: rp0.y,
            x1: rp1.x,
            y1: rp1.y,
            value: freqArray[n]
        };
        polygon.push(obj);

        //updatePhiSegmentState(n, freqArray);
    }

    // draw waveform A
    ctx.lineWidth = 3;

    if (freqArray) {
        ctx.beginPath();
        ctx.moveTo(polygon[0].x1, polygon[0].y1);
    }
    if (freqArray)
    for (var n = 1; n < polygon.length; n++) {
        ctx.strokeStyle = 
        getColor((1/(polygon.length-1))*n, true, 
        (1-polygon[n].value));

        ctx.beginPath();
        ctx.moveTo(polygon[n-1].x1, polygon[n-1].y1);
        ctx.lineTo(polygon[n].x1, polygon[n].y1);
        ctx.stroke();
    }

    ctx.strokeStyle = 
    getColor(1, true, (1-polygon[0].value));

    ctx.beginPath();
    ctx.moveTo(
        polygon[polygon.length-1].x1, 
        polygon[polygon.length-1].y1);
    ctx.lineTo(polygon[0].x1, polygon[0].y1);
    ctx.stroke();
};

var playingGesture = false;
var gestureLastTime = 0;
var gesturePlayingTime = 0;
var gestureNo = 0;
var currentGesture = function() {
    gesturePlayingTime += 
    new Date().getTime() - gestureLastTime;

    var gestureArr = [];
    //var n = gestureNo;

    for (var n = 0; n < gestureData.length; n++) { 
        if (n > gestureNo && 
            gesturePlayingTime > gestureData[n].time) {
            gestureNo = n;
            gestureArr.push(gestureData[n]);
            break;
        }
    }

    gestureLastTime = new Date().getTime();
    return gestureArr;
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

var applyCurve = function(value) {
     var c = { x: 0, y: 0 };
     var p = { x: 0, y: 1 };
     var rp = _rotate2d(c, p, -(value*90));
     return rp.y;
};

var storedPosition = false;

var drawToSquare = 
    function(ctx, image, camera=false, size=4) {
    ctx.lineWidth = 1;

    var canvas = squareCanvas;
    var squareCtx = canvas.getContext("2d");
    var squareZeroCtx = squareZeroCanvas.getContext("2d");

    if (pause == 0 || pause == 4)
    squareCtx.clearRect(0, 0, sw, sw);

    ctx.clearRect(0, 0, sw, sw);

    squareCtx.save();
    squareZeroCtx.save();
    if (inFront && cameraOn) {
        squareCtx.scale(-1, 1);
        squareCtx.translate(-sw, 0);

        squareZeroCtx.scale(-1, 1);
        squareZeroCtx.translate(-sw, 0);
    }

    if (!rotated) {
        squareCtx.translate((sw/2), (sw/2));
        squareCtx.rotate(boardAngle);
        squareCtx.translate(-(sw/2), -(sw/2));

        squareZeroCtx.translate((sw/2), (sw/2));
        squareZeroCtx.rotate(boardAngle);
        squareZeroCtx.translate(-(sw/2), -(sw/2));
    }

    var format;
    if (!camera) {
        format = fitImageCover(image, canvas);

        if (image.width > image.height) {
            format = {
                left: ((image.width/2)-(image.height/2)),
                top: 0,
                width: image.height,
                height: image.height
            };

            squareCtx.drawImage(image, 
            format.left, format.top, 
            (format.width/2), format.width, 
            0, 0, (sw/2), sw);
    
            squareCtx.drawImage(image, 
            format.left + (format.width/2), format.top, 
            (format.width/2), format.width, 
            (sw/2), 0, (sw/2), sw);
        }
        else {
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
    }
    else {
        squareCtx.globalAlpha = pause == 4 ? 0.5 : 1;
        squareZeroCtx.globalAlpha = pause == 4 ? 0.5 : 1;

        var video = {
            width: vw,
            height: vh
        }
        format = fitImageCover(video, canvas);
        if (vw > vh) {
            format = {
                left: ((vw/2)-(vh/2)),
                top: 0,
                width: vh,
                height: vh
            };
            var temp = video.width;
            video.width = video.height;
            video.height = temp;

            if ((pause == 0 || pause == 2 || pause == 4))
            squareCtx.drawImage(image, 
            format.left, format.top, 
            (video.width/2), video.width, 
            0, 0, (sw/2), sw);

            if ((pause == 0 || pause == 1 || pause == 4))
            squareCtx.drawImage(image, 
            format.left + (video.width/2), format.top, 
            (video.width/2), video.width, 
            (sw/2), 0, (sw/2), sw);

            if (pause == 4) {
                squareZeroCtx.clearRect(0, 0, sw, sw);
                squareZeroCtx.drawImage(image, 
                format.left, format.top, 
                video.width, video.width, 
                0, 0, sw, sw);
            }

            if (pause == 0) {
                squareCtx.restore();
                squareZeroCtx.restore();
                squareCtx.drawImage(squareZeroCanvas, 
                0, 0, sw, sw);
            }

            if (pause == 4) pause = 3;
        }
        else {
            if ((pause == 0 || pause == 2 || pause == 4))
            squareCtx.drawImage(image, 
            -format.left, -format.top, 
            (video.width/2), video.width, 
            format.left, 0, 
            (format.width/2), format.width);

            if ((pause == 0 || pause == 1 || pause == 4))
            squareCtx.drawImage(image, 
            -format.left + (video.width/2), -format.top, 
            (video.width/2), video.width, 
            format.left + (sw/2), 0, 
            (format.width/2), format.width);

            if (pause == 4) {
                squareZeroCtx.clearRect(0, 0, sw, sw);
                squareZeroCtx.drawImage(image, 
                -format.left, -format.top, 
                video.width, video.width, 
                0, 0, sw, sw);
                storedPosition = true;
            }

            if (pause == 0 && storedPosition) {
                squareCtx.restore();
                squareZeroCtx.restore();
                squareCtx.drawImage(squareZeroCanvas, 
                0, 0, sw, sw);
            }

            if (pause == 4) pause = 3;
        }
    }

    squareCtx.restore();
    squareZeroCtx.restore();

    var format = fitImageCover(
    img_list[8], squareZeroCanvas);

    if (!backgroundStored) {
        squareZeroCtx.clearRect(0, 0, sw, sw);
        squareZeroCtx.drawImage(img_list[8], 
        format.left, format.top, 
        format.width, format.width);
    }

    var previousImgData = 
    squareZeroCtx.getImageData(0, 0, 
    squareZeroCanvas.width, squareZeroCanvas.height);
    var previousData = previousImgData.data;

    var format = fitImageCover(
    img_list[9], squareCanvas);

    /*
    if (cameraOn && pause == 0)
    squareCtx.drawImage(img_list[9], 
    format.left, format.top, 
    format.width, format.width);*/

    /*
    if (grayscaleEnabled)
    grayscaleCanvas2(squareCanvas);*/
    //updateCanvas(squareCanvas, previousData);
    //lowHeightCanvas(squareCanvas);
    //grayscaleCanvas(squareCanvas); 

    sendImage(squareCanvas.toDataURL());

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

            if ((!rotated || !defined))
            ctx.drawImage(canvas, part.srcX, part.srcY, 
            (sw/size), (sw/size),
            part.destX, part.destY, (sw/size), (sw/size));

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
                (sw/(size*4))+
                "px sans serif"; //(sw/(size*5));
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.arc(part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)), ((sw/size)/3),
                0, Math.PI*2);
                ctx.rect(part.destX, 
                part.destY, (sw/size), (sw/size));
                /*ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.fillText("START", 
                part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)));*/
            }

            if (part.pos.x == residueArea2.x && 
                part.pos.y == residueArea2.y) {
                ctx.beginPath();
                ctx.fillStyle = "#000";
                ctx.font = 
                (sw/(size*4))+
                "px sans serif"; //(sw/(size*5));
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.arc(part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)), ((sw/size)/3),
                0, Math.PI*2);
                ctx.rect(part.destX, 
                part.destY, (sw/size), (sw/size));
                /*ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.fillText("FINISH", 
                part.destX+(sw/(size*2)), 
                part.destY+(sw/(size*2)));*/
            }

            if (!rotated)
            for (var w = 0; w < squareAngles.length; w++) {
            if (squareAngles[w].rotatedX == part.pos.x && 
            squareAngles[w].rotatedY == part.pos.y &&
            squareAngles[w].angle != 0) {
                 ctx.drawImage(canvas, part.srcX, part.srcY, 
                 (sw/size), (sw/size),
                 part.destX, part.destY, (sw/size), (sw/size));
            }
            }

            if (avatarEnabled && 
                !mic.closed && 
                ((avatarNo == 0 && 
                part.pos.x == 0 && part.pos.y == 3) ||
                (avatarNo == 2 && 
                part.pos.x == 3 && part.pos.y == 3))) {
                var image = micAvgValue <= 0.3 ? 
                img_list[2+(avatarNo*2)] : img_list[3+(avatarNo*2)];
                ctx.drawImage(image, part.destX, part.destY, 
                (sw/size), (sw/size));
            }

            if (gridEnabled) {
                ctx.strokeStyle = "#000";
                ctx.strokeRect(part.destX, part.destY, 
                (sw/size), (sw/size));
            }
        }

        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius*(sw/size), 0, Math.PI*2);
        //ctx.stroke();
    };

    if (avatarEnabled && !mic.closed) {
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;

        ctx.save();
        if (avatarNo == 2) {
            ctx.scale(-1, 1);
            ctx.translate(-sw, 0);
        }

        ctx.beginPath();
        ctx.roundRect((sw/size)+10, ((sw/size)*3)+10, 
        ((sw/size)*3)-20, (sw/size)-20, 15);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((sw/size), ((sw/size)*3)+25);
        ctx.lineTo((sw/size)+25, ((sw/size)*3)+10);
        ctx.lineTo((sw/size)+25, ((sw/size)*3)+25);
        ctx.lineTo((sw/size), ((sw/size)*3)+25);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo((sw/size), ((sw/size)*3)+25);
        ctx.lineTo((sw/size)+15, ((sw/size)*3)+14);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((sw/size), ((sw/size)*3)+25);
        ctx.lineTo((sw/size)+10, ((sw/size)*3)+25);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = "#000";
        ctx.font = "15px VT323";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        var avatarTextArr = avatarText.split(" ");
        var avatarTextLines = [];

        var text = "";
        for (var n = 0; n < avatarTextArr.length; n++) {
            text += avatarTextArr[n] + " ";
            if (text.length > 30 || n == (avatarTextArr.length-1)) {
                text = text.trim();
                avatarTextLines.push(text);
                text = "";
            };
        }

        for (var n = 0; n < avatarTextLines.length; n++) {
            ctx.fillText(avatarTextLines[n], 
            (avatarNo == 0 ? (sw/size) : 0) +20, ((sw/size)*3)+30+(n*20));
        }
    }

    if (grayscaleEnabled)
    updateCanvas(videoCanvas, squareCanvas, previousData);

    var imgData = 
    ctx.getImageData(0, 0, 
    videoCanvas.width, videoCanvas.height);
    var data = imgData.data;

    var x0 = (sw/4);
    var y0 = (sw/4)*3;
    var x1 = (sw/4);
    var y1 = (sw/4);
    var x2 = (sw/4)*3;
    var y2 = (sw/4);
    var x3 = (sw/4)*3;
    var y3 = (sw/4)*3;

    var n0 = ((y0*sw)+x0)*4;
    var n1 = ((y1*sw)+x1)*4;
    var n2 = ((y2*sw)+x2)*4;
    var n3 = ((y3*sw)+x3)*4;

    var rgb0 = [ data[n0], data[n0+1], data[n0+2] ];
    var rgb1 = [ data[n1], data[n1+1], data[n1+2] ];
    var rgb2 = [ data[n2], data[n2+1], data[n2+2] ];
    var rgb3 = [ data[n3], data[n3+1], data[n3+2] ];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo((sw/4)*2, 0);
    ctx.lineTo((sw/4)*2, (sw/4));
    ctx.lineTo((sw/4), (sw/4));
    ctx.lineTo((sw/4), (sw/4)*3);
    ctx.lineTo((sw/4)*3, (sw/4)*3);
    ctx.lineTo((sw/4)*3, (sw/4));
    ctx.lineTo((sw/4)*2, (sw/4));
    ctx.lineTo((sw/4)*2, 0);
    ctx.lineTo((sw), 0);
    ctx.lineTo((sw), (sw));
    ctx.lineTo(0, (sw));
    ctx.clip();

    var rgb = "rgb("+
    ((rgb0[0]+rgb1[0]+rgb2[0]+rgb3[0])/4)+","+
    ((rgb0[1]+rgb1[1]+rgb2[1]+rgb3[1])/4)+","+
    ((rgb0[2]+rgb1[2]+rgb2[2]+rgb3[2])/4)+")";

    ctx.fillStyle = rgb;
    ctx.filter = "blur(25px)";
    if (effect)
    ctx.drawImage(videoCanvas, 0, 0, sw, sw);
    ctx.restore();
};

var updateCanvas = 
    function(canvas, srcCanvas, previousData) {
    var ctx = srcCanvas.getContext("2d");

    var imgData = 
    ctx.getImageData(0, 0, 
    canvas.width, canvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var i = 0; i < data.length; i += 4) {
        if (previousData[i] == 255 && 
            previousData[i + 1] == 0 && 
            previousData[i + 2] == 255) {
            newImageArray[i] = data[i];
            newImageArray[i + 1] = data[i + 1];
            newImageArray[i + 2] = data[i + 2];
        }
        else {
            newImageArray[i] = previousData[i];
            newImageArray[i + 1] = previousData[i + 1];
            newImageArray[i + 2] = previousData[i + 2];
        }
    }

    var ctx = canvas.getContext("2d")
    var newImageData = new ImageData(newImageArray, canvas.width, canvas.width);
    ctx.putImageData(newImageData, 0, 0);
};

var removeBackground = function(canvas) {
    var ctx = canvas.getContext("2d");

    var imgData = 
    ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var i = 0; i < data.length; i += 4) {
        if (data[i] < 100 && 
             data[i + 1] < 100 && 
             data[i + 2] < 100) {
             newImageArray[i + 3] = 0;
        }
    }
    var newImageData = new ImageData(newImageArray, canvas.width, canvas.width);
    ctx.putImageData(newImageData, 0, 0);
};

var grayscaleEnabled = false;
var grayscaleNo = 0;
var grayscaleRatio = [
    [ 0.33, 0.33, 0.33 ], // Normal balance
    [ 0.4, 0.3, 0.4 ] // Color affective
];

var grayscaleCanvas = function(canvas) {
    var ctx = canvas.getContext("2d");

    var imgData = 
    ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var i = 0; i < data.length; i += 4) {
        var brightness = 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));

        newImageArray[i] = brightness;
        newImageArray[i + 1] = brightness;
        newImageArray[i + 2] = brightness;
    }
    var newImageData = new ImageData(newImageArray, canvas.width, canvas.width);
    ctx.putImageData(newImageData, 0, 0);
};

var applyCurve2 = function(value) {
     var c = { x: 0, y: 0 };
     var p = { x: -1, y: 0 };
     var rp = _rotate2d(c, p, -(value*90));
     rp.y = rp.y *2;
     rp.y = rp.y < -1 ? -1 : rp.y;
     return -rp.y;
};

var grayscaleCanvas2 = function(canvas) {
    var ctx = canvas.getContext("2d");

    var imgData = 
    ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var i = 0; i < data.length; i += 4) {
        var brightness = 
        (((1/255)*(data[i] * grayscaleRatio[grayscaleNo][0])) + 
        ((1/255)*(data[i + 1] * grayscaleRatio[grayscaleNo][1])) + 
        ((1/255)*(data[i + 2] * grayscaleRatio[grayscaleNo][2])));

        newImageArray[i] = data[i] != 0 ? 0 : 0;
        newImageArray[i + 1] = data[i + 1] != 0 ? 
        applyCurve2(brightness)*255 : 0;
        newImageArray[i + 2] = data[i + 2] != 0 ? 0 : 0;
    }
    var newImageData = new ImageData(newImageArray, canvas.width, canvas.width);
    ctx.putImageData(newImageData, 0, 0);
};

var getColor = function(brightness, toString, opacity=1) {
    var rgb = [ 0, 0, 255 ];l
    if (brightness < 0.25) {
        rgb[1] = ((1/0.25)*brightness) * (255);
    }
    else if (brightness < 0.50) {
        rgb = [ 0, 255, 255 ];
        rgb[2] = (1-((1/0.25)*(brightness-0.25))) * (255);
    }
    else if (brightness < 0.75) {
        rgb = [ 0, 255, 0 ];
        rgb[0] = ((1/0.25)*(brightness-0.5)) * (255);
    }
    else if (brightness <= 1) {
        rgb = [ 255, 255, 0 ];
        rgb[1] = (1-((1/0.25)*(brightness-0.75))) * (255);
    }

    if (toString)
    rgb = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+opacity+")";

    return rgb;
};

// store background data
// compare to video data
// draw outline

var drawOutline = function() {
    var squareZeroCtx = squareZeroCanvas.getContext("2d");

    var squareZeroImgData = 
    squareZeroCtx.getImageData(0, 0, 
        squareZeroCanvas.width, 
        squareZeroCanvas.height);

    var squareZeroData = squareZeroImgData.data;

    var videoCtx = videoCanvas.getContext("2d");

    var videoImgData = 
        videoCtx.getImageData(0, 0, 
        videoCanvas.width, videoCanvas.height);

    var videoData = videoImgData.data;

    var newImageArray = 
    new Uint8ClampedArray(squareZeroData);
    for (var i = 0; i < squareZeroData.length; i += 4) {
        // 0.5 = 0.7
        var value = 
        (1/(videoData[i] +
        videoData[i+1] +
        videoData[i+2]) * (255*3)) - 
        (1/(squareZeroData[i] +
        squareZeroData[i+1] +
        squareZeroData[i+2]) * (255*3));

        if (Math.abs(value) > 0.05) {
            newImageArray[i] = videoData[i];
            newImageArray[i+1] = videoData[i+1];
            newImageArray[i+2] = videoData[i+2];
        }
        else {
            newImageArray[i] = 0; //squareZeroData[i];
            newImageArray[i+1] = 255; //squareZeroData[i+1];
            newImageArray[i+2] = 0; //squareZeroData[i+2];
        }
    }
    var newImageData = 
    new ImageData(newImageArray, 
    videoCanvas.width, videoCanvas.width);
    videoCtx.putImageData(newImageData, 0, 0);
};

/*
for (var n = 0; n <= 1; n+=0.1) {
    getColor(n);
}*/

var lowHeightCanvas = function(canvas) {
    var ctx = canvas.getContext("2d");

    var imgData = 
    ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var i = 0; i < data.length; i += 4) {
        var brightness = 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));

        var rgb = getColor((1/255)*brightness);

        newImageArray[i] = rgb[0];
        newImageArray[i + 1] = rgb[1];
        newImageArray[i + 2] = rgb[2];
    }
    var newImageData = new ImageData(newImageArray, canvas.width, canvas.width);
    ctx.putImageData(newImageData, 0, 0);
};

var downloadBackgroundColor = function() {
    var canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sw;

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(255, 0, 255, 1)";
    ctx.fillRect(0, 0, sw, sw);

    var name = 'download.png';
    var url = canvas.toDataURL();
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
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