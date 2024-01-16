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

    matterJsView.ontouchend = function(e) {
        addBody(startX, startY, swipeLength);
    };

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "position-data") {
            var obj = JSON.parse(msg[3]);
            var scaleX = sw / obj.sw;
            var scaleY = sh / obj.sh;
            position.x = obj.x*scaleX;
            position.y = obj.y*scaleY;
        }
    };

    mic = new EasyMicrophone();
    mic.onsuccess = function() { 
        console.log("mic open");
    };
    mic.onupdate = function(freqArray, reachedFreq, avgValue) {
        micAvgValue = avgValue;

        for (var n = 0; n < bodyArr.length; n++) {
            var c = {
                x: bodyArr[n].body.position.x,
                y: bodyArr[n].body.position.y
            };
            var p = {
                x: c.x,
                y: c.y-(micAvgValue*(sw/gridSize))
            }
            var rp = _rotate2d(c, p, bodyArr[n].direction);

            if (reachedFreq > (n*5) && 
            reachedFreq <= ((n*5)+5))
            Body.setVelocity(bodyArr[n].body, {
                x: rp.x-c.x,
                y: rp.y-c.y
            });
        }
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

    createProfileView();

    motion = false;
    gyroUpdated = function(e) {
        engine.world.gravity.x = -(1/9.8)*e.accX;
        engine.world.gravity.y = (1/9.8)*e.accY;
    };

    resolution = 0;

    //animate();
    drawImage();

    matterJs();
});

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
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var offsetValue = 1;
var offsetOrder = [ 0, 0, 0, 0, 0 ];
var offsetNo = 0;

var offsetAngle = -(Math.PI/180);

