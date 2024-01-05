var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

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
    $("#title").css("top", "10px");
    $("#title").css("z-index", "25");

    // O outro nome não era [  ]
    // Teleprompter
    $("#title")[0].innerText = "PICTURE DATABASE"; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    tileSize = (sw/7);

    scrollPictureView = document.createElement("div");
    scrollPictureView.style.position = "absolute";
    scrollPictureView.style.background = "#fff";
    scrollPictureView.style.backgroundImage = 
    "linear-gradient(to right, black , white)";
    scrollPictureView.style.left = (0)+"px";
    scrollPictureView.style.top = 
    ((sh/2)-(sw/2)-(tileSize*2))+"px";
    scrollPictureView.style.width = (sw)+"px";
    scrollPictureView.style.height = (tileSize+10)+"px";
    //scrollPictureView.style.overflowX = "auto";
    scrollPictureView.style.zIndex = "15";
    document.body.appendChild(scrollPictureView);

    gradientView = document.createElement("canvas");
    gradientView.style.position = "absolute";
    gradientView.width = (sw);
    gradientView.height = (tileSize);
    gradientView.style.left = (0)+"px";
    gradientView.style.top = ((sh/2)-(sw/2)-tileSize)+"px";
    gradientView.style.width = (sw)+"px";
    gradientView.style.height = (50)+"px";
    gradientView.style.zIndex = "15";
    document.body.appendChild(gradientView);

    track = 0;
    gradientView.onclick = function(e) {
         var previousResolutionCtx = 
         previousResolutionCanvas.getContext("2d");
         previousResolutionCtx.imageSmoothingEnabled = false;

         previousResolutionCtx.clearRect(
         0, 0, numPixels, numPixels);
         previousResolutionCtx.drawImage(pictureView,
         0, 0, numPixels, numPixels);

        track = Math.floor(e.clientX/tileSize);
        //console.log(track, (e.clientX/tileSize));

        previousImagePolygonX = imagePolygonX;
        previousImagePolygonY = imagePolygonY;
    };

    cameraView = document.createElement("video");
    cameraView.style.position = "absolute";
    cameraView.style.display = "none";
    //cameraView.style.background = "#fff";
    cameraView.style.objectFit = "cover";
    cameraView.autoplay = true;
    cameraView.width = (sw);
    cameraView.height = (sw); 
    cameraView.style.left = (0)+"px";
    cameraView.style.top = ((sh/2)-(sw/2))+"px";
    cameraView.style.width = (sw)+"px";
    cameraView.style.height = (sw)+"px";
    cameraView.style.zIndex = "15";
    document.body.appendChild(cameraView);
    cameraElem = cameraView;

    pictureView = document.createElement("canvas");
    pictureView.style.position = "absolute";
    pictureView.style.background = "#fff";
    pictureView.width = (sw);
    pictureView.height = (sw); 
    pictureView.style.left = (0)+"px";
    pictureView.style.top = ((sh/2)-(sw/2))+"px";
    pictureView.style.width = (sw)+"px";
    pictureView.style.height = (sw)+"px";
    pictureView.style.zIndex = "15";
    document.body.appendChild(pictureView);

    startX = (sw/2);
    startY = (sw/2);

    ontouch = false;
    pictureView.ontouchstart = function(e) {
        ontouchIteration = 0;
        ontouch = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY-((sh/2)-(sw/2));
    };
    pictureView.ontouchmove = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY-((sh/2)-(sw/2));
    };
    pictureView.ontouchend = function(e) {
        ontouch = false;
    };

    paintView = document.createElement("canvas");
    paintView.style.position = "absolute";
    paintView.style.opacity = 0.1;
    paintView.style.background = "#fff";
    paintView.width = (sw);
    paintView.height = (sw); 
    paintView.style.left = (0)+"px";
    paintView.style.top = ((sh/2)-(sw/2))+"px";
    paintView.style.width = (sw)+"px";
    paintView.style.height = (sw)+"px";
    paintView.style.zIndex = "15";
    document.body.appendChild(paintView);

    paintView.ondblclick = function() {
        var paintCtx = paintView.getContext("2d");
        paintCtx.clearRect(0, 0, sw, sw);
    };

    var paint_ontouchstart = function(e) {
        if (e.touches) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY-((sh/2)-(sw/2));
        }
        else {
            mousedown = true;
            startX = e.clientX;
            startY = e.clientY-((sh/2)-(sw/2));
        }

        var force = (e.touches[0].force*10);

        var ctx = paintView.getContext("2d");
        ctx.strokeStyle = "#000";
        ctx.lineWidth = (25*force);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(startX, startY);
    };
    var paint_ontouchmove = function(e) {
        var moveX;
        var moveY;
        if (e.touches) {
            moveX = e.touches[0].clientX;
            moveY = e.touches[0].clientY-((sh/2)-(sw/2));
        }
        else {
            if (!mousedown) return;
            moveX = e.clientX;
            moveY = e.clientY-((sh/2)-(sw/2));
        }

        if (moveX < 0 || moveX > sw) return;
        if (moveY < 0 || moveY > sw) return;

        var force = (e.touches[0].force*10);

        var ctx = paintView.getContext("2d");
        ctx.lineWidth = (25*force);

        ctx.lineTo(moveX, moveY);
        ctx.stroke();
    };
    var paint_ontouchend = function() {
        mousedown = false;
    };

    paintView.ontouchstart = paint_ontouchstart;
    paintView.ontouchmove = paint_ontouchmove;
    paintView.ontouchend = paint_ontouchend;

    paintView.onmousedown = paint_ontouchstart;
    paintView.onmousemove = paint_ontouchmove;
    paintView.onmouseup = paint_ontouchend;

    deviceNoView = document.createElement("button");
    deviceNoView.style.position = "absolute";
    deviceNoView.style.background = "#fff";
    deviceNoView.style.color = "#000";
    deviceNoView.innerText = "device: "+deviceNo;
    deviceNoView.style.fontFamily = "Khand";
    deviceNoView.style.lineHeight = (25)+"px";
    deviceNoView.style.fontSize = (15)+"px";
    deviceNoView.style.left = ((sw/2)-170)+"px";
    deviceNoView.style.top = 
    ((sh/2)+(sw/2)+10)+"px";
    deviceNoView.style.width = (70)+"px";
    deviceNoView.style.height = (25)+"px";
    deviceNoView.style.border = "none";
    deviceNoView.style.borderRadius = "12.5px";
    deviceNoView.style.zIndex = "15";
    document.body.appendChild(deviceNoView);

    deviceNoView.onclick = function() {
        deviceNo = (deviceNo+1) < (videoDevices.length-1) ?
        (deviceNo+1) : 0;
        deviceNoView.innerText = "device: "+deviceNo;
    };

    objectPosition = 0;
    positionView = document.createElement("button");
    positionView.style.position = "absolute";
    positionView.style.background = "#fff";
    positionView.style.color = "#000";
    positionView.innerText = 
    objectPosition == 0 ? "in front" : "behind";
    positionView.style.fontFamily = "Khand";
    positionView.style.lineHeight = (25)+"px";
    positionView.style.fontSize = (15)+"px";
    positionView.style.left = ((sw/2)-90)+"px";
    positionView.style.top = 
    ((sh/2)+(sw/2)+10)+"px";
    positionView.style.width = (90)+"px";
    positionView.style.height = (25)+"px";
    positionView.style.border = "none";
    positionView.style.borderRadius = "12.5px";
    positionView.style.zIndex = "15";
    document.body.appendChild(positionView);

    positionView.onclick = function() {
        objectPosition = (objectPosition+1) < 2 ? 
        (objectPosition+1) : 0;
        positionView.innerText = 
        objectPosition == 0 ? "in front" : "behind";
    };

    sendView = document.createElement("button");
    sendView.style.position = "absolute";
    sendView.style.background = "#fff";
    sendView.style.color = "#000";
    sendView.innerText = "UPLOAD";
    sendView.style.fontFamily = "Khand";
    sendView.style.lineHeight = (25)+"px";
    sendView.style.fontSize = (15)+"px";
    sendView.style.left = ((sw/2)+10)+"px";
    sendView.style.top = 
    ((sh/2)+(sw/2)+10)+"px";
    sendView.style.width = (50)+"px";
    sendView.style.height = (25)+"px";
    sendView.style.border = "none";
    sendView.style.borderRadius = "12.5px";
    sendView.style.zIndex = "15";
    document.body.appendChild(sendView);

    sendView.onclick = function() {
        setTimeout(function() {
            cameraView.pause();
            uploadImage(function() {
                if (timeout > 0) 
                uploadAlert.play();
                cameraView.play();
            });
        }, (timeout*1000));
    };

    powerView = document.createElement("button");
    powerView.style.position = "absolute";
    powerView.style.background = "#fff";
    powerView.style.color = "#000";
    powerView.innerText = "OFF";
    powerView.style.fontFamily = "Khand";
    powerView.style.lineHeight = (25)+"px";
    powerView.style.fontSize = (15)+"px";
    powerView.style.left = ((sw/2)+((sw/2)-60))+"px";
    powerView.style.top = 
    ((sh/2)+(sw/2)+10)+"px";
    powerView.style.width = (50)+"px";
    powerView.style.height = (25)+"px";
    powerView.style.border = "none";
    powerView.style.borderRadius = "12.5px";
    powerView.style.zIndex = "15";
    document.body.appendChild(powerView);

    powerView.onclick = function() {
        if (!cameraOn) {
            powerView.innerText = "ON";
            startCamera();
        }
        else {
            powerView.innerText = "OFF";
            stopCamera();
        }
    };

    clearDatabaseView = document.createElement("button");
    clearDatabaseView.style.position = "absolute";
    clearDatabaseView.style.background = "#fff";
    clearDatabaseView.style.color = "#000";
    clearDatabaseView.innerText = "CLEAR DATABASE";
    clearDatabaseView.style.fontFamily = "Khand";
    clearDatabaseView.style.lineHeight = (25)+"px";
    clearDatabaseView.style.fontSize = (15)+"px";
    clearDatabaseView.style.left = ((sw/2)-((sw/2)-10))+"px";
    clearDatabaseView.style.top = 
    ((sh/2)+(sw/2)+45)+"px";
    clearDatabaseView.style.width = (100)+"px";
    clearDatabaseView.style.height = (25)+"px";
    clearDatabaseView.style.border = "none";
    clearDatabaseView.style.borderRadius = "12.5px";
    clearDatabaseView.style.zIndex = "15";
    document.body.appendChild(clearDatabaseView);

    clearDatabaseView.onclick = function() {
        clearDatabase();
    };

    rotationSpeed = 0;
    rotationView = document.createElement("button");
    rotationView.style.position = "absolute";
    rotationView.style.background = "#fff";
    rotationView.style.color = "#000";
    rotationView.innerText = "OFF";
    rotationView.style.fontFamily = "Khand";
    rotationView.style.lineHeight = (25)+"px";
    rotationView.style.fontSize = (15)+"px";
    rotationView.style.left = ((sw/2)-((sw/2)-120))+"px";
    rotationView.style.top = 
    ((sh/2)+(sw/2)+45)+"px";
    rotationView.style.width = (100)+"px";
    rotationView.style.height = (25)+"px";
    rotationView.style.border = "none";
    rotationView.style.borderRadius = "12.5px";
    rotationView.style.zIndex = "15";
    document.body.appendChild(rotationView);

    rotationView.onclick = function() {
        rotationSpeed = (rotationSpeed+1) < 11 ? 
        (rotationSpeed+1) : 0;
        rotationView.innerText = rotationSpeed+" squares/s";

        console.log("pause");
        pauseRotation();
        if (rotationSpeed > 0) {
            startRotation();
            console.log("start");
        }
    };

    timeout = 0;
    timeoutView = document.createElement("button");
    timeoutView.style.position = "absolute";
    timeoutView.style.background = "#fff";
    timeoutView.style.color = "#000";
    timeoutView.innerText = (timeout)+" s";
    timeoutView.style.fontFamily = "Khand";
    timeoutView.style.lineHeight = (25)+"px";
    timeoutView.style.fontSize = (15)+"px";
    timeoutView.style.left = ((sw/2)+50)+"px";
    timeoutView.style.top = 
    ((sh/2)+(sw/2)+45)+"px";
    timeoutView.style.width = (40)+"px";
    timeoutView.style.height = (25)+"px";
    timeoutView.style.border = "none";
    timeoutView.style.borderRadius = "12.5px";
    timeoutView.style.zIndex = "15";
    document.body.appendChild(timeoutView);

    timeoutView.onclick = function() {
        timeout = (timeout+10) < 31 ? 
        (timeout+10) : 0;
        timeoutView.innerText = (timeout)+" s";
    };

    mode = 0;
    threejsEnabled = false;
    modeView = document.createElement("button");
    modeView.style.position = "absolute";
    modeView.style.background = "#fff";
    modeView.style.color = "#000";
    modeView.innerText = "mode: "+mode;
    modeView.style.fontFamily = "Khand";
    modeView.style.lineHeight = (25)+"px";
    modeView.style.fontSize = (15)+"px";
    modeView.style.left = (sw-80)+"px";
    modeView.style.top = 
    ((sh/2)+(sw/2)+45)+"px";
    modeView.style.width = (70)+"px";
    modeView.style.height = (25)+"px";
    modeView.style.border = "none";
    modeView.style.borderRadius = "12.5px";
    modeView.style.zIndex = "15";
    document.body.appendChild(modeView);

    modeView.onclick = function() {
        mode = (mode+1) < 6 ? (mode+1) : 0;
        modeView.innerText = "mode: "+mode;

        if (mode == 0) {
            northAngle = -(Math.PI/4);
        }

        threejsEnabled = (mode == 3);
        if (threejsEnabled) {
            setTimeout(function() {
                createShape(); 
            }, 1000);
            startAnimation();
        }
        else {
            pauseAnimation();
        }

        if (mode == 2) {
            positionArr = [
                { x: (sw/2), y: (sw/2) },
                { x: (sw/2), y: 0 },
                { x: (sw/2), y: sw },
                { x: (sw/2), y: (sw/2) }
            ];
        }
        else {
            positionArr = [
                { x: (sw/2), y: sw },
                { x: 0, y: 0 },
                { x: (sw/2), y: sw },
                { x: sw, y: 0 }
            ];
        }

        if (mode == 5) {
            valueArr[0] = prompt(textArr[0], valueArr[0]);
            valueArr[1] = prompt(textArr[1], valueArr[1]);
            valueArr[2] = prompt(textArr[2], valueArr[2]);
            valueArr[3] = prompt(textArr[3], valueArr[3]);
            valueArr[4] = prompt(textArr[4], valueArr[4]);
        };

        renderer.domElement.style.display = 
        threejsEnabled ? "initial" : "none";
        modes.style.display = 
        threejsEnabled ? "initial" : "none";
        eyeSep.style.display = 
        threejsEnabled ? "initial" : "none";
    };

    resolution = 0;
    resolutionView = document.createElement("button");
    resolutionView.style.position = "absolute";
    resolutionView.style.background = "#fff";
    resolutionView.style.color = "#000";
    resolutionView.innerText = 
    "res: "+(resolution == 0 ? "max" : "8x8");
    resolutionView.style.fontFamily = "Khand";
    resolutionView.style.lineHeight = (25)+"px";
    resolutionView.style.fontSize = (15)+"px";
    resolutionView.style.left = ((sw/2)-(sw/2)+10)+"px";
    resolutionView.style.top = 
    ((sh/2)+(sw/2)+80)+"px";
    resolutionView.style.width = (70)+"px";
    resolutionView.style.height = (25)+"px";
    resolutionView.style.border = "none";
    resolutionView.style.borderRadius = "12.5px";
    resolutionView.style.zIndex = "15";
    document.body.appendChild(resolutionView);

    resolutionView.onclick = function() {
        resolution = (resolution+1) < 10 ? (resolution+1) : 0;
        resolutionView.innerText = 
        "res: "+(resolution == 0 ? "max" : (resolution+"x"+resolution));
    };

    measureLineEnabled = false;
    measureView = document.createElement("canvas");
    measureView.style.position = "absolute";
    measureView.style.display = measureLineEnabled  ? 
    "initial" : "none";
    measureView.style.objectFit = "cover";
    measureView.width = (sw);
    measureView.height = (sw); 
    measureView.style.left = (0)+"px";
    measureView.style.top = ((sh/2)-(sw/2))+"px";
    measureView.style.width = (sw)+"px";
    measureView.style.height = (sw)+"px";
    measureView.style.zIndex = "15";
    document.body.appendChild(measureView);

    positionArr = [
        { x: (sw/2), y: sw },
        { x: 0, y: 0 },
        { x: (sw/2), y: sw },
        { x: sw, y: 0 }
    ];
    positionNo = 0;

    var mousedown = false;

    var ontouchstart = function(e) {
        if (e.touches) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY-((sh/2)-(sw/2));
        }
        else {
            mousedown = true;
            startX = e.clientX;
            startY = e.clientY-((sh/2)-(sw/2));
        }

        var no = positionNo;
        var lastHyp = (sw*Math.sqrt(2));
        for (var n = 0; n < 3; n++) {
            var co = Math.abs(startX - positionArr[n].x);
            var ca = Math.abs(startY - positionArr[n].y);
            var hyp = Math.sqrt(
                Math.pow(co, 2)+
                Math.pow(ca, 2)
            );

            if (hyp < lastHyp)
            no = n;

            lastHyp = hyp;
        }

        //positionNo = no;

        measureLineView.innerText = measureLineEnabled ? 
        "line: "+positionNo : "line: OFF";

        positionArr[positionNo].x = Math.floor(startX);
        positionArr[positionNo].y = Math.floor(startY);
    };
    var ontouchmove = function(e) {
        var moveX;
        var moveY;
        if (e.touches) {
            moveX = e.touches[0].clientX;
            moveY = e.touches[0].clientY-((sh/2)-(sw/2));
        }
        else {
            if (!mousedown) return;
            moveX = e.clientX;
            moveY = e.clientY-((sh/2)-(sw/2));
        }

        if (moveX < 0 || moveX > sw) return;
        if (moveY < 0 || moveY > sw) return;

        positionArr[positionNo].x = Math.floor(moveX);
        positionArr[positionNo].y = Math.floor(moveY);
    };
    var ontouchend = function() {
        mousedown = false;
        if (positionNo == 3) {
            positionNo= 0;
            measureLineEnabled = false;
        }
        measureLineView.click();
    };

    measureView.ontouchstart = ontouchstart;
    measureView.ontouchmove = ontouchmove;
    measureView.ontouchend = ontouchend;

    measureView.onmousedown = ontouchstart;
    measureView.onmousemove = ontouchmove;
    measureView.onmouseup = ontouchend;

    measureLineView = document.createElement("button");
    measureLineView.style.position = "absolute";
    measureLineView.style.background = "#fff";
    measureLineView.style.color = "#000";
    measureLineView.innerText = measureLineEnabled ? 
    "line: ON" : "line: OFF";
    measureLineView.style.fontFamily = "Khand";
    measureLineView.style.lineHeight = (25)+"px";
    measureLineView.style.fontSize = (15)+"px";
    measureLineView.style.left = ((sw/2)-(sw/2)+90)+"px";
    measureLineView.style.top = 
    ((sh/2)+(sw/2)+80)+"px";
    measureLineView.style.width = (70)+"px";
    measureLineView.style.height = (25)+"px";
    measureLineView.style.border = "none";
    measureLineView.style.borderRadius = "12.5px";
    measureLineView.style.zIndex = "15";
    document.body.appendChild(measureLineView);

    measureLineView.onclick = function() {
        if (!measureLineEnabled && positionNo == 0) {
            measureLineEnabled = true;
        }
        else if (positionNo == 0) {
            positionNo = 1;
        }
        else if (positionNo == 1) {
            positionNo = 2;
        }
        else if (positionNo == 2) {
            positionNo = 3;
        }
        else if (positionNo == 3) {
            measureLineEnabled = false;
            positionNo = 0;
        }

        measureLineView.innerText = measureLineEnabled ? 
        "line: "+positionNo : "line: OFF";
        measureView.style.display = measureLineEnabled  ? 
        "initial" : "none";
    };

    loadList(function() {
        /*
        pictureArr = pictureArr.sort(function(a, b) {
            return a.n < b.n ? -1 : 1;
        });*/
        loadImages();
    });

    sizeView = document.createElement("button");
    sizeView.style.position = "absolute";
    sizeView.style.background = "#fff";
    sizeView.style.color = "#000";
    sizeView.innerText = "SET SIZE";
    sizeView.style.fontFamily = "Khand";
    sizeView.style.lineHeight = (25)+"px";
    sizeView.style.fontSize = (15)+"px";
    sizeView.style.left = ((sw/2)-(sw/2)+170)+"px";
    sizeView.style.top = 
    ((sh/2)+(sw/2)+80)+"px";
    sizeView.style.width = (70)+"px";
    sizeView.style.height = (25)+"px";
    sizeView.style.border = "none";
    sizeView.style.borderRadius = "12.5px";
    sizeView.style.zIndex = "15";
    document.body.appendChild(sizeView);

    sizeView.onclick = function() {
        var input = prompt();
        if (!input) {
            pictureView.style.left = (0)+"px";
            pictureView.style.top = ((sh/2)-(sw/2))+"px";
            pictureView.style.width = (sw)+"px";
            pictureView.style.height = (sw)+"px";
        }
        else {
            var width = input.includes(",") ? 
            parseInt(input.split(",")[0]) : parseInt(input);

            var height = input.includes(",") ? 
            parseInt(input.split(",")[1]) : parseInt(input);

            pictureView.style.left = ((sw/2)-(width/2))+"px";
            pictureView.style.top = ((sh/2)-(height/2))+"px";
            pictureView.style.width = (width)+"px";
            pictureView.style.height = (height)+"px";
        }
    };

    charArr = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    charNo = 0;

    charView = document.createElement("button");
    charView.style.position = "absolute";
    charView.style.background = "#fff";
    charView.style.color = "#000";
    charView.innerText = charArr[charNo];
    charView.style.fontFamily = "Khand";
    charView.style.lineHeight = (25)+"px";
    charView.style.fontSize = (15)+"px";
    charView.style.left = ((sw/2)+(sw/2)-55)+"px";
    charView.style.top = 
    ((sh/2)+(sw/2)+80)+"px";
    charView.style.width = (45)+"px";
    charView.style.height = (25)+"px";
    charView.style.border = "none";
    charView.style.borderRadius = "12.5px";
    charView.style.zIndex = "15";
    document.body.appendChild(charView);

    charView.ondblclick = function() {
        charNo = 0;
        charView.innerText = charArr[charNo];
    };

    charView.onclick = function() {
        charNo = (charNo+1) < charArr.length ? 
        (charNo+1) : 0;
        charView.innerText = charArr[charNo];
    };

    previousResolutionCanvas = 
    document.createElement("canvas");
    previousResolutionCanvas.style.position = "absolute";
    previousResolutionCanvas.width = numPixels;
    previousResolutionCanvas.height = numPixels;
    previousResolutionCanvas.style.left = (0)+"px";
    previousResolutionCanvas.style.top = ((sh/2)-(sw/2))+"px";
    previousResolutionCanvas.style.width = (sw)+"px";
    previousResolutionCanvas.style.height = (sw)+"px";
    previousResolutionCanvas.style.border = "none";
    previousResolutionCanvas.style.zIndex = "35";

    resolutionCanvas = document.createElement("canvas");
    resolutionCanvas.style.position = "absolute";
    resolutionCanvas.width = numPixels;
    resolutionCanvas.height = numPixels;
    resolutionCanvas.style.left = (0)+"px";
    resolutionCanvas.style.top = ((sh/2)-(sw/2))+"px";
    resolutionCanvas.style.width = (sw)+"px";
    resolutionCanvas.style.height = (sw)+"px";
    resolutionCanvas.style.border = "none";
    resolutionCanvas.style.zIndex = "35";

    analogButton = document.createElement("div");
    analogButton.style.position = "absolute";
    analogButton.style.objectFit = "cover";
    analogButton.style.left = ((sw/2)+(sw/4)-25)+"px";
    analogButton.style.top = ((sh/2)+(sw/2)+75)+"px";
    analogButton.style.width = (50)+"px";
    analogButton.style.height = (50)+"px";
    analogButton.style.border = "1px solid #fff";
    analogButton.style.borderRadius = "50%";
    analogButton.style.zIndex = "15";
    document.body.appendChild(analogButton);

    analogStartX = 0;
    analogStartY = 0;

    rotationX = 0;
    rotationY = 0;

    open = false;
    var gyroInterval = 0;
    analogButton.ontouchstart = function(e) {
        analogStartX = e.touches[0].clientX;
        analogStartY = e.touches[0].clientY;

        gyroInterval = setInterval(function() {
            navigator.vibrate(100);
        }, 100);

        if (!open) {
            northAngle = -(Math.PI/4);
        }
        open = true;
    };
    analogButton.ontouchmove = function(e) {
        var moveX = e.touches[0].clientX - analogStartX;
        var moveY = e.touches[0].clientY - analogStartY;

        var v = {
            x: moveX,
            y: moveY
        };
        v.x = moveX > 50 ? 1 : (1/50)*moveX;
        v.y = moveY > 50 ? 1 : (1/50)*moveY;

        rotationY = v.x > 0 ? 1 : -1;
        northAngle += (v.x * ((Math.PI*2)/360));
    };
    analogButton.ontouchend = function(e) {
        clearInterval(gyroInterval);
        rotationX = 0;
        rotationY = 0;
    };

    followPlane = false;
    planeView = document.createElement("button");
    planeView.style.position = "absolute";
    planeView.style.background = "#fff";
    planeView.style.color = "#000";
    planeView.innerText = followPlane ? 
    "follow" : "through";
    planeView.style.fontFamily = "Khand";
    planeView.style.lineHeight = (25)+"px";
    planeView.style.fontSize = (15)+"px";
    planeView.style.left = ((sw/2)-(sw/2)+10)+"px";
    planeView.style.top = 
    ((sh/2)+(sw/2)+115)+"px";
    planeView.style.width = (70)+"px";
    planeView.style.height = (25)+"px";
    planeView.style.border = "none";
    planeView.style.borderRadius = "12.5px";
    planeView.style.zIndex = "15";
    document.body.appendChild(planeView);

    planeView.onclick = function() {
        followPlane = !followPlane;
        planeView.innerText = followPlane ? 
        "follow" : "through";
    };

    downloadView = document.createElement("button");
    downloadView.style.position = "absolute";
    downloadView.style.background = "#fff";
    downloadView.style.color = "#000";
    downloadView.innerText = "download";
    downloadView.style.fontFamily = "Khand";
    downloadView.style.lineHeight = (25)+"px";
    downloadView.style.fontSize = (15)+"px";
    downloadView.style.left = ((sw/2)-(sw/2)+150)+"px";
    downloadView.style.top = 
    ((sh/2)+(sw/2)+115)+"px";
    downloadView.style.width = (70)+"px";
    downloadView.style.height = (25)+"px";
    downloadView.style.border = "none";
    downloadView.style.borderRadius = "12.5px";
    downloadView.style.zIndex = "15";
    document.body.appendChild(downloadView);

    downloadView.onclick = function() {
        var name = "download.png";
        var url = pictureView.toDataURL();
        var a = document.createElement('a');
        a.style.display = "none";
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    recordingEnabled = false;
    htmlRecorder = new CanvasRecorder(pictureView);

    recordingView = document.createElement("button");
    recordingView.style.position = "absolute";
    recordingView.style.background = "#fff";
    recordingView.style.color = "#000";
    recordingView.innerText = recordingEnabled ? 
    "REC" : "OFF";
    recordingView.style.fontFamily = "Khand";
    recordingView.style.lineHeight = (25)+"px";
    recordingView.style.fontSize = (15)+"px";
    recordingView.style.left = ((sw/2)+70)+"px";
    recordingView.style.top = 
    ((sh/2)+(sw/2)+10)+"px";
    recordingView.style.width = (35)+"px";
    recordingView.style.height = (25)+"px";
    recordingView.style.border = "none";
    recordingView.style.borderRadius = "12.5px";
    recordingView.style.zIndex = "15";
    document.body.appendChild(recordingView);

    recordingView.onclick = function() {
        recordingEnabled = !recordingEnabled;
        recordingView.innerText = recordingEnabled ? 
        "REC" : "OFF";

        if (recordingEnabled) {
            htmlRecorder.start();
        }
        else {
            htmlRecorder.stop();
            htmlRecorder.save("filename.webm");
            recordingEnabled = false;
        }
    };

    colorEnabled = false;
    color = 1;

    colorView = document.createElement("button");
    colorView.style.position = "absolute";
    colorView.style.background = "#fff";
    colorView.style.color = "#000";
    colorView.innerText = (color)+"x";
    colorView.style.fontFamily = "Khand";
    colorView.style.lineHeight = (25)+"px";
    colorView.style.fontSize = (15)+"px";
    colorView.style.left = ((sw/2)-(sw/2)+90)+"px";
    colorView.style.top = 
    ((sh/2)+(sw/2)+115)+"px";
    colorView.style.width = (50)+"px";
    colorView.style.height = (25)+"px";
    colorView.style.border = "none";
    colorView.style.borderRadius = "12.5px";
    colorView.style.zIndex = "15";
    document.body.appendChild(colorView);

    colorView.onclick = function() {
        color = (color+0.25) <= 1 ? 
        (color+0.25) : 0;

        colorEnabled = (1-color) > 0;
        colorView.innerText = (color)+"x";
    };

    motion = false;
    gyroUpdated = function(e) {
        var p0_fontSize = (sw/30);

        var c = { 
            x: sw-10-(((sw/4)-10)/2), 
            y: (sw/6)+(sw/1.5)-10-(((sw/4)-10)/2)
        };
        var p = {
            x: 10+(((sw/3)-10)/2),
            y: (sw/6)+10+(((sw/3)-10)/2)
        };
        var p0 = {
            x: 0,
            y: -(((sw/4)-10)/2)-(p0_fontSize)
        };

        var co = (p.x-c.x);
        var ca = (p.y-c.y);
        var drawAngle = _angle2d(co, ca);

        var co = e.accX;
        var ca = e.accY;
        northAngle = -(_angle2d(co, ca)-(Math.PI))+drawAngle;
    };

    textArr = [
        "TITULO",
        "NOME COMPLETO",
        "DATA DE NASCIMENTO: 00/00/0000",
        "NOME DO PAI: ",
        "NOME DO MÃE: "
    ];
    preffixArr = [
        "",
        "",
        "DATA DE NASCIMENTO: ",
        "NOME DO PAI: ",
        "NOME DA MÃE: "
    ];
    valueArr = [
        "IDENTIFICAÇÃO 2D", 
        "LUCAS DUARTE DE OLIVEIRA", 
        "14/12/1992", 
        "JOSÉ PEREIRA DE OLIVEIRA", 
        "JUDITH ALMEIDA DUARTE"
    ];

    load3D();
    animate();
});

