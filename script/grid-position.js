var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

var sw = 360; //window.innerWidth;
var sh = 669; //window.innerHeight;

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

    startX0 = (sw/2);
    startY0 = (sw/2);
    moveX0 = (sw/2);
    moveY0 = (sw/2);

    startX1 = (sw/2);
    startY1 = (sw/2);
    moveX1 = (sw/2);
    moveY1 = (sw/2);

    swipeLength0 = 0;
    swipeLength1 = 0;

    ontouch0 = false;
    ontouch1 = false;

    color0 = "#fff";
    color1 = "#fff";

    matterJsView.ontouchstart = function(e) {
        if (squareEnabled) return;
        ontouchIteration = 0;

        if (e.touches.length == 1) {
            ontouch0 = true;

            var no = bodyArr.length == 0 ? 
            getNextAssembly() : getNextAssembly(bodyArr[0].no);

            color0 = colors[assemblyLine[no].clip];

            startX0 = e.touches[0].clientX;
            startY0 = e.touches[0].clientY;
            moveX0 = e.touches[0].clientX;
            moveY0 = e.touches[0].clientY;
        }

        if (e.touches.length > 1) {
            ontouch1 = true;

            var no = bodyArr.length == 0 ? 
            getNextAssembly(0) : getNextAssembly();

            color1 = colors[assemblyLine[no].clip];

            startX1 = e.touches[1].clientX;
            startY1 = e.touches[1].clientY;
            moveX1 = e.touches[1].clientX;
            moveY1 = e.touches[1].clientY;
        }

        if (currentChampionship.state == "ready" && 
            bodyArr.length == assemblyLine.length) {
            ontouch0 = false;
            ontouch1 = false;
        }
    };

    matterJsView.ontouchmove = function(e) {
        //console.log("move", e.touches);

        if (e.touches[0].identifier == 0) {
            moveX0 = e.touches[0].clientX;
            moveY0 = e.touches[0].clientY;

            var co = Math.abs(moveX0-startX0);
            var ca = Math.abs(moveY0-startY0);
            var hyp = Math.sqrt(
            Math.pow(co, 2)+
            Math.pow(ca, 2));

            swipeLength0 = (1/sw)*hyp;
        }

        if (e.touches.length > 1) {
            moveX1 = e.touches[1].clientX;
            moveY1 = e.touches[1].clientY;

            var co = Math.abs(moveX1-startX1);
            var ca = Math.abs(moveY1-startY1);
            var hyp = Math.sqrt(
            Math.pow(co, 2)+
            Math.pow(ca, 2));

            swipeLength1 = (1/sw)*hyp;
        }
    };

    multiplayerMode = false;
    matterJsView.ontouchend = function(e) {
        if (squareEnabled) return;

       console.log(e.touches.length,
       e.touches.length ? e.touches[0].identifier : 0);

        if ((e.touches.length > 0 && e.touches[0].identifier == 0) || 
            !ontouch1) {
            if (swipeLength0 < 0.5) return;
            ontouch0 = false;

            if (bodyArr.length == assemblyLine.length)
            return;

            var no = bodyArr.length == 0 ? 
            getNextAssembly() : getNextAssembly(bodyArr[0].no);

            var obj = assemblyLine[no];

            if (currentChampionship.state != "ready")
            launchItem(obj, 
            startX0, startY0, moveX0, moveY0, swipeLength0);
            else 
            launchItem(obj, 
            startX0, startY0, moveX0, moveY0, swipeLength0, true);
        }
        if ((e.touches.length > 0 && e.touches[0].identifier == 1) || 
            !ontouch0) {
            if (swipeLength1 < 0.5) return;
            ontouch1 = false;

            if (bodyArr.length == assemblyLine.length)
            return;

            var no = bodyArr.length == 0 ? 
            getNextAssembly() : getNextAssembly(bodyArr[0].no);

            var obj = assemblyLine[no];

            if (currentChampionship.state != "ready")
            launchItem(obj, 
            startX1, startY1, moveX1, moveY1, swipeLength1);
            else 
            launchItem(obj, 
            startX1, startY1, moveX1, moveY1, swipeLength1, true);
        }
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

        var frequency = reachedFreq > 50 ? 50 : 50;
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
            mic.open(false, 50);
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
        buttonPlaySquareView.style.display = 
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
    squareView.width = (sw-50);
    squareView.height = (sw-50);
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

    var path = [];

    squareView.ontouchstart = function(e) {
        path = [];
        pathArr[pathArr.length] = [];

        var x0 = e.touches[0].clientX-25;
        var y0 = e.touches[0].clientY-((sh/2)-((sw/2)-25));

        oscillatorX0 = (1/(sw-50))*(x0-(sw/2)-25);
        oscillatorY0 = -(1/(sw-50))*(y0-(sw/2)-25);

        var frequency = 50+(oscillatorY0*100);
        oscillator0.frequency.value = frequency;

        var pos = {
            x: x0,
            y: y0,
            frequency: frequency
        };
        path.push(pos);
        pathArr[pathArr.length-1] = path;

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
        var y0 = e.touches[0].clientY-((sh/2)-((sw/2)-25));

        oscillatorX0 = (1/(sw-50))*(x0-(sw/2)-25);
        oscillatorY0 = -(1/(sw-50))*(y0-(sw/2)-25);

        var frequency = 50+(oscillatorY0*100);
        oscillator0.frequency.value = frequency;

        var pos = {
            x: x0,
            y: y0,
            frequency: frequency
        };
        path.push(pos);
        pathArr[pathArr.length-1] = path;

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

        //pathArr.push(path);

        if (e.changedTouches[0].identifier == 0)
        oscillator0.frequency.value = 0;

        if (e.changedTouches[0].identifier == 1)
        oscillator1.frequency.value = 0;
    };

    buttonPlaySquareView = document.createElement("button");
    buttonPlaySquareView.style.position = "absolute";
    buttonPlaySquareView.style.display = 
    squareEnabled ? "initial" : "none";
    buttonPlaySquareView.style.color = "#000";
    buttonPlaySquareView.innerText = "play";
    buttonPlaySquareView.style.fontFamily = "Khand";
    buttonPlaySquareView.style.fontSize = "15px";
    buttonPlaySquareView.style.left = (25)+"px";
    buttonPlaySquareView.style.top = 
    ((sh/2)+((sw/2)-25)+10)+"px";
    buttonPlaySquareView.style.width = (100)+"px";
    buttonPlaySquareView.style.height = (25)+"px";
    buttonPlaySquareView.style.border = "1px solid white";
    buttonPlaySquareView.style.borderRadius = "25px";
    buttonPlaySquareView.style.zIndex = "15";
    document.body.appendChild(buttonPlaySquareView);

    currentPosition = 0;
    var playSquareInterval = 0;
    buttonPlaySquareView.onclick = function() {
        if (currentPosition > 0) {
             currentPosition = 0;
             oscillator0.frequency.value = 0;
             clearInterval(playSquareInterval);
             return;
        }

        playSquareInterval = setInterval(function() {
            var found = false;
            var distance = 0;
            for (var n = 0; n < pathArr.length; n++) {
                var path = pathArr[n];
                for (var k = 0; k < path.length; k++) {
                    if (distance+k == currentPosition) {
                        oscillator0.frequency.value = path[k].frequency;
                        found = true;
                        break;
                    }
                }
                distance += path.length;
                if (found) break;
            }

            if (!found) currentPosition = 0;
            else currentPosition += 1;
        }, 1000/60);
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
    accView.innerText = "acc Z: 0.00 / time scale: 1.00";
    accView.style.fontFamily = "Khand";
    accView.style.fontSize = "15px";
    accView.style.left = (10)+"px";
    accView.style.top = (sh-70)+"px";
    accView.style.width = (175)+"px";
    accView.style.height = (25)+"px";
    accView.style.border = "1px solid white";
    //accView.style.borderRadius = "25px";
    accView.style.zIndex = "15";
    document.body.appendChild(accView);

    config_timeScale = 1;
    accView.onclick = function() {
         motion = !motion;

         var value = prompt("Set timescale: ", config_timeScale);
         value = parseFloat(value);

         config_timeScale = value;
    };

    gyroUpdated = function(e) {
        accView.innerText = 
       "acc Z: "+e.accZ.toFixed(2)+
       " / time scale: "+engine.timing.timeScale.toFixed(2);
    };

    uiEnabled = true;
    uiView = document.createElement("span");
    uiView.style.position = "absolute";
    uiView.style.fontFamily = "Khand";
    uiView.style.fontSize = "15px";
    uiView.style.left = (sw-(sw/gridSize)-10)+"px";
    uiView.style.top = (45)+"px";
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

    leverAView = document.createElement("span");
    leverAView.style.position = "absolute";
    leverAView.style.fontFamily = "Khand";
    leverAView.style.fontSize = "15px";
    leverAView.style.left = ((sw/4)-((sw/gridSize)/2))+"px";
    leverAView.style.top = ((sh/4)-((sw/gridSize)/2))+"px";
    leverAView.style.width = (sw/gridSize)+"px";
    leverAView.style.height = (sw/gridSize)+"px";
    leverAView.style.border = "1px solid white";
    leverAView.style.zIndex = "15";
    //document.body.appendChild(leverAView);

    var offsetArr = [
        [ -1, 0 ],
        [ 0, -1 ],
        [ 1, 0 ],
        [ 0, 1 ]
    ];
    var leverA_offsetNo = 0;
    leverAView.onclick = function() {
        var offsetX = offsetArr[leverA_offsetNo][0];
        var offsetY = offsetArr[leverA_offsetNo][1];
        updateExits(offsetX, offsetY);
        leverA_offsetNo = (leverA_offsetNo+1) < offsetArr.length ?
        (leverA_offsetNo+1) : 0;
    };

    leverBView = document.createElement("span");
    leverBView.style.position = "absolute";
    leverBView.style.fontFamily = "Khand";
    leverBView.style.fontSize = "15px";
    leverBView.style.left = sw-((sw/4)+((sw/gridSize)/2))+"px";
    leverBView.style.top = sh-((sh/4)+((sw/gridSize)/2))+"px";
    leverBView.style.width = (sw/gridSize)+"px";
    leverBView.style.height = (sw/gridSize)+"px";
    leverBView.style.border = "1px solid white";
    leverBView.style.zIndex = "15";
    //document.body.appendChild(leverBView);

    var leverB_offsetNo = 0;
    leverBView.onclick = function() {
        var offsetX = offsetArr[leverB_offsetNo][0];
        var offsetY = offsetArr[leverB_offsetNo][1];
        updateExits(offsetX, offsetY, true);
        leverB_offsetNo = (leverB_offsetNo+1) < offsetArr.length ?
        (leverB_offsetNo+1) : 0;
    };

    waveView = document.createElement("canvas");
    waveView.style.position = "absolute";
    waveView.width = (sw-20);
    waveView.height = (25);
    waveView.style.left = (10)+"px";
    waveView.style.top = (sh-105)+"px";
    waveView.style.width = (sw-20)+"px";
    waveView.style.height = (25)+"px";
    waveView.style.zIndex = "15";
    //document.body.appendChild(waveView);

    fixedCamera2 = document.createElement("canvas");
    fixedCamera2.style.position = "absolute";
    //fixedCamera2.style.display = "none";
    fixedCamera2.style.width = (sw/3);
    fixedCamera2.style.height = (sw/3);
    fixedCamera2.style.left = (20) +"px";
    fixedCamera2.style.top = (sh-80-(sw/3))+"px";
    fixedCamera2.style.width = (sw/3)+"px";
    fixedCamera2.style.height = (sw/3)+"px";
    fixedCamera2.style.border = "1px solid #fff";
    fixedCamera2.style.zIndex = "15";
    document.body.appendChild(fixedCamera2);

    render2 = Render.create({
        engine: engine,
        canvas: fixedCamera2,
        options: {
            width: (sw/3),
            height: (sw/3),
            background: "#000",
            wireframes: false
            //showPerformance: true
        }
    });

    render2.options.hasBounds = true;

    // run the renderer
    Render.run(render2);

    createProfileView();
    drawImage();

    matterJs();
    animate();
});