var drawImage = function(alignmentOverlay=true) {
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

    resolutionCtx.restore();

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

    /*
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(position0.x, position0.y, ((sw/gridSize)/2), 
    0, (Math.PI*2));
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(position1.x, position1.y, ((sw/gridSize)/4), 
    0, (Math.PI*2));
    ctx.fill();*/

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
var colorName = [ "blue", "red", "green", "orange", "yellow" ];

var victoryRequirementsMet = false;
var bodyNo = 0;

// create two boxes and a ground
var addBody = function(x, y, offset) {
    var baseArea = Math.PI*Math.pow(((sw/gridSize)/2), 2);

    var polygonArr = [ 1, 0, 0 ];

    var size = (sw/gridSize);
    var area = Math.PI*Math.pow((size/2), 2);
    var min = (bodyArr.length*5);
    var max = ((bodyArr.length+1)*5);

    var polygon = 
    getPolygon(1, { x: x, y: y }, size);

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
        body: Bodies.fromVertices(x, y, polygon, {
            label: "body"+bodyNo,
            render: {
                fillStyle: "#fff",
                strokeStyle: "#fff" }}),
        audio: audio
    };

    obj.body.render.sprite.texture = 
    createTexture(1, size*2, colors[obj.no]);

    bodyArr.push(obj);
    obj.audio.play();

    Composite.add(engine.world, [ obj.body ]);
    bodyNo += 1;

    if (bodyArr.length > 1)
    victoryRequirementsMet = true;
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
sw/4-((sw/gridSize)/2), -140, 
(sw/2)-(sw/gridSize), 300,
{ isStatic: true,
    label: "ceiling",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var ceilingB = Bodies.rectangle(
sw-(sw/4-((sw/gridSize)/2)), -140, 
(sw/2)-(sw/gridSize), 300,
{ isStatic: true,
    label: "ceiling",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallA = Bodies.rectangle(
-140, (sh/4)-((sw/gridSize)/2), 300, ((sh/2)-(sw/gridSize)),
{ isStatic: true,
    label: "wallA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallA_lower = Bodies.rectangle(
-140, sh-((sh/4)-((sw/gridSize)/2)), 300, ((sh/2)-(sw/gridSize)),
{ isStatic: true,
    label: "wallA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallB = Bodies.rectangle(
sw+140, (sh/4)-((sw/gridSize)/2), 300, ((sh/2)-(sw/gridSize)),
{ isStatic: true,
    label: "wallB",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallB_lower = Bodies.rectangle(
sw+140, sh-((sh/4)-((sw/gridSize)/2)), 300, ((sh/2)-(sw/gridSize)),
{ isStatic: true,
    label: "wallA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var ground = Bodies.rectangle(
sw/4-((sw/gridSize)/2), sh+140, 
(sw/2)-(sw/gridSize), 300,
{ isStatic: true,
    label: "ground",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var groundB = Bodies.rectangle(
sw-(sw/4-((sw/gridSize)/2)), sh+140, 
(sw/2)-(sw/gridSize), 300,
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

            if (pairs[n].bodyA.label.includes("body"))
            sfxPool.play("audio/collision-sfx.wav");
            if (pairs[n].bodyB.label.includes("body"))
            sfxPool.play("audio/collision-sfx.wav");

            /*
            if (pairs[n].bodyA.label.includes("body") && 
            pairs[n].bodyB.label.includes("body"))
            combineBody(
            getBody(pairs[n].bodyA.label),
            getBody(pairs[n].bodyB.label));*/
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

                render.bounds.min.x = (c.x-(hyp*2));
                render.bounds.max.x = (c.x+(hyp*2));

                render.bounds.min.y = (c.y-((hyp*2)*r));
                render.bounds.max.y = (c.y+((hyp*2)*r));
            }
            else {
                engine.timing.timeScale = 1;

                render.bounds.min.x = 0;
                render.bounds.max.x = sw;

                render.bounds.min.y = 0;
                render.bounds.max.y = sh;
            }
        }
        else {
            engine.timing.timeScale = 1;

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

            Body.setVelocity(bodyArr[n].body, 
            {
                x: bodyArr[n].body.velocity.x-vn.x,
                y: bodyArr[n].body.velocity.y-vn.y
            });
        }

        if (bodyArr.length > 1)
        for (var n = 0; n < bodyArr.length; n++) {
            if (!bodyArr[n].visible) {
                console.log("removed "+bodyArr[n].body.label);
                say(colorName[bodyArr[n].no]+" eliminated");
                bodyArr[n].audio.pause();
                Composite.remove(engine.world, [ bodyArr[n].body ]);
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

                currentChampionship.state = "semifinal_2nd";
                currentChampionship.final = [
                    { ...search[0] }
                ];

                championshipPositionView.src = 
                drawChampionshipPosition();
                championshipView.style.display = "initial";
            }
            else if (currentChampionship.state == "semifinal_2nd") {
                var search = 
                currentChampionship.semifinal_2nd.toSorted((o) => {
                    return o.no == bodyArr[0].no ? -1 : 1;
                });
                search[1].active = false;

                currentChampionship.state = "final";
                currentChampionship.final.push({ ...search[0] });

                championshipPositionView.src = 
                drawChampionshipPosition();
                championshipView.style.display = "initial";
            }
            else if (currentChampionship.state == "final") {
                var search = 
                currentChampionship.final.toSorted((o) => {
                    return o.no == bodyArr[0].no ? -1 : 1;
                });
                search[1].active = false;

                currentChampionship.state = "over";;

                championshipPositionView.src = 
                drawChampionshipPosition();
                championshipView.style.display = "initial";
            }
            }
        }

        bodyArr = bodyArr.filter((o) => { return o.visible; });
    });

    // add all of the bodies to the world
    //Composite.add(engine.world, [ body0, body1 ]);

    Composite.add(engine.world, 
    [ceiling, wallA, wallB, ground, 
    ceilingB, wallA_lower, wallB_lower, groundB,
    //exitA, exitB, exitC, exitD,
    cornerA, cornerB, cornerC, cornerD]);

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