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
        track = Math.floor(e.clientX/tileSize);
        //console.log(track, (e.clientX/tileSize));

        previousImagePolygonX = imagePolygonX;
        previousImagePolygonY = imagePolygonY;
    };

    cameraView = document.createElement("video");
    cameraView.style.position = "absolute";
    cameraView.style.background = "#fff";
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
    pictureView.style.objectFit = "cover";
    pictureView.width = (sw);
    pictureView.height = (sw); 
    pictureView.style.left = (0)+"px";
    pictureView.style.top = ((sh/2)-(sw/2))+"px";
    pictureView.style.width = (sw)+"px";
    pictureView.style.height = (sw)+"px";
    pictureView.style.zIndex = "15";
    document.body.appendChild(pictureView);

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
        mode = (mode+1) < 4 ? (mode+1) : 0;
        modeView.innerText = "mode: "+mode;

        threejsEnabled = (mode == 3);
        if (threejsEnabled) {
            createShape();
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

    var startX = 0;
    var startY = 0;

    measureView.ontouchstart = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY-((sh/2)-(sw/2));

        position.x = Math.floor(startX);
        position.y = Math.floor(startY);
    };
    measureView.ontouchmove = function(e) {
        var moveX = e.touches[0].clientX;
        var moveY = e.touches[0].clientY-((sh/2)-(sw/2));

        position.x = Math.floor(moveX);
        position.y = Math.floor(moveY);
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
        measureLineEnabled = !measureLineEnabled;
        measureLineView.innerText = measureLineEnabled ? 
        "line: ON" : "line: OFF";
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
    //document.body.appendChild(resolutionCanvas);

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

    for (var n = 0; n < 100; n++) {
        var img = document.createElement("img");
        img.style.position = "absolute";
        img.style.objectFit = "cover";
        img.style.left = (n*tileSize)+"px";
        img.style.top = (0)+"px";
        img.style.width = (tileSize)+"px";
        img.style.height = (tileSize)+"px";
        img.onclick = function() {
            pictureView.src = this.src;
        };

        img.n = n;
        img.onload = function() {
            found += 1;
            console.log("loading ("+found+")");
            scrollPictureView.appendChild(this);

            this.width = this.naturalWidth;
            this.height = this.naturalHeight;
            pictureArr[this.n] = this;

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

            if ((found+notFound) == 100)
            callback();
        };
        img.onerror = function() {
            notFound += 1;
            console.log("file not found");
            if (!this.src.includes("short"))
            img.src = 
            "img/picture-database/picture-"+n+"_short.png?f="+rnd;

            if ((found+notFound) == 100)
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

var position = {
    x: (sw/2),
    y: (sw/2)
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

    if (cameraOn) {
        resolutionCtx.save();
        if (objectPosition == 0) {
            resolutionCtx.scale(-1, 1);
            resolutionCtx.translate(-resolutionCanvas.width, 0);
        }

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

        resolutionCtx.restore();
    }
    else {
        if (track < pictureArr.length && pictureArr[track]) {
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

    if (mode == 1)
    lowHeightCanvas(resolutionCanvas);
    if (mode == 2)
    directionCanvas(resolutionCanvas);

    if (reachedHeight > ((1/7) * (track+1)) && 
    warningBeep.paused)
    warningBeep.play();
    else if (!warningBeep.paused)
    warningBeep.pause();

    ctx.drawImage(resolutionCanvas, 0, 0, sw, sw);
    if (mode == 3)
    updateShape();

    var measureCtx = measureView.getContext("2d");
    measureCtx.clearRect(0, 0, sw, sw);

    measureCtx.strokeStyle = "#000";
    measureCtx.beginPath();
    measureCtx.moveTo(0, position.y);
    measureCtx.lineTo(sw, position.y);
    measureCtx.stroke();

    measureCtx.beginPath();
    measureCtx.moveTo(position.x, 0);
    measureCtx.lineTo(position.x, sw);
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
    if (no < (pictureArr.length-1) && pictureArr[no]) {
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
    for (var y = (position.y-1); y <= (position.y); y++) {
        var i = ((y*sw)+x)*4;

        var brightness = 
        (1/255) * 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));
        reachedHeight = brightness > reachedHeight ? 
        brightness : reachedHeight;

        polygonX[x][y-(position.y-1)] = brightness;
    }
    }
    imagePolygonX = polygonX;

    var polygonY = [];
    for (var y = 0; y < sw; y++) {
    polygonY[y] = [];
    for (var x = (position.x-1); x <= (position.x); x++) {
        var i = ((y*sw)+x)*4;

        var brightness = 
        (1/255) * 
        ((data[i] * grayscaleRatio[grayscaleNo][0]) + 
        (data[i + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[i + 2] * grayscaleRatio[grayscaleNo][2]));
        reachedHeight = brightness > reachedHeight ? 
        brightness : reachedHeight;

        polygonY[y][x-(position.x-1)] = brightness;
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

    ctx.fillStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";

    ctx.fillRect(0, 0, sw, sw);

    ctx.strokeStyle = "#fff";
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
    ctx.moveTo((sw/2)+(x*(sw/4)), 0);
    for (var n = 1; n < polygonY.length; n++) {
        var x = ((polygonY[n][0] + polygonY[n][1])/2)*directionY;
        ctx.lineTo((sw/2)+(x*(sw/4)), n);
    }
    ctx.stroke();

    //console.log(polygon);
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