var getHeight = function(width) {
    var co = (width/2);
    var ca = (width);
    var hyp = Math.sqrt(
        Math.pow(co, 2)+
        Math.pow(ca, 2)
    );
    return hyp;
};

var rotationInterval = 0;
var startRotation = function() {
    rotationInterval = setInterval(function() {
        track = (track+1) < 7 ? (track+1) : 0;
    }, (1000/rotationSpeed));
};

var pauseRotation = function() {
    clearInterval(rotationInterval);
};

var pictureArr = [];
var loadList = function(callback) {
    var found = 0;
    var notFound = 0;

    for (var n = 0; n < 7; n++) {
        var img = document.createElement("img");
        img.style.position = "absolute";
        img.style.display = "none";
        img.style.objectFit = "cover";
        img.style.left = (n*tileSize)+"px";
        img.style.top = (0)+"px";
        img.style.width = (tileSize)+"px";
        img.style.height = (tileSize)+"px";
        img.found = 0;
        img.onclick = function() {
            pictureView.src = this.src;
        };

        scrollPictureView.appendChild(img);

        pictureArr[n] = img;

        var labelView = document.createElement("span");
        labelView.style.position = "absolute";
        labelView.style.color = "#fff";
        labelView.innerText = n;
        labelView.style.fontSize = (10)+"px";
        labelView.style.fontFamily = "Khand";
        labelView.style.left = (n*tileSize)+"px";
        labelView.style.top = (tileSize)+"px";
        labelView.style.width = (tileSize)+"px";
        labelView.style.height = (10)+"px";
        scrollPictureView.appendChild(labelView);

        img.n = n;
        img.onload = function() {
            found += 1;
            console.log("loading ("+found+")");
            this.style.display = "initial";

            this.width = this.naturalWidth;
            this.height = this.naturalHeight;

            this.found = 1;

            if ((found+notFound) == 7)
            callback();
        };
        img.onerror = function() {
            notFound += 1;
            console.log("file not found");
            if (!this.src.includes("short"))
            img.src = 
            "img/picture-database/picture-"+n+"_short.png?f="+rnd;

            if ((found+notFound) == 7)
            callback();
        };
        var rnd = Math.random();
        img.src = 
        "img/picture-database/picture-"+n+".png?f="+rnd;
    }
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

var drawImage = function() {
    var ctx = gradientView.getContext("2d");

    var count = Math.floor((sw/tileSize));
    for (var n = 0; n < count; n++) {
        ctx.fillStyle = 
        "rgb("+(n*(255/(count-1)))+","+
        (n*(255/(count-1)))+","+
        (n*(255/(count-1)))+")";

        ctx.beginPath();
        ctx.rect(n*tileSize, 0, tileSize, tileSize);
        ctx.fill();
    }
    if (mode == 1)
    lowHeightCanvas(gradientView);

    ctx.fillStyle = "#fff";

    ctx.beginPath();
    ctx.arc((track*tileSize)+(tileSize/2), (tileSize/2), 
    2.5, 0, (Math.PI*2));
    ctx.fill();

    var ctx = pictureView.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, sw, sw);

    var resolutionCanvas = document.createElement("canvas");
    resolutionCanvas.width = 
    resolution == 0 ? sw : (8*resolution);
    resolutionCanvas.height = 
    resolution == 0 ? sw : (8*resolution);

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    if (!followPlane && measureLineEnabled) {
        drawPicture(resolutionCanvas);
    }

    resolutionCtx.save();

    if (!followPlane && measureLineEnabled) {
        resolutionCtx.beginPath();
        resolutionCtx.moveTo(positionArr[0].x, positionArr[0].y);
        resolutionCtx.lineTo(positionArr[1].x, positionArr[1].y);
        resolutionCtx.lineTo(positionArr[3].x, positionArr[3].y);
        resolutionCtx.lineTo(positionArr[2].x, positionArr[2].y);
        resolutionCtx.clip();
    }

    if ((cameraOn && objectPosition == 0) || 
        (!cameraOn && objectPosition == 1)) {
        resolutionCtx.scale(-1, 1);
        resolutionCtx.translate(-resolutionCanvas.width, 0);
    }

    if (charNo > 0) {
        resolutionCtx.fillStyle = "#000";
        resolutionCtx.font = (sw/1.5)+"px sans";
        resolutionCtx.textBaseline = "middle";
        resolutionCtx.textAlign = "center";
        resolutionCtx.fillText(charArr[charNo], (sw/2), (sw/2));
    }
    else if (cameraOn) {
        var video = {
            width: vw,
            height: vh
        };
        var frame = {
            width: getSquare(video),
            height: getSquare(video)
        };
        var format = fitImageCover(video, frame);
        resolutionCtx.drawImage(cameraView,
        -format.left, -format.top, frame.width, frame.height, 
        0, 0, resolutionCanvas.width, resolutionCanvas.height);
    }
    else {
        drawPicture(resolutionCanvas);
    }

    resolutionCtx.restore();

    if (mode == 0) {
        if (northAngle < -(Math.PI/4))
        kaleidoscopeEffect(resolutionCanvas);

        var pos = {
            x: (sw-10)-(((sw/4)-10)/2), 
            y: (sw-10)-(((sw/4)-10)/2)
        };
        var dest = { 
            x: (sw/2), 
            y: (sw/2)
        };

        drawCompass(resolutionCanvas, 
        pos, dest, "#000", "#fff");
    }
    if (mode == 1)
    lowHeightCanvas(resolutionCanvas);
    if (mode == 2)
    directionCanvas(resolutionCanvas);
    if (mode == 4)
    drawBinary(resolutionCanvas);
    if (followPlane && measureLineEnabled)
    drawProjected(resolutionCanvas);
    if (mode == 5)
    drawIdentification(resolutionCanvas);

    if (reachedHeight > ((1/7) * (track+1)) && 
    warningBeep.paused)
    warningBeep.play();
    else if (!warningBeep.paused)
    warningBeep.pause();

    if (colorEnabled) {
        colorAmt(resolutionCanvas);
    }

    ctx.drawImage(resolutionCanvas, 0, 0, sw, sw);
    if (mode == 3) {
        updateShape();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, sw, sw);
        ctx.strokeStyle = "rgba(150, 255, 150, 0.5)";
        ctx.beginPath();
        ctx.moveTo((sw/2), 0);
        ctx.lineTo((sw/2), sw);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, (sw/2));
        ctx.lineTo(sw, (sw/2));
        ctx.stroke();
    }

    var measureCtx = measureView.getContext("2d");
    measureCtx.clearRect(0, 0, sw, sw);

    measureCtx.strokeStyle = "#5f5";
    measureCtx.lineWidth = 2;

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[0].x, positionArr[0].y);
    measureCtx.lineTo(positionArr[1].x, positionArr[1].y);
    measureCtx.lineTo(positionArr[3].x, positionArr[3].y);;
    measureCtx.lineTo(positionArr[3].x, positionArr[3].y);
    measureCtx.lineTo(positionArr[2].x, positionArr[2].y);
    measureCtx.closePath();
    measureCtx.stroke();

    return;
    var v0 = {
        x: positionArr[0].x+(positionArr[0].x-positionArr[3].x),
        y: positionArr[0].y+(positionArr[0].y-positionArr[3].y)
    };

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[0].x, positionArr[0].y);
    measureCtx.lineTo(v0.x, v0.y);
    measureCtx.stroke();

    var v1 = {
        x: positionArr[1].x+(positionArr[1].x-positionArr[2].x),
        y: positionArr[1].y+(positionArr[1].y-positionArr[2].y)
    };

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[1].x, positionArr[1].y);
    measureCtx.lineTo(v1.x, v1.y);
    measureCtx.stroke();

    var v2 = {
        x: positionArr[2].x+(positionArr[2].x-positionArr[1].x),
        y: positionArr[2].y+(positionArr[2].y-positionArr[1].y)
    };

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[2].x, positionArr[2].y);
    measureCtx.lineTo(v2.x, v2.y);
    measureCtx.stroke();

    var v3 = {
        x: positionArr[3].x+(positionArr[3].x-positionArr[0].x),
        y: positionArr[3].y+(positionArr[3].y-positionArr[0].y)
    };

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[3].x, positionArr[3].y);
    measureCtx.lineTo(v3.x, v3.y);
    measureCtx.stroke();
};

