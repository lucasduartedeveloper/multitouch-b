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
var sh = window.innerHeight < 832 ? window.innerHeight : 669;

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

    textView = document.createElement("span");
    textView.style.position = "absolute";
    textView.style.fontFamily = "Khand";
    textView.style.fontSize = "15px";
    textView.style.left = (0)+"px";
    textView.style.top = (50)+"px";
    textView.style.width = (sw)+"px";
    textView.style.height = (150)+"px";
    textView.style.borderRadius = "50%";
    textView.style.zIndex = "20";
    document.body.appendChild(textView);

    textView.innerText = 
    "Espaço sideral, espaço exterior ou simplesmente espaço é toda a área física do universo não ocupada por corpos celestes.  Esse ambiente constitui-se de um vácuo parcial contendo baixa densidade de partículas, predominantemente plasma de hidrogênio e hélio, além de radiação eletromagnética, campos magnéticos, neutrinos, poeira interestelar e raios cósmicos. Sua temperatura média, definida a partir da radiação de fundo do Big Bang, é 2,727 K (−270,423 °C; −454,7614 °F).";

    camera = document.createElement("video");
    camera.style.position = "absolute";
    camera.autoplay = true;
    camera.style.objectFit = "cover";
    camera.width = (200);
    camera.height = (200); 
    camera.style.left = ((sw/2)-100)+"px";
    camera.style.top = ((sh/2)-100)+"px";
    camera.style.width = (200)+"px";
    camera.style.height = (200)+"px";
    camera.style.transform = (deviceNo == 0) ? 
    "rotateY(-180deg)" : "initial";
    camera.style.borderRadius = "50%";
    camera.style.zIndex = "20";
    document.body.appendChild(camera);
    cameraElem = camera;

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

    showPath = false;
    imageView.ontouchstart = function(e) {
        receivedData = false;
        timerStarted = true;
        startTime = new Date().getTime();

        showPath = false;
        path = [];
        var pos = {
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY
        };
        path.push(pos);
    };

    imageView.ontouchmove = function(e) {
        //navigator.vibrate(100);
        var pos = {
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY
        };
        path.push(pos);

        distance = 0;
        for (var n = 1; n < path.length; n++) {
            var co = Math.abs(path[n].x - path[n-1].x);
            var ca = Math.abs(path[n].y - path[n-1].y);
            var hyp = Math.sqrt(
                 Math.pow(co, 2) + 
                 Math.pow(ca, 2)
            );
            //console.log(co, ca, hyp);
            distance += hyp;
        }
    };

    imageView.ontouchend = function(e) {
        timerStarted = false;
        showPath = true;
        savePath();
        navigator.vibrate(1000);
        setTimeout(function() {
            var newArr = [];
            newArr[0] = path[0];
            newArr[1] = path[w];
            newArr[2] = path[path.length-1];
            path = newArr;
        }, 1000);
    };

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "path-update") {
            loadPath();
            receivedData = true;
        }
    };

    motion = true;
    gyroUpdated = function(gyro) {
        position.y = (1/9.8)*gyro.accX;
        angle = 180;
        return;

        var co = gyro.accX;
        var ca = gyro.accY;
        angle = (180/Math.PI)*_angle2d(co, ca);
        angle = angle < 0 ? 360 + angle : angle;
    };

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        var audio = new Audio();
        audio.srcObject = mic.audioStream.mediaStream;
        audio.play();
    };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        resumedWave = resumeWave(freqArray);
    };
    mic.onclose = function() { };
    var ab = new Array(50);
    for (var n = 0; n < 50; n++) {
        ab[n] = 0;
    }
    resumedWave = ab;

    imageView.onclick = function() {
        if (mic.closed)
        mic.open(true, 250);

        if (!cameraOn)
        startCamera();
        else if (!camera.paused) {
            camera.pause();
        }
        else if (camera.paused) {
            camera.play();
        }
    };

    loadImages();
    //loadPath();
    animate();
});

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
    ctx.strokeStyle = "#000";

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

var w = 0;
var receivedData = false;

var distance = 0;
var path = [];

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

        rotate();
        //updateAudio(angle);
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var position = {
    x: 0, 
    y: 0, 
    z: -1
};
var rotate = function() {
    var angle = -(360/10); //-((Math.P*2)/240);

    var c = {
       x: 0,
       y: 0
    };
    var p = {
       x: position.x,
       y: position.z
    };
    var rp = _rotate2d(c, p, angle);

    position.x = rp.x;
    position.z = rp.y;

    if (true || active == 0) {
        var c = {
            x: 0,
            y: 0
        };
        var p = {
            x: pos0.x,
            y: pos0.y
        };
        var rp = _rotate2d(c, p, angle);
        pos0 = rp;
        if (pos0.y = -1)
        active = 1;
    }
    else {
        var c = {
            x: 0,
            y: 0
        };
        var p = {
            x: pos1.x,
            y: pos1.y
        };
        var rp = _rotate2d(c, p, angle);
        pos1 = rp;
        if (pos1.y = 1)
        active = 0;
    }
};

var active = 0;
var pos0 = {
    x: 0, 
    y: -1
};
var pos1 = {
    x: 0, 
    y: 1
};