var pathArr = [];

var drawSquare = function(freqArray) {
    var canvas = squareView;
    var ctx = canvas.getContext("2d");

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (var n = 0; n < pathArr.length; n++) {
        var path = pathArr[n];
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var k = 1; k < path.length; k++) {
            ctx.lineTo(path[k].x, path[k].y);
        }
        ctx.stroke();
    }

    ctx.fillStyle = "#5f5";

    var found = false;
    var distance = 0;
    for (var n = 0; n < pathArr.length; n++) {
        var path = pathArr[n];
        for (var k = 1; k < path.length; k++) {
            if (distance+k == currentPosition) {
                ctx.beginPath();
                ctx.arc(path[k].x, path[k].y, 2.5, 0, (Math.PI*2));
                ctx.fill();
                found = true;
                break;
            }
        }
        distance += path.length;
        if (found) break;
    }
};

var drawAB = function(freqArray) {
    var canvas = waveView;
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
    ctx.strokeStyle = "#5f5";
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

var lastTimescale = 1;
var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if ((new Date().getTime() - updateTime) > 1000) {
            updateTime = new Date().getTime();
        }
        drawSquare();
        drawAB(resumedWave);

        var timescale = 
        engine.timing.timeScale-
        (engine.timing.timeScale % 0.25);

        if (timescale != lastTimescale) { 
            drawImage(0, 10+(1-timescale)*20, 2+(timescale*3));

            lastTimescale = timescale;
        }
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var offsetValue = 1;
var offsetOrder = [ 0, 0, 0, 0, 0 ];
var offsetNo = 0;

var offsetAngle = -(Math.PI/180);

var drawImage = function(angle=0, grid=gridSize, line=5) {
    var ctx = pictureView.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, sw, sh);

    ctx.save();
    ctx.translate((sw/2), (sh/2));
    ctx.rotate(angle);
    ctx.translate(-(sw/2), -(sh/2));

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, sw, sh);

    ctx.strokeStyle = "#111";
    ctx.lineWidth = line;

    for (var y = 0; y < Math.floor((sh/(sw/grid))); y++) {
        ctx.beginPath();
        ctx.moveTo(0, y*(sw/grid));
        ctx.lineTo(sw, y*(sw/grid));
        ctx.stroke();
    }

    for (var x = 0; x <= grid; x++) {
        ctx.beginPath();
        ctx.moveTo(x*(sw/grid), 0);
        ctx.lineTo(x*(sw/grid), sh);
        ctx.stroke();
    }

    ctx.restore();

    //setShape(ctx);
    return;

    if (bodyArr.length > 0) {
        var position = { ...bodyArr[0].body.position };
        setShape_item(ctx, position.x, position.y);
    }

    if (bodyArr.length > 1) {
        var position = { ...bodyArr[1].body.position };
        setShape_item(ctx, position.x, position.y);
    }
};

