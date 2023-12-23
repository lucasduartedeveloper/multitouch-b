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
        console.log(track, (e.clientX/tileSize));
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

    loadList();
    animate();
});

var pictureArr = [];
var count = 0;
var loadList = function() {
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
            count += 1;
            console.log("loading ("+count+")");
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
        };
        img.onerror = function() {
            console.log("file not found");
            if (!this.src.includes("short"))
            img.src = 
            "img/picture-database/picture-"+n+"_short.png?f="+rnd;
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

    var count = (Math.floor((sw/tileSize))+1);
    for (var n = 0; n < count; n++) {
        ctx.fillStyle = 
        "rgb("+(n*(255/count))+","+
        (n*(255/count))+","+
        (n*(255/count))+")";

        ctx.beginPath();
        ctx.rect(n*tileSize, 0, tileSize, tileSize);
        ctx.fill();
    }

    ctx.fillStyle = "#fff";

    ctx.beginPath();
    ctx.arc((track*tileSize)+(tileSize/2), (tileSize/2), 
    2.5, 0, (Math.PI*2));
    ctx.fill();

    var ctx = pictureView.getContext("2d");
    ctx.clearRect(0, 0, sw, sw);

    if (cameraOn) {
        ctx.save();
        if (objectPosition == 0) {
            ctx.scale(-1, 1);
            ctx.translate(-sw, 0);
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
        ctx.drawImage(cameraView,
        -format.left, -format.top, frame.width, frame.height, 
        0, 0, sw, sw);

        ctx.restore();
    }
    else {
        if (track < pictureArr.length) {
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
             0, 0, sw, sw);
        }
    }
};

var getSquare = function(item) {
    var width = item.naturalWidth ? 
    item.naturalWidth : item.width;
    var height = item.naturalHeight ? 
    item.naturalHeight : item.height;

    return width < height ? width : height;
};

var loadImages = function() {
    $.ajax({
        url: "ajax/file-upload.php",
        type: "GET",
        success: function(data) {
            var json = JSON.parse(data);
            console.log(data);
    }});
};

var uploadImage = function() {
    $.ajax({
        url: "ajax/file-upload.php",
        type: "POST",
        data: { 
            no: count,
            image: pictureView.toDataURL()
        },
        success: function(data) {
            alert("Save Complete");
    }});
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