var kaleidoscopeEffect = function(canvas) {
    var ctx = canvas.getContext("2d");

    var kaleidoscopeCanvas = 
    document.createElement("canvas");
    kaleidoscopeCanvas.width = sw;
    kaleidoscopeCanvas.height = sw;

    var kaleidoscopeCtx = kaleidoscopeCanvas.getContext("2d");

    var v = {
        x: (sw/2)/4,
        y: (sw/2)/4
    };
    var hyp = Math.sqrt(Math.pow(v.x, 2)+Math.pow(v.y, 2));

    kaleidoscopeCtx.strokeStyle = "#000";
    kaleidoscopeCtx.lineWidth = 1;

    kaleidoscopeCtx.save();

    kaleidoscopeCtx.beginPath();
    kaleidoscopeCtx.moveTo(0, (sw/2));
    kaleidoscopeCtx.lineTo(0, 0);
    kaleidoscopeCtx.lineTo((sw/2), 0);
    kaleidoscopeCtx.lineTo(0, (sw/2));
    kaleidoscopeCtx.closePath();
    kaleidoscopeCtx.stroke();
    kaleidoscopeCtx.clip();

    kaleidoscopeCtx.translate(v.x, v.y);
    kaleidoscopeCtx.rotate(-northAngle-(Math.PI/4));
    kaleidoscopeCtx.translate(-v.x, -v.y);
    kaleidoscopeCtx.drawImage(canvas, 
    -(sw/2)+v.x, -(sw/2)+v.y, sw, sw);
    kaleidoscopeCtx.restore();

    kaleidoscopeCtx.save();

    kaleidoscopeCtx.beginPath();
    kaleidoscopeCtx.moveTo(sw, (sw/2));
    kaleidoscopeCtx.lineTo((sw/2), 0);
    kaleidoscopeCtx.lineTo(sw, 0);
    kaleidoscopeCtx.lineTo(sw, (sw/2));
    kaleidoscopeCtx.closePath();
    kaleidoscopeCtx.stroke();
    kaleidoscopeCtx.clip();

    kaleidoscopeCtx.translate(sw-v.x, v.y);
    kaleidoscopeCtx.rotate(northAngle+(Math.PI/4));
    kaleidoscopeCtx.translate(-sw+v.x, v.y);
    kaleidoscopeCtx.drawImage(canvas, 
    (sw/2)-v.x, -(sw/2)-v.y, sw, sw);
    kaleidoscopeCtx.restore();

    kaleidoscopeCtx.save();

    kaleidoscopeCtx.beginPath();
    kaleidoscopeCtx.moveTo(0, sw);
    kaleidoscopeCtx.lineTo(0, (sw/2));
    kaleidoscopeCtx.lineTo((sw/2), sw);
    kaleidoscopeCtx.lineTo(0, sw);
    kaleidoscopeCtx.closePath();
    kaleidoscopeCtx.stroke();
    kaleidoscopeCtx.clip();

    kaleidoscopeCtx.translate(v.x, sw-v.y);
    kaleidoscopeCtx.rotate(northAngle+(Math.PI/4));
    kaleidoscopeCtx.translate(-v.x, -sw+v.y);
    kaleidoscopeCtx.drawImage(canvas, 
    -(sw/2)+v.x, (sw/2)-v.y, sw, sw);
    kaleidoscopeCtx.restore();

    kaleidoscopeCtx.save();

    kaleidoscopeCtx.beginPath();
    kaleidoscopeCtx.moveTo((sw/2), sw);
    kaleidoscopeCtx.lineTo(sw, (sw/2));
    kaleidoscopeCtx.lineTo(sw, sw);
    kaleidoscopeCtx.lineTo((sw/2), sw);
    kaleidoscopeCtx.closePath();
    kaleidoscopeCtx.stroke();
    kaleidoscopeCtx.clip();

    kaleidoscopeCtx.translate(sw-v.x, sw-v.y);
    kaleidoscopeCtx.rotate(-northAngle-(Math.PI/4));
    kaleidoscopeCtx.translate(-sw+v.x, -sw+v.y);
    kaleidoscopeCtx.drawImage(canvas, 
    (sw/2)-v.x, (sw/2)-v.y, sw, sw);
    kaleidoscopeCtx.restore();

    v.x = ((sw/2)/2)+v.x;
    v.y = ((sw/2)/2)+v.y;

    kaleidoscopeCtx.save();

    kaleidoscopeCtx.beginPath();
    kaleidoscopeCtx.moveTo(0, (sw/2));
    kaleidoscopeCtx.lineTo((sw/2), 0);
    kaleidoscopeCtx.lineTo((sw/2), (sw/2));
    kaleidoscopeCtx.lineTo(0, (sw/2));
    kaleidoscopeCtx.closePath();
    kaleidoscopeCtx.stroke();
    kaleidoscopeCtx.clip();

    kaleidoscopeCtx.translate(v.x, v.y);
    kaleidoscopeCtx.rotate(-northAngle-(Math.PI/4));
    kaleidoscopeCtx.translate(-v.x, -v.y);
    kaleidoscopeCtx.drawImage(canvas, 
    -(sw/2)+v.x, -(sw/2)+v.y, sw, sw);
    kaleidoscopeCtx.restore();

    kaleidoscopeCtx.save();

    kaleidoscopeCtx.beginPath();
    kaleidoscopeCtx.moveTo((sw/2), (sw/2));
    kaleidoscopeCtx.lineTo((sw/2), 0);
    kaleidoscopeCtx.lineTo(sw, (sw/2));
    kaleidoscopeCtx.lineTo((sw/2), (sw/2));
    kaleidoscopeCtx.closePath();
    kaleidoscopeCtx.stroke();
    kaleidoscopeCtx.clip();

    kaleidoscopeCtx.translate(sw-v.x, v.y);
    kaleidoscopeCtx.rotate(northAngle+(Math.PI/4));
    kaleidoscopeCtx.translate(-sw+v.x, -v.y);
    kaleidoscopeCtx.drawImage(canvas, 
    (sw/2)-v.x, -(sw/2)+v.y, sw, sw);
    kaleidoscopeCtx.restore();

    kaleidoscopeCtx.save();

    kaleidoscopeCtx.beginPath();
    kaleidoscopeCtx.moveTo((sw/2), sw);
    kaleidoscopeCtx.lineTo(0, (sw/2));
    kaleidoscopeCtx.lineTo((sw/2), (sw/2));
    kaleidoscopeCtx.lineTo((sw/2), sw);
    kaleidoscopeCtx.closePath();
    kaleidoscopeCtx.stroke();
    kaleidoscopeCtx.clip();

    kaleidoscopeCtx.translate(v.x, sw-v.y);
    kaleidoscopeCtx.rotate(northAngle+(Math.PI/4));
    kaleidoscopeCtx.translate(-v.x, -sw+v.y);
    kaleidoscopeCtx.drawImage(canvas, 
    -(sw/2)+v.x, (sw/2)-v.y, sw, sw);
    kaleidoscopeCtx.restore();

    kaleidoscopeCtx.save();

    kaleidoscopeCtx.beginPath();
    kaleidoscopeCtx.moveTo((sw/2), sw);
    kaleidoscopeCtx.lineTo((sw/2), (sw/2));
    kaleidoscopeCtx.lineTo(sw, (sw/2));
    kaleidoscopeCtx.lineTo((sw/2), sw);
    kaleidoscopeCtx.closePath();
    kaleidoscopeCtx.stroke();
    kaleidoscopeCtx.clip();

    kaleidoscopeCtx.translate(sw-v.x, sw-v.y);
    kaleidoscopeCtx.rotate(-northAngle-(Math.PI/4));
    kaleidoscopeCtx.translate(-sw+v.x, -sw+v.y);
    kaleidoscopeCtx.drawImage(canvas, 
    (sw/2)-v.x, (sw/2)-v.y, sw, sw);
    kaleidoscopeCtx.restore();

    ctx.drawImage(kaleidoscopeCanvas, 0, 0, sw, sw);
};

