var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

var sw = window.innerWidth;
var sh = window.innerHeight;

var audioBot = true;
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
    $("#title")[0].innerText = ""; //"PICTURE DATABASE"; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    tileSize = (sw/7);

    pictureView = document.createElement("canvas");
    pictureView.style.position = "absolute";
    pictureView.style.background = "#fff";
    pictureView.width = (sw);
    pictureView.height = (sh); 
    pictureView.style.left = (0)+"px";
    pictureView.style.top = (0)+"px";
    pictureView.style.width = (sw)+"px";
    pictureView.style.height = (sh)+"px";
    pictureView.style.zIndex = "15";
    document.body.appendChild(pictureView);

    ontouch = false;
    pictureView.ontouchstart = function(e) {
        ontouchIteration = 0;
        ontouch = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        position0.x = startX;
        position0.y = startY;

        sendPosition(position0);
    };
    pictureView.ontouchmove = function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        position0.x = startX;
        position0.y = startY;

        sendPosition(position0);
    };
    pictureView.ontouchend = function(e) {
        ontouch = false;
    };

    matterJsView = document.createElement("canvas");
    matterJsView.style.position = "absolute";
    matterJsView.style.background = "#fff";
    matterJsView.width = sw;
    matterJsView.height = sh; 
    matterJsView.style.left = (0)+"px";
    matterJsView.style.top = (0)+"px";
    matterJsView.style.width = (sw)+"px";
    matterJsView.style.height = (sh)+"px";
    matterJsView.style.zIndex = "15";
    document.body.appendChild(matterJsView);

    startX = (sw/2);
    startY = (sw/2);
    moveX = (sw/2);
    moveY = (sw/2);

    swipeLength = 0;

    matterJsView.ontouchstart = function(e) {
        ontouchIteration = 0;
        ontouch = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    };

    matterJsView.ontouchmove = function(e) {
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;

        var co = Math.abs(moveX-startX);
        var ca = Math.abs(moveY-startY);
        var hyp = Math.sqrt(
        Math.pow(co, 2)+
        Math.pow(ca, 2));

        swipeLength = (1/sw)*hyp;
    };

    multiplayerMode = false;
    matterJsView.ontouchend = function(e) {
        ontouch = false;
        if (squareEnabled) return;

        if (multiplayerMode) {
            var obj = {
                x: startX, 
                y: startY, 
                offset: swipeLength,
                sw: sw,
                sh: sh,
                profileObj: profileToObj()
            };
            sendProfileObj(obj);
            return;
        }

        if (currentChampionship.state != "ready")
        launchItem(profileToObj(), 
        startX, startY, moveX, moveY, swipeLength);
        else
        addBody(startX, startY, moveX, moveY, swipeLength);
    };

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "position-data") {
            var obj = JSON.parse(msg[3]);
            var scaleX = sw / obj.sw;
            var scaleY = sh / obj.sh;

            var x = obj.x*scaleX;
            var y = obj.y*scaleY;
            var offset = obj.offset*((scaleX+scaleY)/2);

            launchItem(obj.profileObj, x, y, offset);
        }
    };

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        console.log("mic open");
    };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        micAvgValue = avgValue;

        resumedWave = resumeWave(freqArray);

        /*var frequency = (reachedFreq/2)*(24000/512);
        oscillator0.frequency.value = frequency;*/

        var frequency =reachedFreq > 50 ? 50: 50;
        oscillator0.frequency.value = frequency;
    };
    mic.onclose = function() { 
        console.log("mic closed");
    };
    var ab = new Array(50);
    for (var n = 0; n < 50; n++) {
        ab[n] = 0;
    }
    resumedWave = ab;

    buttonMicView = document.createElement("button");
    buttonMicView.style.position = "absolute";
    buttonMicView.style.color = "#000";
    buttonMicView.innerText = "mic: off";
    buttonMicView.style.fontFamily = "Khand";
    buttonMicView.style.fontSize = "15px";
    buttonMicView.style.left = (10)+"px";
    buttonMicView.style.top = (sh-35)+"px";
    buttonMicView.style.width = (100)+"px";
    buttonMicView.style.height = (25)+"px";
    buttonMicView.style.border = "1px solid white";
    buttonMicView.style.borderRadius = "25px";
    buttonMicView.style.zIndex = "15";
    document.body.appendChild(buttonMicView);

    buttonMicView.onclick = function() {
        if (mic.closed) {
            mic.open(false, 1);
            buttonMicView.innerText = "mic: on";
        }
        else {
            mic.close();
            buttonMicView.innerText = "mic: off";
        }
    };

    var squareEnabled = false;
    buttonSquareView = document.createElement("button");
    buttonSquareView.style.position = "absolute";
    buttonSquareView.style.color = "#000";
    buttonSquareView.innerText = 
    squareEnabled ? "hide square" : "show square";
    buttonSquareView.style.fontFamily = "Khand";
    buttonSquareView.style.fontSize = "15px";
    buttonSquareView.style.left = (sw-110)+"px";
    buttonSquareView.style.top = (10)+"px";
    buttonSquareView.style.width = (100)+"px";
    buttonSquareView.style.height = (25)+"px";
    buttonSquareView.style.border = "1px solid white";
    buttonSquareView.style.borderRadius = "25px";
    buttonSquareView.style.zIndex = "15";
    document.body.appendChild(buttonSquareView);

    oscillator0 = createOscillator();
    oscillator1 = createOscillator();

    buttonSquareView.onclick = function() {
        squareEnabled = !squareEnabled;
        buttonSquareView.innerText = 
        squareEnabled ? "hide square" : "show square";
        squareView.style.display = 
        squareEnabled ? "initial" : "none";

        if (squareEnabled) {
            oscillator0.start();
            oscillator1.start();
        }
        else {
            oscillator0.stop();
            oscillator1.stop();
        }
    };

    squareView = document.createElement("canvas");
    squareView.style.position = "absolute";
    squareView.style.display = 
    squareEnabled ? "initial" : "none";
    squareView.style.background = "#fff";
    squareView.style.fontFamily = "Khand";
    squareView.style.fontSize = "15px";
    squareView.style.left = ((sw/2)-((sw/2)-25))+"px";
    squareView.style.top = ((sh/2)-((sw/2)-25))+"px";
    squareView.style.width = (sw-50)+"px";
    squareView.style.height = (sw-50)+"px";
    squareView.style.border = "1px solid white";
    //squareView.style.borderRadius = "25px";
    squareView.style.zIndex = "15";
    document.body.appendChild(squareView);

    var oscillatorX0 = 0;
    var oscillatorY0 = 0;
    var oscillatorX1 = 0;
    var oscillatorY1 = 0;

    squareView.ontouchstart = function(e) {
        var x0 = e.touches[0].clientX-25;
        var y0 = e.touches[0].clientY-((sh-sw-50)/2);

        oscillatorX0 = (1/(sw-50))*(x0-(sw/2)-25);
        oscillatorY0 = -(1/(sw-50))*(y0-(sw/2)-25);

        var frequency = 50+(oscillatorY0*20);
        oscillator0.frequency.value = frequency;

        if (e.touches.length < 2) return;
        var x1 = e.touches[1].clientX-25;
        var y1 = e.touches[1].clientY-((sh-sw-50)/2);

        oscillatorX1 = (1/(sw-50))*(x1-(sw/2)-25);
        oscillatorY1 = -(1/(sw-50))*(y1-(sw/2)-25);

        var frequency = 100+(oscillatorY1*20);
        oscillator1.frequency.value = frequency;
    };

    squareView.ontouchmove = function(e) {
        var x0 = e.touches[0].clientX-25;
        var y0 = e.touches[0].clientY-((sh-sw-50)/2);

        oscillatorX0 = (1/(sw-50))*(x0-(sw/2)-25);
        oscillatorY0 = -(1/(sw-50))*(y0-(sw/2)-25);

        var frequency = 50+(oscillatorY0*20);
        oscillator0.frequency.value = frequency;

        if (e.touches.length < 2) return;
        var x1 = e.touches[1].clientX-25;
        var y1 = e.touches[1].clientY-((sh-sw-50)/2);

        oscillatorX1 = (1/(sw-50))*(x1-(sw/2)-25);
        oscillatorY1 = -(1/(sw-50))*(y1-(sw/2)-25);

        var frequency = 100+(oscillatorY1*20);
        oscillator1.frequency.value = frequency;
    };

    squareView.ontouchend = function(e) {
        console.log(e);

        if (e.changedTouches[0].identifier == 0)
        oscillator0.frequency.value = 0;

        if (e.changedTouches[0].identifier == 1)
        oscillator1.frequency.value = 0;
    };

    autoFocusEnabled = false;
    buttonAutoFocusView = document.createElement("button");
    buttonAutoFocusView.style.position = "absolute";
    buttonAutoFocusView.style.color = "#000";
    buttonAutoFocusView.innerText = !autoFocusEnabled ? 
    "focus: off" : "focus: auto";
    buttonAutoFocusView.style.fontFamily = "Khand";
    buttonAutoFocusView.style.fontSize = "15px";
    buttonAutoFocusView.style.left = (120)+"px";
    buttonAutoFocusView.style.top = (sh-35)+"px";
    buttonAutoFocusView.style.width = (100)+"px";
    buttonAutoFocusView.style.height = (25)+"px";
    buttonAutoFocusView.style.border = "1px solid white";
    buttonAutoFocusView.style.borderRadius = "25px";
    buttonAutoFocusView.style.zIndex = "15";
    document.body.appendChild(buttonAutoFocusView);

    buttonAutoFocusView.onclick = function() {
        autoFocusEnabled = !autoFocusEnabled;
        buttonAutoFocusView.innerText = !autoFocusEnabled ? 
        "focus: off" : "focus: auto";
    };

    buttonBonusView = document.createElement("button");
    buttonBonusView.style.position = "absolute";
    buttonBonusView.style.color = "#000";
    buttonBonusView.innerText = "add bonus";
    buttonBonusView.style.fontFamily = "Khand";
    buttonBonusView.style.fontSize = "15px";
    buttonBonusView.style.left = (230)+"px";
    buttonBonusView.style.top = (sh-35)+"px";
    buttonBonusView.style.width = (100)+"px";
    buttonBonusView.style.height = (25)+"px";
    buttonBonusView.style.border = "1px solid white";
    buttonBonusView.style.borderRadius = "25px";
    buttonBonusView.style.zIndex = "15";
    document.body.appendChild(buttonBonusView);

    buttonBonusView.onclick = function() {
        var x = 10+(sw/gridSize)+
        Math.floor(Math.random()*(sw-(sw/gridSize)-20));
        var y = 10+(sw/gridSize)+
        Math.floor(Math.random()*(sh-(sw/gridSize)-20));
        addBonus(x, y);
    };

    accView = document.createElement("span");
    accView.style.position = "absolute";
    accView.style.color = "#5f5";
    accView.innerText = "acc Z: 0.00";
    accView.style.fontFamily = "Khand";
    accView.style.fontSize = "15px";
    accView.style.left = (10)+"px";
    accView.style.top = (sh-70)+"px";
    accView.style.width = (100)+"px";
    accView.style.height = (25)+"px";
    accView.style.border = "1px solid white";
    //accView.style.borderRadius = "25px";
    accView.style.zIndex = "15";
    document.body.appendChild(accView);

    motion = true;
    gyroUpdated = function(e) {
        accView.innerText = "acc Z: "+e.accZ.toFixed(2);
    };

    uiEnabled = true;
    uiView = document.createElement("span");
    uiView.style.position = "absolute";
    uiView.style.fontFamily = "Khand";
    uiView.style.fontSize = "15px";
    uiView.style.left = ((sw/4)-((sw/gridSize)/2))+"px";
    uiView.style.top = ((sh/4)-((sw/gridSize)/2))+"px";
    uiView.style.width = (sw/gridSize)+"px";
    uiView.style.height = (sw/gridSize)+"px";
    uiView.style.border = "1px solid white";
    //accView.style.borderRadius = "25px";
    uiView.style.zIndex = "15";
    document.body.appendChild(uiView);

    uiView.onclick = function() {
        uiEnabled = !uiEnabled;
        if (uiEnabled) {
            eruda.init();
            uiView.style.border = "1px solid white";
            buttonMicView.style.display = "initial";
            buttonAutoFocusView.style.display = "initial";
            buttonBonusView.style.display = "initial";
            buttonSquareView.style.display = "initial";
            profileButtonView.style.display = "initial";
            championshipButtonView.style.display = "initial";
            accView.style.display = "initial";
        }
        else {
            eruda.destroy();
            uiView.style.border = "initial";
            buttonMicView.style.display = "none";
            buttonAutoFocusView.style.display = "none";
            buttonBonusView.style.display = "none";
            buttonSquareView.style.display = "none";
            profileButtonView.style.display = "none";
            championshipButtonView.style.display = "none";
            accView.style.display = "none";
        }
    };

    createProfileView();

    resolution = 0;

    drawImage();
    animate();

    matterJs();
});