var img_list = [
    "img/image-0.png", 
    "img/mic-icon.png", 
    "img/image-1.png", 
    "img/image-3.png"
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

var a = 1+Math.floor(Math.random()*100);
var b = 1+Math.floor(Math.random()*100);

var textList = [
    { start: 0, end: 135, text: (a+" × "+b), 
    audio: new Audio("audio/left-audio.wav") },
    { start: 135, end: 225, text: "=", 
    audio: new Audio("audio/center-audio.wav") },
    { start: 225, end: 360, text: (a*b), 
    audio: new Audio("audio/right-audio.wav") }
];

var getText = function(angle) {
    for (var n = 0; n < textList.length; n++) {
        if (angle >= textList[n].start && 
        angle < textList[n].end) {
            return textList[n].text;
        }
    }
    return "ANGLE OUTSIDE LIST";
};

var activeAudio = null;
var updateAudio = function(angle) {
    var w = activeAudio;
    for (var n = 0; n < textList.length; n++) {
        if (angle >= textList[n].start && 
        angle < textList[n].end) {
            w = n;
        }
    }
    if (activeAudio == w) return;
    activeAudio = w;

    for (var n = 0; n < textList.length; n++) {
        textList[n].audio.pause();
    }
    textList[w].audio.play();
};

var getImage = function(angle) {
    for (var n = 0; n < textList.length; n++) {
        if (angle >= textList[n].start && 
        angle < textList[n].end) {
            return img_list[n];
        }
    }
    return null;
};

var angle = 180;
var drawImage = function() {
    var ctx = imageView.getContext("2d");
    ctx.clearRect(0, 0, sw, sh);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, sw, sh);

    drawAB(resumedWave);

    ctx.fillStyle = "#000";
    ctx.font = "25px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(angle.toFixed(2)+"°", (sw/2), (sh/2)+175);

    var text = getText(angle);
    ctx.font = "25px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, (sw/2), (sh/2)+225);

    var radians = (angle-90) * (Math.PI / 180);
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc((sw/2), (sh/2), 
    100, 0, (Math.PI * 2));
    ctx.stroke();

    /*
    drawMark(ctx, textList[0].start);
    drawMark(ctx, textList[1].start);
    drawMark(ctx, textList[2].start);
    drawMark(ctx, textList[2].end);

    drawMark(ctx, angle, 11);*/

    ctx.save();
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc((sw/2), (sh/2), 
    100, 0, (Math.PI * 2));
    ctx.clip();

    var image = getImage(angle);
    var frame = {
        width: 200,
        height: 200
    };

    var format = fitImageCover(image, frame);

    format.left += (sw/2)-100;
    format.top += (sh/2)-100;

    if (imagesLoaded)
    ctx.drawImage(image, format.left, format.top, 
    format.width, format.height);
    ctx.restore();

    return;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc((sw/2), ((sh/2)-(sh/6)-15), 
    (sh/6), 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc((sw/2), ((sh/2)+(sh/6)+15), 
    (sh/6), 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc((sw/2)+(pos0.x*(sh/6)), 
    ((sh/2)-(sh/6)-15)+(pos0.y*(sh/6)), 
    10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc((sw/2)+(pos1.x*(sh/6)), 
    ((sh/2)+(sh/6)+15)+(pos1.y*(sh/6)), 
    10, 0, Math.PI * 2);
    ctx.fill();

    var pos = convert2d();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(pos.y, pos.x, 
    (1+(1-Math.abs(position.z)))*(sh/50), 0, Math.PI * 2);
    //ctx.fill();

    return;
    ctx.save();
    if (receivedData) {rotate
        ctx.scale(-1, 1);
        ctx.translate(-sw, 0);
    };

    if (showPath && path.length > 1) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        w = path.length;
        for (var n = (path.length-1); n > 0; n--) {
            var co = Math.abs(path[path.length-1].x - path[n].x);
            var ca = Math.abs(path[path.length-1].y - path[n].y);
            var hyp = Math.sqrt(
                 Math.pow(co, 2) + 
                 Math.pow(ca, 2)
            );
            if (hyp > 20) {
                w = n;
                break;
            }
        }

        for (var n = 1; n < (w+1); n++) {
            ctx.lineTo(path[n].x, path[n].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(path[path.length-1].x, path[path.length-1].y, 
        10, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
};

var drawMark = function(ctx, angle, offset=0) {
    var c = {
        x: (sw/2), 
        y: (sh/2) 
    };

    var p0 = {
        x: c.x,
        y: c.y - (sh/6) - offset
    };

    var p1 = {
        x: c.x,
        y: c.y - (sh/6) - offset - 10
    };

    var rp0 = _rotate2d(c, p0, angle);
    var rp1 = _rotate2d(c, p1, angle);

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(rp0.x, rp0.y);
    ctx.lineTo(rp1.x, rp1.y);
    ctx.stroke();
};

var savePath = function() {
    $.ajax({
        url: "ajax/mysql-db.php",
        method: "POST",
        datatype: "json",
        data: { 
            action: "save", 
            data: path //JSON.stringify(path)
        }
    })
    .done(function(data, status, xhr) {
        if (backgroundMode)
        console.log(data);
        ws.send("PAPER|"+playerId+"|path-update");
    });
};

var loadPath = function() {
    $.get("ajax/mysql-db.php", function(data, status, xhr) {
        path = [];
        var obj = JSON.parse(data);
        for (var n = 0; n < obj.length; n++) {
            var pos = { 
                x: obj[n].posX,
                y: obj[n].posY
            };
            path.push(pos);
        }
        showPath = true;
    });
};

var convert2d = function() {
     var result = {
         x: (sh/2)-(position.x * (sh/2)),
         y: (sw/2)-(position.y * (sw/2))
     };
     return result;
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