var drawPicture = function(canvas) {
    var ctx = canvas.getContext("2d");

    if (track < pictureArr.length && pictureArr[track].found) {
        var image = pictureArr[track];
        var size = {
            width: image.naturalWidth,
            height: image.naturalHeight
        }
        var frame = {
            width: getSquare(image),
            height: getSquare(image),
        };
        var format = fitImageCover(size, frame);
        ctx.drawImage(image, 
        -format.left, -format.top, frame.width, frame.height, 
        0, 0, canvas.width, canvas.height);
    }
};

var getSquare = function(item) {
    var width = item.naturalWidth ? 
    item.naturalWidth : item.width;
    var height = item.naturalHeight ? 
    item.naturalHeight : item.height;

    return width < height ? width : height;
};

var updatePicture = function(no, dataURL) {
    if ((no < pictureArr.length) && pictureArr[no]) {
        pictureArr[no].src = dataURL;
        return;
    }

    var img = document.createElement("img");
    img.style.position = "absolute";
    img.style.objectFit = "cover";
    img.style.left = (no*tileSize)+"px";
    img.style.top = (0)+"px";
    img.style.width = (tileSize)+"px";
    img.style.height = (tileSize)+"px";
    img.onclick = function() {
        pictureView.src = this.src;
    };

    img.n = no;
    img.onload = function() {
        scrollPictureView.appendChild(this);

        this.width = this.naturalWidth;
        this.height = this.naturalHeight;
        pictureArr.push(this);

        var labelView = document.createElement("span");
        labelView.style.position = "absolute";
        labelView.style.color = "#fff";
        labelView.innerText = this.n;
        labelView.style.fontSize = (10)+"px";
        labelView.style.fontFamily = "Khand";
        labelView.style.left = (this.n*tileSize)+"px";
        labelView.style.top = (tileSize)+"px";
        labelView.style.width = (tileSize)+"px";
        labelView.style.height = (10)+"px";
        scrollPictureView.appendChild(labelView);
    }

    img.src = dataURL;
};