var convertToZoom = function(pos) {
    render.bounds.min.x = (c.x-(hyp*2));
    render.bounds.max.x = (c.x+(hyp*2));

    render.bounds.min.y = (c.y-((hyp*2)*r));
    render.bounds.max.y = (c.y+((hyp*2)*r));
};

var setShape = function(ctx) {
    var size = sh;

    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    var centerCtx = canvas.getContext("2d");
    centerCtx.imageSmoothingEnabled = true;

    centerCtx.lineWidth = 0.5;
    centerCtx.strokeStyle = "#fff";

    for (var n = 0; n < 50 ; n++) {
        var radius = (1-((1/50)*n))*(size/2);
        centerCtx.save();
        centerCtx.beginPath();
        centerCtx.arc((size/2), (size/2), radius, 0, (Math.PI*2));
        //drawPolygon(centerCtx, 75, 75, radius);
        //centerCtx.stroke();
        centerCtx.clip();

        var scale = 1-(Math.curve((1/50)*n, 1)*0.25);
        //console.log(scale);

        centerCtx.drawImage(pictureView, 
        (sw/2)-((size/2)/scale), (sh/2)-((size/2)/scale),
        (size/scale), (size/scale),
        0, 0, size, size);

        centerCtx.restore();
    }

    ctx.drawImage(canvas, 
    (sw/2)-(size/2), (sh/2)-(size/2), size, size);
};

