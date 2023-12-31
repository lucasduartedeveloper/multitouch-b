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
        uploadImage();
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
        rotationView.innerText = rotationSpeed+" squares/s";;

        console.log("pause");
        pauseRotation();
        if (rotationSpeed > 0) {
            startRotation();
            console.log("start");
        }
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
        mode = (mode+1) < 5 ? (mode+1) : 0;
        modeView.innerText = "mode: "+mode;

        threejsEnabled = (mode == 3);
        if (threejsEnabled) {
            setTimeout(function() {
            //createShape(); 
            }, 1000);
            startAnimation();
        }
        else {
            pauseAnimation();
        }

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
        resolution = (resolution+1) < 2 ? (resolution+1) : 0;
        resolutionView.innerText = 
        "res: "+(resolution == 0 ? "max" : "8x8");
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

    startX = 0;
    startY = 0;

    positionArr = [
        { x: (sw/2)-(sw/4), y: (sw/2)+(sw/4) },
        { x: (sw/2)-(sw/4), y: (sw/2)-(sw/4) },
        { x: (sw/2)+(sw/4), y: (sw/2)+(sw/4) },
        { x: (sw/2)+(sw/4), y: (sw/2)-(sw/4) }
    ];
    positionNo = 0;

    measureView.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY-((sh/2)-(sw/2));

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
    measureView.ontouchmove = function(e) {
        var moveX = e.touches[0].clientX;
        var moveY = e.touches[0].clientY-((sh/2)-(sw/2));

        if (moveX < 0 || moveX > sw) return;
        if (moveY < 0 || moveY > sw) return;

        positionArr[positionNo].x = Math.floor(moveX);
        positionArr[positionNo].y = Math.floor(moveY);
    };
    measureView.ontouchend = function() {
        if (positionNo == 3) {
            positionNo= 0;
            measureLineEnabled = false;
        }
        measureLineView.click();
    };

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

    analogButton.ontouchstart = function(e) {
        analogStartX = e.touches[0].clientX;
        analogStartY = e.touches[0].clientY;
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
    };
    analogButton.ontouchend = function(e) {
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

    load3D();
    animate();
});

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
    resolutionCanvas.width = resolution == 0 ? sw : 8;
    resolutionCanvas.height = resolution == 0 ? sw : 8;

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.save();

    if (!followPlane && measureLineEnabled) {
        resolutionCtx.beginPath();
        resolutionCtx.moveTo(positionArr[0].x, positionArr[0].y);
        resolutionCtx.lineTo(positionArr[1].x, positionArr[1].y);
        resolutionCtx.lineTo(positionArr[2].x, positionArr[2].y);
        resolutionCtx.lineTo(positionArr[3].x, positionArr[3].y);
        resolutionCtx.clip();
    }

    if ((cameraOn && objectPosition == 0) || 
        (!cameraOn && objectPosition == 1)) {
        resolutionCtx.scale(-1, 1);
        resolutionCtx.translate(-resolutionCanvas.width, 0);
    }

    if (cameraOn) {
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
             resolutionCtx.drawImage(image, 
             -format.left, -format.top, frame.width, frame.height, 
             0, 0, resolutionCanvas.width, resolutionCanvas.height);
        }
    }

    resolutionCtx.restore();

    if (mode == 1)
    lowHeightCanvas(resolutionCanvas);
    if (mode == 2)
    directionCanvas(resolutionCanvas);
    if (mode == 4)
    drawBinary(resolutionCanvas);
    if (followPlane && measureLineEnabled)
    drawProjected(resolutionCanvas);

    if (reachedHeight > ((1/7) * (track+1)) && 
    warningBeep.paused)
    warningBeep.play();
    else if (!warningBeep.paused)
    warningBeep.pause();

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
    measureCtx.lineWidth = 5;

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[0].x, positionArr[0].y);
    measureCtx.lineTo(positionArr[1].x, positionArr[1].y);
    measureCtx.stroke();

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[1].x, positionArr[1].y);
    measureCtx.lineTo(positionArr[3].x, positionArr[3].y);
    measureCtx.stroke();

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[2].x, positionArr[2].y);
    measureCtx.lineTo(positionArr[3].x, positionArr[3].y);
    measureCtx.stroke();

    measureCtx.beginPath();
    measureCtx.moveTo(positionArr[0].x, positionArr[0].y);
    measureCtx.lineTo(positionArr[2].x, positionArr[2].y);
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

var uploadImage = function() {
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
    ctx.moveTo(positionArr[2].x, positionArr[2].y);
    ctx.lineTo(positionArr[0].x, positionArr[0].y);
    ctx.lineTo(positionArr[1].x, positionArr[1].y);
    for (var n = 0; n < polygonY.length; n++) {
        var x = ((polygonY[n][0] + polygonY[n][1])/2)*directionY;
        if (n < positionArr[1].y) continue;
        if (n > positionArr[2].y) continue;
        ctx.lineTo(((positionArr[1].x+positionArr[2].x)/2)+
        (x*(sw/4)), n);
    }
    ctx.lineTo(positionArr[2].x, positionArr[2].y);
    ctx.fill();

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

    projectionCtx.drawImage(canvas, 0, 0, width, height);

    var imgData = 
    projectionCtx.getImageData(0, 0, 
    projectionCanvas.width, projectionCanvas.height);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        var n = ((y*height)+x)*4;

        newImageArray[n] = 0
        newImageArray[n + 1] = 0;
        newImageArray[n + 2] = 0;
        newImageArray[n + 3] = 255;
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

        //console.log(xp, yp);

        var np = ((yp*height)+xp)*4;
        newImageArray[np] = data[n];
        newImageArray[np + 1] = data[n + 1];
        newImageArray[np + 2] = data[n + 2];
        newImageArray[np + 3] = 255;
    }
    }

    var newImageData = new ImageData(newImageArray, 
    projectionCanvas.width, projectionCanvas.height);
    projectionCtx.putImageData(newImageData, 0, 0);

    ctx.drawImage(projectionCanvas, 0, 0, sw, sw);
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