var loadImages = function() {
    $.ajax({
        url: "ajax/file-upload.php",
        type: "GET",
        data: {
            action: "list"
        },
        success: function(data) {
            var json = JSON.parse(data);
            for (var n = 0; n < json.length; n++) {
                updatePicture(json[n].track, json[n].data);
            }
        }
    });
};

var clearDatabase = function() {
    $.ajax({
        url: "ajax/file-upload.php",
        type: "GET",
        data: {
            action: "delete"
        },
        success: function(data) {
            window.location.reload();
        }
    });
};

var uploadImage = function(callback) {
    $.ajax({
        url: "ajax/file-upload.php",
        type: "POST",
        data: { 
            no: track,
            image: pictureView.toDataURL()
        },
        success: function(data) {
            alert("Save Complete");
            updatePicture(track, pictureView.toDataURL());
            callback();
    }});
    console.log("data size: "+pictureView.toDataURL().length);
};

var grayscaleNo = 0;
var grayscaleRatio = [
    [ 0.33, 0.33, 0.33 ], // Normal balance
    [ 0.4, 0.3, 0.4 ] // Color affective
];

var reachedHeight = 0;
var lowHeightCanvas = function(canvas) {
    var ctx = canvas.getContext("2d");
    reachedHeight = 0;

    var imgData = 
    ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var i = 0; i < data.length; i += 4) {
        var brightness = 
        (1/255) * 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));

        reachedHeight = brightness > reachedHeight ? 
        brightness : reachedHeight;

        var rgb = getColor(brightness);

        newImageArray[i] = rgb[0];
        newImageArray[i + 1] = rgb[1];
        newImageArray[i + 2] = rgb[2];
    }
    var newImageData = new ImageData(newImageArray, canvas.width, canvas.height);
    ctx.putImageData(newImageData, 0, 0);

    //console.log("reached height: "+reachedHeight);
};