var drawAB = function(freqArray) {
    var canvas = squareView;
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
            y0: (canvas.height/2)+
            (-freqArray[n]*25),
            y1: (canvas.height/2)+
            (freqArray[n]*25)
        };
        polygon.push(obj);
    }

    // draw waveform A
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    if (freqArray) {
        ctx.lineWidth = (canvas.width/freqArray.length)-2;
        for (var n = 0; n < polygon.length; n++) {
            ctx.beginPath();
            ctx.moveTo(polygon[n].x, polygon[n].y0-1);
            ctx.lineTo(polygon[n].x, polygon[n].y1+1);
            ctx.stroke();
        }
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

var gridSize = 10;

var direction0 = 270; //Math.floor(Math.random()*360);
var direction1 = 90; //Math.floor(Math.random()*360);

var c = {
   x: (sw/2),
   y: (sh/2)
};

var p = {
   x: c.x,
   y: c.y-((sw/gridSize)*2)
};

var position0 = { x: (sw/2)-(sw/gridSize), y: (sh/2) };
//_rotate2d(c, p, 0);
var position1 = { x: (sw/2)+(sw/gridSize), y: (sh/2) };
//_rotate2d(c, p, 0);

var gridPosition = {
    x: 0,
    y: (gridSize-1)
};

var sendPosition = function(pos) {
    var obj = {
        x: pos.x,
        y: pos.y,
        sw: sw,
        sh: sh
    };
    ws.send("PAPER|"+playerId+"|position-data|"+
    JSON.stringify(obj));
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
        drawAB(resumedWave);
        //drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var offsetValue = 1;
var offsetOrder = [ 0, 0, 0, 0, 0 ];
var offsetNo = 0;

var offsetAngle = -(Math.PI/180);

var drawImage = function(angle=0) {
    var ctx = pictureView.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, sw, sh);

    var resolutionCanvas = document.createElement("canvas");
    resolutionCanvas.width = 
    resolution == 0 ? sw : (8*resolution);
    resolutionCanvas.height = 
    resolution == 0 ? sw : (8*resolution);

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    ctx.save();
    ctx.translate((sw/2), (sh/2));
    ctx.rotate(angle);
    ctx.translate(-(sw/2), -(sh/2));

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, sw, sh);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    for (var y = 0; y < Math.floor((sh/(sw/gridSize))); y++) {
        ctx.beginPath();
        ctx.moveTo(0, y*(sw/gridSize));
        ctx.lineTo(sw, y*(sw/gridSize));
        ctx.stroke();
    }

    for (var x = 0; x <= gridSize; x++) {
        ctx.beginPath();
        ctx.moveTo(x*(sw/gridSize), 0);
        ctx.lineTo(x*(sw/gridSize), sh);
        ctx.stroke();
    }

    ctx.restore();

    ctx.drawImage(resolutionCanvas, 0, 0, sw, sw);
};