var setShape_item = function(ctx, x, y) {
    var size = (sw/gridSize)*2;

    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    var centerCtx = canvas.getContext("2d");
    centerCtx.imageSmoothingEnabled = true;

    centerCtx.lineWidth = 0.5;
    centerCtx.strokeStyle = "#fff";

    for (var n = 0; n < 50 ; n++) {
        var radius = (1-((1/50)*n))*(size/2);
        centerCtx.save();
        centerCtx.beginPath();
        centerCtx.arc((size/2), (size/2), radius, 0, (Math.PI*2));
        //drawPolygon(centerCtx, 75, 75, radius);
        //centerCtx.stroke();
        centerCtx.clip();

        var scale = 1-(Math.curve((1/50)*n, 1)*0.25);
        //console.log(scale);

        centerCtx.drawImage(pictureView, 
        (x)-((size/2)/scale), (y)-((size/2)/scale),
        (size/scale), (size/scale),
        0, 0, size, size);

        centerCtx.restore();
    }

    ctx.drawImage(canvas, 
    (x)-(size/2), (y)-(size/2), size, size);
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
    for (var n = 3; n < 8; n++) {
        var rp = _rotate2d(c, p, n*(120/10));
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
    for (var n = 3; n < 8; n++) {
        var rp = _rotate2d(c, p, 120+(n*(120/10)));
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
    for (var n = 3; n < 8; n++) {
        var rp = _rotate2d(c, p, 240+(n*(120/10)));
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
    else if (n == 5) {
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
        x: c.x+(size/10),
        y: c.y-(size/1.75)
    });
    polygon.push({
        x: c.x,
        y: c.y-(size/1.5)
    });
    polygon.push({
        x: c.x-(size/10),
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
        x: c.x-(size/10),
        y: c.y+(size/1.75)
    });
    polygon.push({
        x: c.x,
        y: c.y+(size/1.5)
    });
    polygon.push({
        x: c.x+(size/10),
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
    else if (n == 6) {
    var polygon = [];
    var c = { 
        x: pos.x,
        y: pos.y
    };
    var p = {
        x: c.x,
        y: c.y-(size/3)
    };
    polygon.push({
        x: c.x+(size/10),
        y: c.y-(size/1.75)
    });
    polygon.push({
        x: c.x,
        y: c.y-(size/1.5)
    });
    polygon.push({
        x: c.x-(size/10),
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
        x: c.x-(size/10),
        y: c.y+(size/1.75)
    });
    polygon.push({
        x: c.x,
        y: c.y+(size/1.5)
    });
    polygon.push({
        x: c.x+(size/10),
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
    else if (n == 7) {
    var polygon = [];
    var c = { 
        x: pos.x,
        y: pos.y
    };
    var p = {
        x: c.x,
        y: c.y-(size/3)
    };
    polygon.push({
        x: c.x+(size/10),
        y: c.y-(size/2.75)
    });
    polygon.push({
        x: c.x,
        y: c.y-(size/2.5)
    });
    polygon.push({
        x: c.x-(size/3),
        y: c.y-(size/2.5)
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, n*(180/50));
        polygon.push({
            x: rp.x,
            y: rp.y
        });
    }
    polygon.push({
        x: c.x-(size/10),
        y: c.y+(size/2.75)
    });
    polygon.push({
        x: c.x,
        y: c.y+(size/2.5)
    });
    polygon.push({
        x: c.x+(size/3),
        y: c.y+(size/2.5)
    });
    for (var n = 3; n < 48; n++) {
        var rp = _rotate2d(c, p, 180+(n*(180/50)));
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
            frictionAir: getAirFriction(1),
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

    Body.setAngularVelocity(obj.body, -obj.speed);

    Body.setVelocity(obj.body, { 
        x: vn.x*(sw/gridSize),
        y: vn.y*(sw/gridSize)
    });

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

var createDirectionTexture = function(direction, reverse) {
    var canvas = document.createElement("canvas");
    canvas.width = (sw/gridSize);
    canvas.height = (sw/gridSize);

    var size = (sw/gridSize);

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = !reverse ? "#5f5" : "#f55";
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

var lastCollisionTime = 0;

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
            //console.log(pairs[n].bodyA.label, pairs[n].bodyB.label);

            if (pairs[n].bodyA.label.includes("body") && 
                 pairs[n].bodyB.label.includes("body"))
                 lastCollisionTime = new Date().getTime();

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

                updateExits(offsetX, offsetY, false);
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

                updateExits(offsetX, offsetY, true);
            }

            var c = {
                x: (sw/2),
                y: (sh/2)
            };
            var p = {
                x: pairs[n].bodyA.position.x + 
                ((pairs[n].bodyB.position.x - 
                pairs[n].bodyA.position.x)/2),
                y: pairs[n].bodyA.position.y + 
                ((pairs[n].bodyB.position.y - 
                pairs[n].bodyA.position.y)/2)
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
            var volume = 0.5+r;
            volume = volume < 0 ? 0 : volume;

            if (pairs[n].bodyA.label.includes("body"))
            sfxPool.play("audio/collision-sfx.wav", volume*0.1);
            if (pairs[n].bodyB.label.includes("body"))
            sfxPool.play("audio/collision-sfx.wav", volume*0.1);

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

                    //console.log(vn);

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
            console.log(pairs[n].bodyA.label, pairs[n].bodyB.label);

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

        if (bodyArr.length > 0) {
            var rpm = 
            ((bodyArr[0].body.angularVelocity / Math.PI)*60);
            bodyArr[0].visible = Math.abs(rpm) > 2.5;
        }

        if (bodyArr.length > 1) {
            var rpm = 
            ((bodyArr[1].body.angularVelocity / Math.PI)*60);
            bodyArr[1].visible = Math.abs(rpm) > 2.5;
        }

        var ctx  = matterJsView.getContext("2d");

        if (ontouch0 || ontouch1)
        console.log(ontouch0, ontouch1);

        if (ontouch0) {
            var co = moveX0-startX0;
            var ca = moveY0-startY0;
            var a = _angle2d(co, ca)-(Math.PI);

            ctx.save();
            ctx.strokeStyle = color0;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(startX0, startY0);
            ctx.lineTo(moveX0, moveY0);
            ctx.stroke();

            ctx.restore();
        }

        if (ontouch1) {
            var co = moveX1-startX1;
            var ca = moveY1-startY1;
            var a = _angle2d(co, ca)-(Math.PI);

            ctx.save();
            ctx.strokeStyle = color1;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(startX1, startY1);
            ctx.lineTo(moveX1, moveY1);
            ctx.stroke();

            ctx.restore();
        }

        if (false && ncpuLaunchSettings0.active) {
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
                bodyArr[pairArr[0].no0].body.position.y)/2)
            };
            var hyp = pairArr[0].hyp;

            var lastCollisionTimeOffset = 
            new Date().getTime() - lastCollisionTime;

            if (lastCollisionTimeOffset < 5000 && 
                autoFocusEnabled && hyp < (sw/2)) {
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

                engine.timing.timeScale = config_timeScale;

                render.bounds.min.x = 0;
                render.bounds.max.x = sw;

                render.bounds.min.y = 0;
                render.bounds.max.y = sh;
            }
        }
        else if (bodyArr.length == 1) {
            var timeScale = config_timeScale;
            if (hasMotionSensor)
            timeScale = 1-((0.75/9.8)*
            (gyro.accZ < 0 ? -gyro.accZ : gyro.accZ));

            engine.timing.timeScale = timeScale;

            var c = {
                x: bodyArr[0].body.position.x,
                y: bodyArr[0].body.position.y
            };

            var renderScale = 
            timeScale < 1 ? 1+(1-timeScale) : timeScale;

            /*
            render.bounds.min.x = c.x-((2-renderScale)*(sw/2));
            render.bounds.max.x = c.x+((2-renderScale)*(sw/2));

            render.bounds.min.y = c.y-((2-renderScale)*(sh/2));
            render.bounds.max.y = c.y+((2-renderScale)*(sh/2));*/
        }

        for (var n = 0; n < bodyArr.length; n++) {
            if (bodyArr[n].body.position.x < -(150-((sw/gridSize)/2)) || 
            bodyArr[n].body.position.y < -(150-((sw/gridSize)/2)) || 
            bodyArr[n].body.position.x > 
            sw+(150+((sw/gridSize)/2)) || 
            bodyArr[n].body.position.y > 
            sh+(150+((sw/gridSize)/2)))
            bodyArr[n].visible = false;

            /*
            Body.setAngularVelocity(
            bodyArr[n].body, -bodyArr[n].speed);*/

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

            var scale = (1-((1-r)*0.1));
            var resetScale = 1+(1-bodyArr[n].scale);

            //console.log(bodyArr[n].scale, resetScale, scale);
            bodyArr[n].scale = scale;

            //Body.scale(bodyArr[n].body, resetScale, resetScale );
            //Body.scale(bodyArr[n].body, scale, scale );

            //bodyArr[n].body.render.sprite.xScale = (scale/2);
            //bodyArr[n].body.render.sprite.yScale = (scale/2);

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
            engine.timing.timeScale * 
            (((1/5)*bodyArr[n].body.angularVelocity) * 
            bodyArr[n].frequency);

            var volume = 0.5+r;
            volume = volume < 0 ? 0 : volume;

            bodyArr[n].oscillator.volume.gain.value = volume*0.1;
        }

        //if (bodyArr.length > 1)
        for (var n = 0; n < bodyArr.length; n++) {
            if (!bodyArr[n].visible) {
                //console.log("removed "+bodyArr[n].body.label);

                var rpm = 
                ((bodyArr[n].body.angularVelocity / Math.PI)*60);

                var text = Math.abs(rpm) > 2.5 ? 
                colorName[bodyArr[n].no]+" eliminated" : 
                colorName[bodyArr[n].no]+" got collapsed";

                say(text);
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

                //console.log(search);

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

            if (autoPlay) 
                /*
                var rnd = Math.floor(Math.random()*10);
                say("Championship interval" 
                (rnd == 0 ? ", get me water." : "..."));*/
                setTimeout(function() {
                championshipStartView.click();
            }, 5000);
        }

        bodyArr = bodyArr.filter((o) => { return o.visible; });
    });

    Matter.Events.on(engine, "afterUpdate", function (event) {
        if (bodyArr.length > 0) {
            // shop render 0
            var c = {
                x: bodyArr[0].body.position.x,
                y: bodyArr[0].body.position.y
            };

            render0.bounds.min.x = c.x-(sw/12);
            render0.bounds.max.x = c.x+(sw/12);

            render0.bounds.min.y = c.y-(sw/12);
            render0.bounds.max.y = c.y+(sw/12);

            var ctx = fixedCamera0.getContext("2d");

            ctx.fillStyle = "#fff";
            ctx.font = "10px sans serif";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            var rpm = 
            ((bodyArr[0].body.angularVelocity / Math.PI)*60);

            ctx.fillText(
            Math.abs(rpm).toFixed(3)+" RPM", 
            (sw/3)-5, 10);
        }

        if (bodyArr.length > 1) {
            // shop render 0
            var c = {
                x: bodyArr[1].body.position.x,
                y: bodyArr[1].body.position.y
            };

            render1.bounds.min.x = c.x-(sw/12);
            render1.bounds.max.x = c.x+(sw/12);

            render1.bounds.min.y = c.y-(sw/12);
            render1.bounds.max.y = c.y+(sw/12);

            var ctx = fixedCamera1.getContext("2d");

            ctx.fillStyle = "#fff";
            ctx.font = "10px sans serif";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            var rpm = 
            ((bodyArr[1].body.angularVelocity / Math.PI)*60);

            ctx.fillText(
            Math.abs(rpm).toFixed(3)+" RPM", 
            (sw/3)-5, 10);
        }
        else {
            var ctx = fixedCamera1.getContext("2d");

            ctx.lineWidth = 1;
            ctx.strokeStyle = "#fff";

            ctx.beginPath();
            ctx.moveTo(0, (sw/3));
            ctx.moveTo((sw/3), 0);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.moveTo((sw/3), (sw/3));
            ctx.stroke();
        }

        if (bodyArr.length > 1) {
            var bodyA = bodyArr[0].body;
            var bodyB = bodyArr[1].body;

            var c = {
                 x: bodyA.position.x,
                 y: bodyA.position.y
            };

            render2.bounds.min.x = c.x-(sw/12);
            render2.bounds.max.x = c.x+(sw/12);

            render2.bounds.min.y = c.y-(sw/6);
            render2.bounds.max.y = c.y;
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
            render: { visible: false }
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

var leverA_exit = -1;
var leverB_exit = -1;

var updateExits = function(offsetX, offsetY, reverse) {
    //console.log(offsetX, offsetY);

    if (Math.abs(offsetX) > Math.abs(offsetY)) 
        if ((!reverse && offsetX < 0) || 
            (reverse && offsetX > 0)) {
            if (!reverse) {
            leverA.render.sprite.texture = 
            createDirectionTexture(2);
            leverA_exit = 2;
            closeExits(leverB_exit);
            openExit(2);
            }
            else {
            leverB.render.sprite.texture = 
            createDirectionTexture(0, true);
            leverB_exit = 0;
            closeExits(leverA_exit);
            openExit(0);
            }
        }
        else {
            if (!reverse) {
            leverA.render.sprite.texture = 
            createDirectionTexture(0);
            leverA_exit = 0;
            closeExits(leverB_exit);
            openExit(0);
            }
            else {
            leverB.render.sprite.texture = 
            createDirectionTexture(2, true);
            leverB_exit = 2;
            closeExits(leverA_exit);
            openExit(2);
            }
        }
     else
        if ((!reverse && offsetY < 0) || 
            (reverse && offsetY > 0)) {
            if (!reverse) {
            leverA.render.sprite.texture = 
            createDirectionTexture(3);
            leverA_exit = 3;
            closeExits(leverB_exit);
            openExit(3);
            }
            else {
            leverB.render.sprite.texture = 
            createDirectionTexture(1, true);
            leverB_exit = 1;
            closeExits(leverA_exit);
            openExit(1);
            }
        }
        else {
            if (!reverse) {
            leverA.render.sprite.texture = 
            createDirectionTexture(1);
            leverA_exit = 1;
            closeExits(leverB_exit);
            openExit(1);
            }
            else {
            leverB.render.sprite.texture = 
            createDirectionTexture(3, true);
            leverB_exit = 3;
            closeExits(leverA_exit);
            openExit(3);
            }
        }
}

var openExit = function(no) {
    switch (no) {
        case 0:
             Body.setPosition(wallA, { 
                 x: wallA.position.x,
                 y: (sh/4)-(sw/gridSize)
            });
            Body.setPosition(wallA_lower, { 
                 x: wallA_lower.position.x,
                 y: sh-(sh/4)+(sw/gridSize)
            });
            break;
        case 1:
             Body.setPosition(ceiling, { 
                x: (sw/4)-(sw/gridSize),
                y: ceiling.position.y
            });
            Body.setPosition(ceilingB, { 
                x: sw-(sw/4)+(sw/gridSize),
                y: ceilingB.position.y
            });
            break;
        case 2:
            Body.setPosition(wallB, { 
                x: wallB.position.x,
                y: (sh/4)-(sw/gridSize)
            });
            Body.setPosition(wallB_lower, { 
                x: wallB_lower.position.x,
                y: sh-(sh/4)+(sw/gridSize)
            });
            break;
        case 3:
            Body.setPosition(ground, { 
                x: (sw/4)-(sw/gridSize),
                y: ground.position.y
            });
            Body.setPosition(groundB, { 
                x: sw-(sw/4)+(sw/gridSize),
                y: groundB.position.y
            });
            break;
    }
};

var closeExits = function(no=-2) {
    if (no == -2) {
        leverA.render.sprite.texture = "";
        leverB.render.sprite.texture = "";
    }

    if (no != 0) {
        Body.setPosition(wallA, { 
            x: wallA.position.x,
            y: (sh/4)
        });
        Body.setPosition(wallA_lower, { 
            x: wallA_lower.position.x,
            y: sh-(sh/4)
        });
    }
    if (no != 1) {
        Body.setPosition(ceiling, { 
            x: (sw/4),
            y: ceiling.position.y
        });
        Body.setPosition(ceilingB, { 
            x: sw-(sw/4),
            y: ceilingB.position.y
        });
    }
    if (no != 2) {
        Body.setPosition(wallB, { 
            x: wallB.position.x,
            y: (sh/4)
        });
        Body.setPosition(wallB_lower, { 
            x: wallB_lower.position.x,
            y: sh-(sh/4)
        });
    }
    if (no != 3) {
        Body.setPosition(ground, { 
            x: (sw/4),
            y: ground.position.y
        });
        Body.setPosition(groundB, { 
            x: sw-(sw/4),
            y: groundB.position.y
        });
    }
};

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