var getColor = function(brightness, toString, opacity=1) {
    var rgb = [ 0, 0, 255 ];
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

var previousImagePolygonX = [];
var imagePolygonX = [];
var previousImagePolygonY = [];
var imagePolygonY = [];

var directionCanvas = function(canvas, render=true) {
    var ctx = canvas.getContext("2d");
    reachedHeight = 0;

    var imgData = 
    ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    var polygonX = [];
    var newImageArray = new Uint8ClampedArray(data);
    for (var x = 0; x < sw; x++) {
    polygonX[x] = [];
    for (var y = (positionArr[0].y-1); y <= (positionArr[0].y); y++) {
        var i = ((y*sw)+x)*4;

        var brightness = 
        (1/255) * 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));
        reachedHeight = brightness > reachedHeight ? 
        brightness : reachedHeight;

        polygonX[x][y-(positionArr[0].y-1)] = brightness;
    }
    }
    imagePolygonX = polygonX;

    var polygonY = [];
    for (var y = 0; y < sw; y++) {
    polygonY[y] = [];
    for (var x = (positionArr[0].x-1); x <= (positionArr[0].x); x++) {
        var i = ((y*sw)+x)*4;

        var brightness = 
        (1/255) * 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));
        reachedHeight = brightness > reachedHeight ? 
        brightness : reachedHeight;

        polygonY[y][x-(positionArr[0].x-1)] = brightness;
    }
    }
    imagePolygonY = polygonY;

    var upBrightness = 0;
    var downBrightness = 0;

    for (var n = 0; n < polygonX.length; n++) {
        upBrightness += polygonX[n][0];
        downBrightness += polygonX[n][1];
    };

    var directionX = 0;
    var directionX = upBrightness > downBrightness ? -1 : 1;

    var leftBrightness = 0;
    var rightBrightness = 0;

    for (var n = 0; n < polygonY.length; n++) {
        leftBrightness += polygonY[n][0];
        rightBrightness += polygonY[n][1];
    };

    var directionY = 0;
    var directionY = 1; //leftBrightness > rightBrightness ? -1 : 1;

    if (!render) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";

    ctx.fillRect(0, 0, sw, sw);

    var pictureHeight = getHeight(sw);
    drawLightRotationGraph(ctx, polygonX, polygonY, 
    directionX, directionY, 
    (sw/2), (sw/2));

    /*
    drawLightRotationGraph(ctx, polygonX, polygonY, 
    directionX, directionY, 
    (sw/2)-sw, (sw));*/

    var n0 = Math.floor(positionArr[0].y);
    var n1 = Math.floor(positionArr[1].y);
    var n2 = Math.floor(positionArr[2].y)-1;

    for (var n = n1; n < n2; n++) {
        n1 = (polygonY[n][0] > polygonY[n1][0]) && n < n0  ?
        n : n1;

        n2 = (polygonY[n][0] > polygonY[n2][0]) && n > n0 ? 
        n : n2;
    }

    var opening = 
    ((45/(positionArr[2].y-positionArr[1].y))*(n2-n1))
    *(Math.PI/180);

    if ((positionArr[2].y - positionArr[1].y) > (sw/2))
    return;

    ctx.fillStyle = "#ff0";

    ctx.beginPath();
    ctx.moveTo(positionArr[3].x, positionArr[3].y);
    ctx.arc(positionArr[3].x, positionArr[3].y, (sw/6), 
    (opening/2), (Math.PI*2)-(opening/2));
    ctx.lineTo(positionArr[3].x, positionArr[3].y);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";

    ctx.beginPath();
    ctx.arc(positionArr[3].x+(sw/12), 
    positionArr[3].y-(sw/12), (sw/36), 
    0, (Math.PI*2));
    ctx.fill();
    ctx.stroke();

     ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.arc(positionArr[3].x+(sw/12)+(sw/96), 
    positionArr[3].y-(sw/12), (sw/48), 
    0, (Math.PI*2));
    ctx.fill();

    //console.log(polygon);
};