var clipTexture = function(url, size, callback) {
    var img = document.createElement("img");
    img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        var ctx = canvas.getContext("2d");
        var frame = {
            width: getSquare(this),
            height: getSquare(this)
        };
        var format = fitImageCover(this, frame);

        ctx.beginPath();
        ctx.arc((size/2), (size/2), (size/2), 0, (Math.PI*2));
        ctx.clip();

        ctx.drawImage(this,
        -format.left, -format.top, frame.width, frame.height,
        0, 0, size, size);

        callback(canvas.toDataURL());
    };
    img.src = url;
};

var createTexture = function(polygonNo, size, color) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    var polygon = 
    getPolygon(polygonNo, { x: (size/2), y: (size/2) }, (size/2));

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#555";
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (var n = 1; n < polygon.length; n++) {
        ctx.lineTo(polygon[n].x, polygon[n].y);
    }
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc((size/2), (size/2), (size/4.5), 0, (Math.PI*2));
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc((size/2), (size/2), (size/8), 0, (Math.PI*2));
    ctx.fill();

    ctx.fillStyle = color;
    ctx.fillRect(((size/2)-(size/20)), ((size/2)-(size/7.5)), 
    (size/10), (size/3.75));

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc((size/2), (size/2), (size/10), 0, (Math.PI*2));
    ctx.fill();

    return canvas.toDataURL();
};