var drawLightRotationGraph = 
    function(ctx, polygonX, polygonY, directionX, directionY, 
    startX, width) {
    var grd = ctx.createLinearGradient(0, 0, 0, sw);
    for (var n = 0; n <= 1; n+=0.1) {
        grd.addColorStop(n, getColor(n, true));
    }

    ctx.fillStyle = grd;

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    var y = ((polygonX[0][0] + polygonX[0][1])/2)*directionX;
    ctx.moveTo(0, (sw/2)+(y*(sw/4)));
    for (var n = 1; n < polygonX.length; n++) {
        var y = ((polygonX[n][0] + polygonX[n][1])/2)*directionX;
        ctx.lineTo(sw, (sw/2)+(y*(sw/4)));
    }
    //ctx.stroke();

    ctx.beginPath();
    var x = ((polygonY[0][0] + polygonY[0][1])/2)*directionY;
    ctx.moveTo(startX, positionArr[2].y);
    ctx.lineTo(startX, positionArr[0].y);
    ctx.lineTo(startX, positionArr[1].y);
    for (var n = 0; n < polygonY.length; n++) {
        var x = ((polygonY[n][0] + polygonY[n][1])/2)*directionY;
        if (n < positionArr[1].y) continue;
        if (n > positionArr[2].y) continue;
        ctx.lineTo(((startX)+
        (x*(width))), (polygonY.length/2)+
        ((1-x)*(n-(polygonY.length/2))));
    }
    ctx.lineTo(startX, positionArr[2].y);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    var x = ((polygonY[0][0] + polygonY[0][1])/2)*directionY;
    ctx.moveTo(startX, positionArr[2].y);
    ctx.lineTo(startX+(width), (sw/2));
    ctx.lineTo(startX, positionArr[1].y);
    for (var n = 0; n < polygonY.length; n++) {
        var x = ((polygonY[n][0] + polygonY[n][1])/2)*directionY;
        if (n < positionArr[1].y) continue;
        if (n > positionArr[2].y) continue;
        ctx.lineTo(((startX)+
        (x*(width))), (polygonY.length/2)+
        ((1-x)*(n-(polygonY.length/2))));
    }
    ctx.lineTo(startX, positionArr[2].y);
    ctx.fill();
};

var ontouchIteration = 0;

var drawBinary = function(canvas) {
    var charSequence = ".*+#@";

    var ctx = canvas.getContext("2d");

    var resolutionCanvas = document.createElement("canvas");

    var width = 50;
    var height = 50;

    resolutionCanvas.width = width;
    resolutionCanvas.height = height;

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.drawImage(canvas, 0, 0, width, height);

    var imgData = 
    resolutionCtx.getImageData(0, 0, 
    resolutionCanvas.width, resolutionCanvas.height);
    var data = imgData.data;

    var binaryData = [];

    var newImageArray = new Uint8ClampedArray(data);
    for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        var i = ((y*height)+x)*4;

        var brightness = 
        (1/255) * 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));

        binaryData.push({
            x: x, y: y,
            radius: brightness, 
            value: Math.floor((charSequence.length-1)*brightness)
        });
    }
    }

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, sw, sw);

    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.font = ((sw/width)/3)+"px sans";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    if (ontouch)
    ontouchIteration = (ontouchIteration+1) < 15 ? 
    (ontouchIteration+1) : ontouchIteration;
    else
    ontouchIteration = (ontouchIteration-2) >= 0 ? 
    (ontouchIteration-2) : 0;

    for (var n = 0; n < binaryData.length; n++) {
        var obj = binaryData[n];
        var x = (sw/(width*2))+(obj.x*(sw/width));
        var y = (sw/(width*2))+(obj.y*(sw/width));

        var v = {
            x: x-startX,
            y: y-startY
        };
        var co = Math.abs(x-startX);
        var ca = Math.abs(y-startY);
        var hyp = Math.sqrt(
            Math.pow(co, 2)+
            Math.pow(ca, 2)
        );

        var r0 = (1/hyp)*(35*((1/15)*ontouchIteration));
        var r1 = (1-((1/15)*ontouchIteration))+r0;
        r1 = r1 > 1 ? 1 : r1;

        x = (x-v.x)+(v.x*r1);
        y = (y-v.y)+(v.y*r1);

        var c = { 
            x: startX, 
            y: startY
        };
        var p = {
            x: x,
            y: y
        };
        var rp = _rotate2d(c, p, (r1*360));

        ctx.fillStyle = "#000";

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, 
        (0.5-(obj.radius/2))*Math.floor(sw/width), 0, 
        Math.PI*2);
        ctx.fill();
    }
};

var drawProjected = function(canvas) {
    var width = sw;
    var height = sw;

    var ctx = canvas.getContext("2d");

    var scale = (1/sw)*width;

    var leftHeight = scale*(positionArr[0].y-positionArr[1].y);
    var topWidth = scale*(positionArr[3].x-positionArr[1].x);
    var rightHeight = scale*(positionArr[2].y-positionArr[3].y);
    var bottomWidth = scale*(positionArr[2].x-positionArr[0].x);

    if (leftHeight < 0) return;
    if (topWidth < 0) return;
    if (rightHeight < 0) return;
    if (bottomWidth < 0) return;

    var offsetX = scale*(positionArr[0].x-positionArr[1].x);
    var offsetY = scale*(positionArr[3].y-positionArr[1].y);

    var projectionCanvas = document.createElement("canvas");
    projectionCanvas.width = width;
    projectionCanvas.height = height;

    var projectionCtx = projectionCanvas.getContext("2d");
    projectionCtx.imageSmoothingEnabled = false;

    if (charNo > 0) {
        //projectionCtx.fillStyle = "#fff";
        //projectionCtx.fillRect(0, 0, sw, sw);

        projectionCtx.fillStyle = "#000";
        projectionCtx.font = (sw/1.5)+"px sans";
        projectionCtx.textBaseline = "middle";
        projectionCtx.textAlign = "center";
        projectionCtx.fillText(charArr[charNo], (sw/2), (sw/2));
    }
    else
    projectionCtx.drawImage(canvas, 0, 0, width, height);

    var imgData = 
    projectionCtx.getImageData(0, 0, 
    projectionCanvas.width, projectionCanvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        var n = ((y*height)+x)*4;

        /*
        newImageArray[n] = 0;
        newImageArray[n + 1] = 0;
        newImageArray[n + 2] = 0;*/

        // set surrounding data to 0 opacity
        newImageArray[n + 3] = 0;
    }
    }

    for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        var n = ((y*height)+x)*4;

        var distX = ((1/width)*x);
        var distY = ((1/height)*y);

        var startX = (scale*positionArr[1].x)+(distY*offsetX);
        var startY = (scale*positionArr[1].y)+(distX*offsetY);

        var pWidth = topWidth+
        (distY*(bottomWidth-topWidth));
        var pHeight = leftHeight+
        (distX*(rightHeight-leftHeight));

        var xp = Math.floor(startX+
        (((1/width)*x)*pWidth));

        var yp = Math.floor(startY+
        (((1/height)*y)*pHeight));

        var np = ((yp*height)+xp)*4;
        newImageArray[np] = data[n];
        newImageArray[np + 1] = data[n + 1];
        newImageArray[np + 2] = data[n + 2];
        newImageArray[np + 3] = data[n + 3];
    }
    }

    var newImageData = new ImageData(newImageArray, 
    projectionCanvas.width, projectionCanvas.height);
    projectionCtx.putImageData(newImageData, 0, 0);

    if (track < pictureArr.length && pictureArr[track].found) {
        drawPicture(canvas);
    }

    ctx.drawImage(projectionCanvas, 0, 0, sw, sw);
};

var colorAmt = function(canvas) {
    var width = sw;
    var height = sw;

    var ctx = canvas.getContext("2d");
    var paintCtx = paintView.getContext("2d");

    /*
    var paintProjectionCanvas = 
    document.createElement("canvas");
    paintProjectionCanvas.width = width;
    paintProjectionCanvas.height = height;

    var paintProjectionCtx = 
    paintProjectionCanvas.getContext("2d");

    paintProjectionCtx.drawImage(paintView, 
    0, 0, paintProjectionCanvas.width, 
    paintProjectionCanvas.height);*/

    var paintImgData = 
    paintCtx.getImageData(0, 0, 
    paintView.width, paintView.height);
    var paintData = paintImgData.data;

    var projectionCanvas = document.createElement("canvas");
    projectionCanvas.width = width;
    projectionCanvas.height = height;

    var projectionCtx = projectionCanvas.getContext("2d");
    projectionCtx.imageSmoothingEnabled = false;

    projectionCtx.drawImage(canvas, 0, 0, width, height);

    var imgData = 
    projectionCtx.getImageData(0, 0, 
    projectionCanvas.width, projectionCanvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        var n = ((y*height)+x)*4;

        var brightness = 
        (1/255) * 
        ((data[n] * grayscaleRatio[grayscaleNo][0]) + 
        (data[n + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[n + 2] * grayscaleRatio[grayscaleNo][2]));

        var r = data[n];
        var g = data[n + 1];
        var b = data[n + 2];
        var m = ((r+g+b)/3);

        var rm = r-m;
        var gm = g-m;
        var bm = b-m;

        var paintBrightness = 
        (1/255)*((paintData[n] + 
        paintData[n + 1] + 
        paintData[n + 2])/3);

        if (paintData[n + 3] == 0) {
            newImageArray[n] = m+(rm*color);
            newImageArray[n + 1] = m+(gm*color);
            newImageArray[n + 2] = m+(bm*color);
            newImageArray[n + 3] = 255;
        }
    }
    }

    var newImageData = new ImageData(newImageArray, 
    projectionCanvas.width, projectionCanvas.height);
    projectionCtx.putImageData(newImageData, 0, 0);

    ctx.drawImage(projectionCanvas, 0, 0, sw, sw);

    return;
    var x = startX;
    var y = startY;

    ctx.strokeStyle = "#000";

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, 0);
    ctx.lineTo((canvas.width/2), 0);
    for (var n = 0; n <= 100; n++) {
        var c = {
            x: x,
            y: y
        };
        var p = {
            x: c.x,
            y: (c.y-25)
        }
        var rp = _rotate2d(c, p, n*(360/100));
        ctx.lineTo(rp.x, rp.y);
    }
    ctx.lineTo((canvas.width/2), 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.clip();
    //ctx.stroke();

    ctx.drawImage(projectionCanvas, 0, 0, sw, sw);
    ctx.restore();
};

var northAngle = -(Math.PI/4);
var drawIdentification = function(canvas) {
    var width = sw;
    var height = sw;

    var ctx = canvas.getContext("2d");

    var indentificationCanvas = 
    document.createElement("canvas");

    indentificationCanvas.width = sw;
    indentificationCanvas.height = sw;

    var indentificationCtx = 
    indentificationCanvas.getContext("2d");

    indentificationCtx.clearRect(0, 0, sw, sw);

    indentificationCtx.fillStyle = "#fff";
    indentificationCtx.fillRect(0, (sw/6), sw, (sw/1.5));

    indentificationCtx.fillStyle = "#000";
    indentificationCtx.strokeStyle = "#000";
    indentificationCtx.lineWidth = 1;

    var pos = {
        x: sw-10-(((sw/4)-10)/2), 
        y: (sw/6)+(sw/1.5)-10-(((sw/4)-10)/2)
    };
    var dest = {
        x: 10+(((sw/3)-10)/2),
        y: (sw/6)+10+(((sw/3)-10)/2)
    };

    drawCompass(indentificationCanvas, 
    pos, dest, "#000", "#fff");

    indentificationCtx.beginPath();
    indentificationCtx.moveTo(10+(((sw/3)-10)/3), (sw/6)+10+((sw/3)-10));
    indentificationCtx.lineTo(10+(((sw/3)-10)/3), 
    (sw/6)+10+((sw/3)-10)+((sw/3)/3));
    indentificationCtx.lineTo(10+(((sw/3)-10)/3)-((((sw/3)-10)/3)/2), 
    (sw/6)+10+((sw/3)-10)+((sw/3)/3));
    indentificationCtx.stroke();

    indentificationCtx.beginPath();
    indentificationCtx.moveTo(10+((((sw/3)-10)/3)*2), (sw/6)+10+((sw/3)-10));
    indentificationCtx.lineTo(10+((((sw/3)-10)/3)*2), 
    (sw/6)+10+((sw/3)-10)+((sw/3)/3));
    indentificationCtx.lineTo(10+((((sw/3)-10)/3)*2)+((((sw/3)-10)/3)/2), 
    (sw/6)+10+((sw/3)-10)+((sw/3)/3));
    indentificationCtx.stroke();

    var fontSize = (sw/30);

    indentificationCtx.fillStyle = "#000";
    indentificationCtx.font = "900 "+fontSize+"px sans";
    indentificationCtx.textBaseline = "top";
    indentificationCtx.textAlign = "left";

    indentificationCtx.drawImage(canvas, 10, (sw/6)+10, 
    ((sw/3)-10), ((sw/3)-10));

    indentificationCtx.fillText(
    valueArr[0] ? (preffixArr[0]+valueArr[0]) : textArr[0], 
    (((sw/3)-10)+10)+10, ((sw/6)+10)+(fontSize/2));

    indentificationCtx.fillText(
    valueArr[1] ? (preffixArr[1]+valueArr[1]) : textArr[1], 
    (((sw/3)-10)+10)+10, 
    ((sw/6)+10)+(fontSize*2)+(fontSize/2));

    indentificationCtx.fillText(
    valueArr[2] ? (preffixArr[2]+valueArr[2]) : textArr[2], 
    (((sw/3)-10)+10)+10, 
    ((sw/6)+10)+(fontSize*6)+(fontSize/2));

    indentificationCtx.fillText(
    valueArr[3] ? (preffixArr[3]+valueArr[3]) : textArr[3], 
    10, ((sw/6)+(sw/1.5))-10-(fontSize*3));

    indentificationCtx.fillText(
    valueArr[4] ? (preffixArr[4]+valueArr[4]) : textArr[4], 
    10, ((sw/6)+(sw/1.5))-10-fontSize);

    ctx.drawImage(indentificationCanvas, 0, 0, sw, sw);
};

var drawCompass = 
    function(canvas, pos, dest, color0, color1) {
    var ctx = canvas.getContext("2d");

    ctx.save();
    ctx.translate(pos.x, pos.y);

    var p0_fontSize = (sw/30);

    var c = pos;
    var p = dest;
    var p0 = {
        x: 0,
        y: -(((sw/4)-10)/2)-(p0_fontSize)
    };

    var co = (p.x-c.x);
    var ca = (p.y-c.y);

    if ((!hasMotionSensor || !motion) && !open)
    northAngle = _angle2d(co, ca);

    ctx.rotate(northAngle);

    ctx.fillStyle = color0;
    ctx.font = "900 "+p0_fontSize+"px sans";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("N", p0.x, p0.y);

    ctx.strokeStyle = color0;
    ctx.beginPath();
    ctx.moveTo(
        p0_fontSize, -(((sw/4)-10)/2)-(p0_fontSize)
    );
    for (var n = 1; n <= 10; n++) {
        var c = { 
            x: 0, 
            y: 0 
        };
        var p0 = { 
            x: p0_fontSize,
            y: -(((sw/4)-10)/2)-(p0_fontSize)
        };
        var angle = (180/Math.PI)*(n*(northAngle/10));
        var r0 = _rotate2d(c, p0, angle);

        ctx.lineTo(r0.x, r0.y);
    }
    ctx.stroke();

    var path0 = [
       { x: 0, y: 0 },
       { x: -(((sw/4)-10)/2), y: 0 },
       { x: -10, y: -10 }
    ];
    var path1 = [
       { x: 0, y: 0 },
       { x: -(((sw/4)-10)/2), y: 0 },
       { x: -10, y: 10 }
    ];

    for (var n = 0; n < 4; n++) {
        var c = { x: 0, y: 0 };
        var p0 = { x: path0[0].x, y: path0[0].y };
        var p1 = { x: path0[1].x, y: path0[1].y };
        var p2 = { x: path0[2].x, y: path0[2].y };

        var r0 = _rotate2d(c, p0, (n*90));
        var r1 = _rotate2d(c, p1, (n*90));
        var r2 = _rotate2d(c, p2, (n*90));

        ctx.fillStyle = color1;
        ctx.beginPath();
        ctx.moveTo(r0.x, r0.y);
        ctx.lineTo(r1.x, r1.y);
        ctx.lineTo(r2.x, r2.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        var p3 = { x: path1[0].x, y: path1[0].y };
        var p4 = { x: path1[1].x, y: path1[1].y };
        var p5 = { x: path1[2].x, y: path1[2].y };

        var r3 = _rotate2d(c, p3, (n*90));
        var r4 = _rotate2d(c, p4, (n*90));
        var r5 = _rotate2d(c, p5, (n*90));

        ctx.fillStyle = color0;
        ctx.beginPath();
        ctx.moveTo(r3.x, r3.y);
        ctx.lineTo(r4.x, r4.y);
        ctx.lineTo(r5.x, r5.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    ctx.restore();
};

var getDarkestColorPosition = function(canvas) {
    var ctx = canvas.getContext("2d");
    
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