var getPolygon = function(n, pos, size) {
    var polygon = [];

    if (n == 0) {
    var polygon = [];
    var c = { 
        x: pos.x,
        y: pos.y
    };
    var p = {
        x: c.x,
        y: c.y-(size/2)
    };
    for (var n = 0; n < 8; n++) {
        var rp = _rotate2d(c, p, n*(360/8));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    }
    else if (n == 1) {
    var polygon = [];
    var c = { 
        x: pos.x,
        y: pos.y
    };
    var p = {
        x: c.x,
        y: c.y-(size/2)
    };
    polygon.push({
        x: c.x,
        y: c.y-(size/1.75)
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, n*(180/50));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    polygon.push({
        x: c.x,
        y: c.y+(size/1.75)
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, 180+(n*(180/50)));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    }
    else if (n == 2) {
    var polygon = [];
    var c = { 
        x: pos.x,
        y: pos.y
    };
    var p = {
        x: c.x,
        y: c.y-(size/2)
    };
    polygon.push({
        x: c.x,
        y: c.y-(size/1.75)
    });
    polygon.push({
        x: c.x-(size/4),
        y: c.y-(size/1.75)
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, n*(180/50));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    polygon.push({
        x: c.x,
        y: c.y+(size/1.75)
    });
    polygon.push({
        x: c.x+(size/4),
        y: c.y+(size/1.75)
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, 180+(n*(180/50)));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    }
    else if (n == 3) {
    var polygon = [];
    var c = { 
        x: pos.x,
        y: pos.y
    };
    var p = {
        x: c.x,
        y: c.y-(size/2)
    };
    var p0 = {
        x: c.x,
        y: c.y-(size/1.75)
    };
    polygon.push({
        x: c.x,
        y: c.y-(size/1.75)
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, n*(120/50));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    var rp = _rotate2d(c, p0, 120);
    polygon.push({
        x: rp.x,
        y: rp.y
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, 120+(n*(120/50)));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    var rp = _rotate2d(c, p0, 240);
    polygon.push({
        x: rp.x,
        y: rp.y
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, 240+(n*(120/50)));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    }
    else if (n == 4) {
    var polygon = [];
    var c = { 
        x: pos.x,
        y: pos.y
    };
    var p = {
        x: c.x-(size/2),
        y: c.y-(size/2)
    };
    for (var n = 0; n < 4; n++) {
        var rp = _rotate2d(c, p, n*(360/4));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    }

    return polygon;
};

var getSquare = function(item) {
    var width = item.naturalWidth ? 
    item.naturalWidth : item.width;
    var height = item.naturalHeight ? 
    item.naturalHeight : item.height;

    return width < height ? width : height;
};

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var Body = Matter.Body;

// create an engine
var engine = Engine.create();

var bodyNo = 0;
var bodyArr = [];

var colors = [ "#77f", "#f77",  "#3f3", "#f80", "#ff5" ];

/*var colorName = [ 
    "Dragoon", 
    "Dranzer", 
    "Draciel", 
    "Driger", 
    "Galeon" 
];*/
var colorName = [ "blue", "red", "green", "orange", "yellow" ];

var victoryRequirementsMet = false;
var bodyNo = 0;

// create two boxes and a ground
var addBody = function(x, y, mx, my, offset) {
    var baseArea = Math.PI*Math.pow(((sw/gridSize)/2), 2);

    var polygonArr = [ 1, 0, 0 ];

    var size = (sw/gridSize);
    var area = Math.PI*Math.pow((size/2), 2);
    var min = (bodyArr.length*5);
    var max = ((bodyArr.length+1)*5);

    var dispatcher = 
    getDispatcherPath(
    profile.selectedDispatcher, { x: x, y: y }, (size*2));
    /*
    console.log(
        x, y, 
        dispatcher[dispatcher.length-1].x, 
        dispatcher[dispatcher.length-1].y
    );*/

    var polygon = 
    getPolygon(1, { 
        x: dispatcher[dispatcher.length-1].x, 
        y: dispatcher[dispatcher.length-1].y
    }, size);

    var oscillator = createOscillator();
    var frequency = 50+(offset*20);
    oscillator.frequency.value = frequency;

    var audio = new Audio("audio/spinning-sfx.wav");
    audio.loop = true;

    var obj = {
        no: getNextColor(),
        speed: (offset*5),
        visible: true,
        direction: Math.floor(Math.random()*360),
        size: size,
        area: area,
        min: min,
        max: max,
        frequencyLabel: [ ((1/baseArea)*area).toFixed(1), "Hz" ],
        body: Bodies.fromVertices(
            dispatcher[dispatcher.length-1].x, 
            dispatcher[dispatcher.length-1].y, polygon, {
            label: "body"+bodyNo,
            render: {
                fillStyle: "#fff",
                strokeStyle: "#fff" }}),
        frequency: frequency,
        oscillator: oscillator,
        audio: audio
    };

    var v = {
        x: x-mx,
        y: y-my
    }
    var vn = Math.normalize(v, offset);

    /*
    Body.setVelocity(obj.body, { 
        x: vn.x*(sw/gridSize),
        y: vn.y*(sw/gridSize)
    });*/

    obj.body.render.sprite.texture = 
    createTexture(1, size*2, colors[obj.no]);

    bodyArr.push(obj);
    obj.oscillator.start();
    //obj.audio.play();

    Composite.add(engine.world, [ obj.body ]);
    bodyNo += 1;

    if (bodyArr.length > 1)
    victoryRequirementsMet = true;
};

var addBonus = function(x, y) {
    var body = 
    Bodies.rectangle(x, y, ((sw/gridSize)/2), ((sw/gridSize)/2), {
        label: "attack-bonus",
        isSensor: true,
        render: {
            fillStyle: "rgba(0, 0, 0, 0)",
            strokeStyle: "#fff",
            lineWidth: 1
        }});

    Composite.add(engine.world, [ body ]);
};

var grid_angle = 0;
var rotateGrid = function() {
    if (bodyArr.length == 0) return;

    var co = bodyArr[0].body.position.x-(sw/2);
    var ca = bodyArr[0].body.position.y-(sh/2);
    grid_angle = _angle2d(co, ca)-(Math.PI/2);

    drawImage(grid_angle);
};

Matter.Render.startViewTransform = function(render) {
    var boundsWidth = 
    render.bounds.max.x - render.bounds.min.x,
        boundsHeight = render.bounds.max.y - render.bounds.min.y,
        boundsScaleX = boundsWidth / render.options.width,
        boundsScaleY = boundsHeight / render.options.height;

    // add lines:
    var w2 = render.canvas.width / 2;
    var h2 = render.canvas.height / 2;
    render.context.translate(w2, h2);
    render.context.rotate(grid_angle);
    render.context.translate(-w2, -h2);
    // /add lines.

    render.context.scale(1 / boundsScaleX, 1 / boundsScaleY);
    render.context.translate(-render.bounds.min.x, -render.bounds.min.y);
};

var getNextColor = function() {
    if (bodyArr.length == 0) return 0;

    var search = [];
    for (var n = 0; n < 5; n++) {
        search = bodyArr.filter((o) => { return o.no == n; });
        if (search.length == 0)
        return n;
    }
    return null;
};

var getBody = function(label) {
    var search = bodyArr.filter((o) => {
        return o.body.label == label;
    });

    //if (search.length > 0)
    return search[0];
};

var ceiling = Bodies.rectangle(
(sw/4), -140, 
(sw/2), 300,
{ isStatic: true,
    label: "ceiling",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var ceilingB = Bodies.rectangle(
(sw-(sw/4)), -140, 
(sw/2), 300,
{ isStatic: true,
    label: "ceiling",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallA = Bodies.rectangle(
-140, (sh/4), 300, 
((sh/2)),
//-140, (sh/4)-((sw/gridSize)/2), 300, ((sh/2)-(sw/gridSize)),
{ isStatic: true,
    label: "wallA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallA_lower = Bodies.rectangle(
-140, sh-((sh/4)), 300, 
((sh/2)),
//-140, sh-((sh/4)-((sw/gridSize)/2)), 300, ((sh/2)-(sw/gridSize)),
{ isStatic: true,
    label: "wallA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallB = Bodies.rectangle(
sw+140, (sh/4), 300, ((sh/2)),
{ isStatic: true,
    label: "wallB",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallB_lower = Bodies.rectangle(
sw+140, sh-((sh/4)), 300, ((sh/2)),
{ isStatic: true,
    label: "wallA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var ground = Bodies.rectangle(
(sw/4), sh+140, 
(sw/2), 300,
{ isStatic: true,
    label: "ground",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var groundB = Bodies.rectangle(
(sw-(sw/4)), sh+140, 
(sw/2), 300,
{ isStatic: true,
    label: "ground",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var exitA = Bodies.rectangle(
-40, (sh/2), 100, ((sw/gridSize)*2),
{ isStatic: true,
    label: "exitA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var exitB = Bodies.rectangle(
(sw/2), -40, ((sw/gridSize)*2), 100, 
{ isStatic: true,
    label: "exitB",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var exitC = Bodies.rectangle(
(sw+40), (sh/2), 100, ((sw/gridSize)*2),
{ isStatic: true,
    label: "exitC",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var exitD = Bodies.rectangle(
(sw/2), sh+40, ((sw/gridSize)*2), 100, 
{ isStatic: true,
    label: "exitD",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var cornerA = Bodies.rectangle(
-150, (sh+150), 300, 300,
{ isStatic: true,
    label: "cornerA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var cornerB = Bodies.rectangle(
-150, -150, 300, 300,
{ isStatic: true,
    label: "cornerB",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var cornerC = Bodies.rectangle(
(sw+150), -150, 300, 300,
{ isStatic: true,
    label: "cornerC",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var cornerD = Bodies.rectangle(
(sw+150), (sh+150), 300, 300, 
{ isStatic: true,
    label: "cornerD",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var leverA = Bodies.rectangle(
(sw/4), (sh/4), (sw/gridSize), (sw/gridSize),
{ isStatic: true,
    label: "leverA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var leverB = Bodies.rectangle(
sw-(sw/4), sh-(sh/4), (sw/gridSize), (sw/gridSize),
{ isStatic: true,
    label: "leverB",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var collisionFx = Bodies.circle(
(sw/2), (sh/2), ((sw/gridSize)/4),
{ isSensor: true,
    label: "collisionFx",
    render: {
         fillStyle: "#ffffff",
         strokeStyle: "#ffffff" }});

var createDirectionTexture = function(direction) {
    var canvas = document.createElement("canvas");
    canvas.width = (sw/gridSize);
    canvas.height = (sw/gridSize);

    var size = (sw/gridSize);

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "#fff";
    ctx.lineJoin = "round";
    ctx.lineWidth = size/10;

    ctx.save();
    ctx.translate((size/2), (size/2));
    ctx.rotate((direction-1)*(Math.PI/2));
    ctx.translate(-(size/2), -(size/2));

    ctx.beginPath();
    ctx.moveTo((size/2)-(size/5), (size/2.5));
    ctx.lineTo((size/2)-(size/5), (size/2.5));

    ctx.lineTo((size/2), (size/5));
    ctx.lineTo((size/2), size-(size/5));
    ctx.lineTo((size/2), (size/5));

    ctx.lineTo((size/2)+(size/5), (size/2.5));
    ctx.stroke();

    ctx.restore();

    return canvas.toDataURL();
};

function matterJs() {
    // create a renderer
    render = Render.create({
        engine: engine,
        canvas: matterJsView,
        options: {
            width: sw,
            height: sh,
            background: "transparent",
            wireframes: false
            //showPerformance: true
        }
    });

    //engine.timing.timeScale = 0.01;
    render.options.hasBounds = true;

    engine.world.gravity.y = 0;

    Matter.Events.on(engine, "collisionStart", function (event) {
        pairs = [ ...event.pairs ];
        //console.log(event);

        for (var n = 0; n < pairs.length; n++) {
            console.log(pairs[n].bodyA.label, pairs[n].bodyB.label);

            if (pairs[n].bodyA.label.includes("leverA") || 
                pairs[n].bodyB.label.includes("leverA")) {

                var body = pairs[n].bodyA.label.includes("body") ? 
                pairs[n].bodyA : pairs[n].bodyB;

                var p = {
                     x: leverA.position.x + 
                     ((body.position.x-leverA.position.x)/2),
                     y: leverA.position.y + 
                     ((body.position.y-leverA.position.y)/2)
                };

                var offsetX = (p.x - leverA.position.x);
                var offsetY = (p.y - leverA.position.y);

                openExit(offsetX, offsetY, false);
            }

            if (pairs[n].bodyA.label.includes("leverB") || 
                pairs[n].bodyB.label.includes("leverB")) {

                var body = pairs[n].bodyA.label.includes("body") ? 
                pairs[n].bodyA : pairs[n].bodyB;

                var p = {
                     x: leverB.position.x + 
                     ((body.position.x-leverB.position.x)/2),
                     y: leverB.position.y + 
                     ((body.position.y-leverB.position.y)/2)
                };

                var offsetX = (p.x - leverB.position.x);
                var offsetY = (p.y - leverB.position.y);

                engine.timing.timeScale = 0;

                openExit(offsetX, offsetY, true);
            }

            if (pairs[n].bodyA.label.includes("body"))
            sfxPool.play("audio/collision-sfx.wav");
            if (pairs[n].bodyB.label.includes("body"))
            sfxPool.play("audio/collision-sfx.wav");

            if (pairs[n].bodyA.label.includes("attack-bonus") || 
                pairs[n].bodyB.label.includes("attack-bonus")) {

                var attackBonus = 
                pairs[n].bodyA.label.includes("attack-bonus") ? 
                pairs[n].bodyA : pairs[n].bodyB;

                var bodyA = 
                pairs[n].bodyA.label.includes("body") ? 
                pairs[n].bodyA : pairs[n].bodyB;

                var bodyB;
                if (bodyArr.length > 1) {
                    bodyB = bodyArr[0].body.label != bodyA.label ? 
                    bodyArr[0].body : bodyArr[1].body;

                    var v = {
                        x: (bodyB.position.x - bodyA.position.x),
                        y: (bodyB.position.y - bodyA.position.y),
                    };
                    var vn = Math.normalize(v, 1);

                    console.log(vn);

                    Body.setVelocity(bodyA, {
                        x: vn.x*(sw/gridSize),
                        y: vn.y*(sw/gridSize)
                    });

                    Composite.remove(engine.world, [ attackBonus ]);
                }
            }
        }
    });

    Matter.Events.on(engine, "collisionActive", function (event) {
        pairs = [ ...event.pairs ];
        //console.log(event);

        for (var n = 0; n < pairs.length; n++) {
            //console.log(pairs[n].bodyA.label, pairs[n].bodyB.label);

            if (pairs[n].bodyA.label.includes("body")) {
                getBody(pairs[n].bodyA.label).direction = 
                Math.floor(Math.random()*360); 
            }
            if (pairs[n].bodyB.label.includes("body")) {
                getBody(pairs[n].bodyB.label).direction = 
                Math.floor(Math.random()*360);
            }
        }
    });

    Matter.Events.on(engine, "beforeUpdate", function (event) {
        //rotateGrid();

        var ctx  = matterJsView.getContext("2d");
        if (false && ontouch) {
            var co = moveX-startX;
            var ca = moveY-startY;
            var a = _angle2d(co, ca)-(Math.PI);

            ctx.drawImage(
            drawDispatcher(profile.selectedDispatcher, false, a), 
            startX-(sw/gridSize), startY-(sw/gridSize),
            (sw/gridSize)*2, (sw/gridSize)*2);

            ctx.save();
            ctx.strokeStyle = colors[getNextColor()];
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(moveX, moveY);
            ctx.stroke();

            ctx.restore();
        }

        if (false && cpuLaunchSettings0.active) {
            ctx.drawImage(
            drawDispatcher(
            cpuLaunchSettings0.dispatcher, false), 
            cpuLaunchSettings0.startX-(sw/gridSize), 
            cpuLaunchSettings0.startY-(sw/gridSize),
            (sw/gridSize)*2, (sw/gridSize)*2);

            ctx.save();
            ctx.strokeStyle = colors[cpuLaunchSettings0.clip];
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(
            cpuLaunchSettings0.startX, 
            cpuLaunchSettings0.startY);
            ctx.lineTo(
            cpuLaunchSettings0.moveX, 
            cpuLaunchSettings0.moveY);
            ctx.stroke();

            ctx.restore();
        }

        if (false && cpuLaunchSettings1.active) {
            ctx.drawImage(
            drawDispatcher(
            cpuLaunchSettings1.dispatcher, false), 
            cpuLaunchSettings1.startX-(sw/gridSize), 
            cpuLaunchSettings1.startY-(sw/gridSize),
            (sw/gridSize)*2, (sw/gridSize)*2);

            ctx.save();
            ctx.strokeStyle = colors[cpuLaunchSettings1.clip];
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(
            cpuLaunchSettings1.startX, 
            cpuLaunchSettings1.startY);
            ctx.lineTo(
            cpuLaunchSettings1.moveX, 
            cpuLaunchSettings1.moveY);
            ctx.stroke();

            ctx.restore();
        }

        var pairArr = [];

        if (bodyArr.length > 1) {
            for (var n = 0; n < (bodyArr.length-1); n++) {
            for (var k = 1; k < bodyArr.length; k++) {
                if (n == k) continue;
                var r = (sh/sw);

                var c = {
                    x: bodyArr[n].body.position.x+
                    ((bodyArr[k].body.position.x-
                    bodyArr[n].body.position.x)/2),
                    y: bodyArr[n].body.position.y+
                    ((bodyArr[k].body.position.y-
                    bodyArr[n].body.position.y)/2),
                };

                var co = Math.abs(
                bodyArr[k].body.position.x- bodyArr[n].body.position.x);
                var ca = Math.abs(
                bodyArr[k].body.position.y- bodyArr[n].body.position.y);

                var hyp = Math.sqrt(
                Math.pow(co, 2)+
                Math.pow(ca, 2));

                var obj = {
                    no0: n,
                    no1: k,
                    hyp: hyp
                };
                pairArr.push(obj);
            }
            }

            pairArr = pairArr.sort((a, b) => {
                return a.hyp < b.hyp ? -1 : 1;
            });

            var c = {
                x: bodyArr[pairArr[0].no0].body.position.x+
                ((bodyArr[pairArr[0].no1].body.position.x-
                bodyArr[pairArr[0].no0].body.position.x)/2),
                y: bodyArr[pairArr[0].no0].body.position.y+
                ((bodyArr[pairArr[0].no1].body.position.y-
                bodyArr[pairArr[0].no0].body.position.y)/2),
            };
            var hyp = pairArr[0].hyp;

            if (autoFocusEnabled && hyp < (sw/2)) {
                engine.timing.timeScale = 
                (1/(sw/2))*(hyp-((sw/gridSize)/1.05));

                bodyArr[pairArr[0].no0].oscillator.volume.gain.value = 
                1-engine.timing.timeScale;
                bodyArr[pairArr[0].no1].oscillator.volume.gain.value = 
                1-engine.timing.timeScale;

                render.bounds.min.x = (c.x-(hyp*2));
                render.bounds.max.x = (c.x+(hyp*2));

                render.bounds.min.y = (c.y-((hyp*2)*r));
                render.bounds.max.y = (c.y+((hyp*2)*r));
            }
            else {
                bodyArr[pairArr[0].no0].oscillator.volume.gain.value = 
                0.1;
                bodyArr[pairArr[0].no1].oscillator.volume.gain.value = 
                0.1;

                engine.timing.timeScale = 1;

                render.bounds.min.x = 0;
                render.bounds.max.x = sw;

                render.bounds.min.y = 0;
                render.bounds.max.y = sh;
            }
        }
        else {
            for (var n = 0; n < bodyArr.length; n++) {
                bodyArr[n].oscillator.volume.gain.value = 0.1;
            }

            //engine.timing.timeScale = 1;

            render.bounds.min.x = 0;
            render.bounds.max.x = sw;

            render.bounds.min.y = 0;
            render.bounds.max.y = sh;
        }

        for (var n = 0; n < bodyArr.length; n++) {
            if (bodyArr[n].body.position.x < -(150-((sw/gridSize)/2)) || 
            bodyArr[n].body.position.y < -(150-((sw/gridSize)/2)) || 
            bodyArr[n].body.position.x > 
            sw+(150+((sw/gridSize)/2)) || 
            bodyArr[n].body.position.y > 
            sh+(150+((sw/gridSize)/2)))
            bodyArr[n].visible = false;

            Body.setAngularVelocity(
            bodyArr[n].body, 
            -bodyArr[n].speed);

            var c = {
                x: (sw/2),
                y: (sh/2)
            };
            var p = {
                x: bodyArr[n].body.position.x,
                y: bodyArr[n].body.position.y
            };
            var v = {
                x: (p.x-c.x),
                y: (p.y-c.y)
            };

            var co = Math.abs(v.x);
            var ca = Math.abs(v.y);
            var hyp = Math.sqrt(
            Math.pow(co, 2)+
            Math.pow(ca, 2));

            var r = (1/(sw/2))*hyp;
            var rc = Math.curve(r, 1)
            *((1/5)*-bodyArr[n].body.angularVelocity);
            //console.log(rc);

            var vn = Math.normalize(v, rc);
            //console.log(vn);

            vn.x = vn.x * (1.5-bodyArr[n].body.mass);
            vn.y = vn.y * (1.5-bodyArr[n].body.mass);

            Body.setVelocity(bodyArr[n].body, 
            {
                x: bodyArr[n].body.velocity.x-vn.x,
                y: bodyArr[n].body.velocity.y-vn.y
            });

            bodyArr[n].oscillator.frequency.value = 
            (engine.timing.timeScale * bodyArr[n].frequency);
        }

        //if (bodyArr.length > 1)
        for (var n = 0; n < bodyArr.length; n++) {
            if (!bodyArr[n].visible) {
                console.log("removed "+bodyArr[n].body.label);
                say(colorName[bodyArr[n].no]+" eliminated");
                bodyArr[n].oscillator.stop();
                //bodyArr[n].audio.pause();

                if (bodyArr.length == 1 && 
                currentChampionship.state == "semifinal_2nd") {
                    var k = 
                    currentChampionship.semifinal_1st.findIndex((o) => {
                        return o.no == bodyArr[0].no;
                    });
                    currentChampionship.semifinal_1st[k].active = false;

                    currentChampionship.final[0].no = -1;
                    currentChampionship.final[0].active = false;
                    championshipPositionView.src = 
                    drawChampionshipPosition();
                }
                else if (bodyArr.length == 1 && 
                currentChampionship.state == "final") {
                    var k = 
                    currentChampionship.semifinal_2nd
                    .findIndex((o) => {
                        return o.no == bodyArr[0].no;
                    });
                    currentChampionship.semifinal_2nd[k].active = false;

                    currentChampionship.final[1].no = -1;
                    currentChampionship.final[1].active = false;

                    if (currentChampionship.final[0].no == -1) {
                        currentChampionship.state = "cancelled";
                        championshipStartView.innerText = 
                        "Receive $0,00";
                    }
                    else if (!currentChampionship.final[0].cpu) {
                        currentChampionship.state = "over";
                        championshipStartView.innerText = 
                        "Receive $"+(100+(championshipNo*25))
                        .toFixed(2).replace(".", ",");
                    }
                    else {
                        currentChampionship.state = "over";
                        championshipStartView.innerText = 
                        "Receive $0,00";
                    }
                }

                Composite.remove(engine.world, [ bodyArr[n].body ]);

                championshipPositionView.src = 
                drawChampionshipPosition();
            }
        }

        if (victoryRequirementsMet && bodyArr.length == 1) {
            say(colorName[bodyArr[0].no]+" wins");
            victoryRequirementsMet = false;

            if (currentChampionship.active) {
            if (currentChampionship.state == "semifinal_1st") {
                var search = 
                currentChampionship.semifinal_1st.toSorted((o) => {
                    return o.no == bodyArr[0].no ? -1 : 1;
                });
                search[1].active = false;

                if (currentChampionship.participants[search[0].no].cpu)
                skipChampionship();
                else  {
                    currentChampionship.state = "semifinal_2nd";
                    currentChampionship.final = [
                        { ...search[0] }
                    ];
                }

                if (currentChampionship.state == "over") {
                championshipStartView.innerText = "Receive $0,00";
                }
                else 
                championshipStartView.innerText = "Start";

                championshipPositionView.src = 
                drawChampionshipPosition();
                championshipView.style.display = "initial";

                currentChampionship.stateOpen = false;
            }
            else if (currentChampionship.state == "semifinal_2nd") {
                var search = 
                currentChampionship.semifinal_2nd.toSorted((o) => {
                    return o.no == bodyArr[0].no ? -1 : 1;
                });
                search[1].active = false;

                console.log(search);

                currentChampionship.state = "final";
                currentChampionship.final.push({ ...search[0] });

                championshipPositionView.src = 
                drawChampionshipPosition();
                championshipView.style.display = "initial";

                currentChampionship.stateOpen = false;
            }
            else if (currentChampionship.state == "final") {
                var search = 
                currentChampionship.final.toSorted((o) => {
                    return o.no == bodyArr[0].no ? -1 : 1;
                });
                search[1].active = false;

                currentChampionship.state = "over";

                if (!currentChampionship
                .participants[search[0].no].cpu)
                championshipStartView.innerText = 
                "Receive $"+(100+(championshipNo*25))
                .toFixed(2).replace(".", ",");
                else 
                championshipStartView.innerText = "Receive $0,00";

                championshipPositionView.src = 
                drawChampionshipPosition();
                championshipView.style.display = "initial";

                currentChampionship.stateOpen = false;
            }
            }
        }

        bodyArr = bodyArr.filter((o) => { return o.visible; });
    });

    Matter.Events.on(engine, "afterUpdate", function (event) {
        var pairArr = [];

        if (bodyArr.length > 1) {
            for (var n = 0; n < (bodyArr.length-1); n++) {
            for (var k = 1; k < bodyArr.length; k++) {
                if (n == k) continue;
                var r = (sh/sw);

                var c = {
                    x: bodyArr[n].body.position.x+
                    ((bodyArr[k].body.position.x-
                    bodyArr[n].body.position.x)/2),
                    y: bodyArr[n].body.position.y+
                    ((bodyArr[k].body.position.y-
                    bodyArr[n].body.position.y)/2),
                };

                var co = Math.abs(
                bodyArr[k].body.position.x- bodyArr[n].body.position.x);
                var ca = Math.abs(
                bodyArr[k].body.position.y- bodyArr[n].body.position.y);

                var hyp = Math.sqrt(
                Math.pow(co, 2)+
                Math.pow(ca, 2));

                var obj = {
                    no0: n,
                    no1: k,
                    hyp: hyp
                };
                pairArr.push(obj);
            }
            }

            pairArr = pairArr.sort((a, b) => {
                return a.hyp < b.hyp ? -1 : 1;
            });
        }
        else return;

        //console.log(pairArr);

        var ctx = matterJsView.getContext("2d");

        var c = {
            x: bodyArr[pairArr[0].no0].body.position.x+
            ((bodyArr[pairArr[0].no1].body.position.x-
            bodyArr[pairArr[0].no0].body.position.x)/2),
            y: bodyArr[pairArr[0].no0].body.position.y+
            ((bodyArr[pairArr[0].no1].body.position.y-
            bodyArr[pairArr[0].no0].body.position.y)/2),
        };
        var dir = 
        bodyArr[pairArr[0].no0].body.position.x < 
        bodyArr[pairArr[0].no1].body.position.x ? 
        1 : -1;
        var hyp = pairArr[0].hyp;
        var p = {
            x: c.x-(hyp*dir),
            y: bodyArr[pairArr[0].no0].body.position.y
        };

        var r = 
        Math.abs((bodyArr[pairArr[0].no1].body.position.x - 
        bodyArr[pairArr[0].no0].body.position.x)) / hyp;

        var co = 
        bodyArr[pairArr[0].no0].body.position.x - c.x;
        var ca = 
        bodyArr[pairArr[0].no0].body.position.y - c.y;
        var a0 = _angle2d(co, ca)*(180/Math.PI);

        var co = 
        bodyArr[pairArr[0].no1].body.position.x - c.x;
        var ca = 
        bodyArr[pairArr[0].no1].body.position.y - c.y;

        var a1 = _angle2d(co, ca)*(180/Math.PI);

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(c.x, c.y, 0.5, 0, (Math.PI*2));
        //ctx.fill();

        var diff = a1-a0;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        p.x = c.x+((p.x-c.x)*r);
        ctx.moveTo(p.x, p.y);
        for (var n = 0; n < 50; n++) {
            var rp = _rotate2d(c, p, n*(diff/50));
            rp.x = c.x+((rp.x-c.x)*r);

            ctx.lineTo(rp.x, rp.y);
        }
        //ctx.stroke();
    });

    // add all of the bodies to the world
    //Composite.add(engine.world, [ body0, body1 ]);

    Composite.add(engine.world, 
    [ ceiling, wallA, wallB, ground, 
    ceilingB, wallA_lower, wallB_lower, groundB,
    //exitA, exitB, exitC, exitD,
    cornerA, cornerB, cornerC, cornerD,
    leverA, leverB ]);

    var mouse = Matter.Mouse.create(render.canvas);
    var mouseConstraint = 
    Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            render: { visible: true }
        }
    });
    render.mouse = mouse;

    // add soft global constraint
    var constraints = [ mouseConstraint ];
    Composite.add(engine.world, constraints);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
}

var openExit = function(offsetX, offsetY, reverse) {
    console.log(offsetX, offsetY);

    if (Math.abs(offsetX) > Math.abs(offsetY)) 
        if (!reverse && offsetX < 0) {
            if (!reverse)
            leverA.render.sprite.texture = 
            createDirectionTexture(2);
            else 
            leverB.render.sprite.texture = 
            createDirectionTexture(0);
        }
        else {
            if (!reverse)
            leverA.render.sprite.texture = 
            createDirectionTexture(0);
            else 
            leverB.render.sprite.texture = 
            createDirectionTexture(2);
        }
     else
        if (!reverse && offsetY < 0) {
            if (!reverse)
            leverA.render.sprite.texture = 
            createDirectionTexture(3);
            else 
            leverB.render.sprite.texture = 
            createDirectionTexture(3);
        }
        else {
            if (!reverse)
            leverA.render.sprite.texture = 
            createDirectionTexture(1);
            else 
            leverB.render.sprite.texture = 
            createDirectionTexture(1);
        }

    if (Math.abs(offsetX) > Math.abs(offsetY)) 
        if (!reverse && offsetX < 0) {
            console.log("from left");
            Body.setPosition(wallB, { 
                x: wallB.position.x,
                y: (sh/4)-(sw/gridSize)
            });
            Body.setPosition(wallB_lower, { 
                x: wallB_lower.position.x,
                y: sh-(sh/4)+(sw/gridSize)
            });
            setTimeout(function() {
                Body.setPosition(wallB, { 
                     x: wallB.position.x,
                     y: (sh/4)
                });
                Body.setPosition(wallB_lower, { 
                     x: wallB_lower.position.x,
                     y: sh-(sh/4)
                });
            }, 2000);
        }
        else {
            console.log("from right");
            Body.setPosition(wallA, { 
                 x: wallA.position.x,
                 y: (sh/4)-(sw/gridSize)
            });
            Body.setPosition(wallA_lower, { 
                 x: wallA_lower.position.x,
                 y: sh-(sh/4)+(sw/gridSize)
            });
            setTimeout(function() {
                Body.setPosition(wallA, { 
                      x: wallA.position.x,
                      y: (sh/4)
                });
                Body.setPosition(wallA_lower, { 
                      x: wallA_lower.position.x,
                      y: sh-(sh/4)
                });
            }, 2000);
        }
    else
        if (!reverse && offsetY < 0) {
            console.log("from top");
            Body.setPosition(ground, { 
                x: (sw/4)-(sw/gridSize),
                y: ground.position.y
            });
            Body.setPosition(groundB, { 
                x: sw-(sw/4)+(sw/gridSize),
                y: groundB.position.y
            });
            setTimeout(function() {
                Body.setPosition(ground, { 
                    x: (sw/4),
                    y: ground.position.y
                });
                Body.setPosition(groundB, { 
                    x: sw-(sw/4),
                    y: groundB.position.y
                });
            }, 2000);
        }
        else {
            console.log("from bottom");
            Body.setPosition(ceiling, { 
                x: (sw/4)-(sw/gridSize),
                y: ceiling.position.y
            });
            Body.setPosition(ceilingB, { 
                x: sw-(sw/4)+(sw/gridSize),
                y: ceilingB.position.y
            });
            setTimeout(function() {
                Body.setPosition(ceiling, { 
                    x: (sw/4),
                    y: ceiling.position.y
                });
                Body.setPosition(ceilingB, { 
                    x: sw-(sw/4),
                    y: ceilingB.position.y
                });
            }, 2000);
        }
}

Math.curve = function(value, scale) {
    var c = {
        x: 0,
        y: 0
    };
    var p = {
        x: -1,
        y: 0
    };
    var rp = _rotate2d(c, p, (value*90));
    return rp.y*scale;
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