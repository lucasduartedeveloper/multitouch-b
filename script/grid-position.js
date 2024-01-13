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

    matterJsView = document.createElement("canvas");
    matterJsView.style.position = "absolute";
    matterJsView.style.background = "#fff";
    matterJsView.width = (sw);
    matterJsView.height = (sh); 
    matterJsView.style.left = (0)+"px";
    matterJsView.style.top = (0)+"px";
    matterJsView.style.width = (sw)+"px";
    matterJsView.style.height = (sh)+"px";
    matterJsView.style.zIndex = "15";
    document.body.appendChild(matterJsView);

    startX = (sw/2);
    startY = (sw/2);

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

        var c0 = {
            x: position0.x,
            y: position0.y
        };
        var p0 = {
            x: c0.x,
            y: c0.y-(micAvgValue*(sw/gridSize))
        }
        var rp0 = _rotate2d(c0, p0, direction0);

        if (reachedFreq <= 50)
        Body.setVelocity(body0, {
            x: rp0.x-c0.x,
            y: rp0.y-c0.y
        });

        var c1 = {
            x: position1.x,
            y: position1.y
        };
        var p1 = {
            x: c1.x,
            y: c1.y-(micAvgValue*(sw/gridSize))
        }
        var rp1 = _rotate2d(c1, p1, direction1);

        if (reachedFreq > 50 && reachedFreq <= 100)
        Body.setVelocity(body1, {
            x: rp1.x-c1.x,
            y: rp1.y-c1.y
        });

        var c2 = {
            x: position2.x,
            y: position2.y
        };
        var p2 = {
            x: c2.x,
            y: c2.y-(micAvgValue*(sw/gridSize))
        }
        var rp2 = _rotate2d(c2, p2, direction2);

        if (reachedFreq > 100 && reachedFreq <= 150)
        Body.setVelocity(body2, {
            x: rp2.x-c2.x,
            y: rp2.y-c2.y
        });

        var c3 = {
            x: position3.x,
            y: position3.y
        };
        var p3 = {
            x: c3.x,
            y: c3.y-(micAvgValue*(sw/gridSize))
        }
        var rp3 = _rotate2d(c3, p3, direction3);

        if (reachedFreq > 150 && reachedFreq <= 175)
        Body.setVelocity(body3, {
            x: rp3.x-c3.x,
            y: rp3.y-c3.y
        });

        var c4 = {
            x: position1.x,
            y: position1.y
        };
        var p4 = {
            x: c4.x,
            y: c4.y-(micAvgValue*(sw/gridSize))
        }
        var rp4 = _rotate2d(c4, p4, direction4);

        if (reachedFreq > 175)
        Body.setVelocity(body4, {
            x: rp4.x-c4.x,
            y: rp4.y-c4.y
        });
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

    resolution = 0;

    //animate();
    drawImage();

    matterJs();
});

var gridSize = 10;

var direction0 = 0; //Math.floor(Math.random()*360);
var direction1 = 0; //Math.floor(Math.random()*360);
var direction2 = 0; //Math.floor(Math.random()*360);
var direction3 = 0; //Math.floor(Math.random()*360);
var direction4 = 0; //Math.floor(Math.random()*360);

var c = {
   x: (sw/2),
   y: (sh/2)
};

var p = {
   x: c.x,
   y: c.y-((sw/gridSize)*2)
};

var position0 = { x: ((sw/2)-(sw/gridSize)*4), y: (sh/2) };
//_rotate2d(c, p, 0);
var position1 = { x: ((sw/2)-(sw/gridSize)*2), y: (sh/2) };
//_rotate2d(c, p, (360/5));
var position2 = { x: (sw/2), y: (sh/2) };
//_rotate2d(c, p, 2*(360/5));
var position3 = { x: ((sw/2)+(sw/gridSize)*2), y: (sh/2) };
//_rotate2d(c, p, 3*(360/5));
var position4 = { x: ((sw/2)+(sw/gridSize)*4), y: (sh/2) };
//_rotate2d(c, p, 4*(360/5));

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

var createTexture = function(text, size) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.font = size+"px sans serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, (size/2), (size/2));

    return canvas.toDataURL();
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

// create two boxes and a ground
var body0 = 
Bodies.rectangle(position0.x, position0.y, 
    (sw/gridSize), ((sw/gridSize)*2), {
    label: "body0",
    render: {
        fillStyle: "#fff",
        strokeStyle: "#fff" }});

var body1 = 
Bodies.rectangle(position1.x, position1.y, 
    (sw/gridSize), ((sw/gridSize)*2), {
    label: "body1",
    render: {
        fillStyle: "#fff",
        strokeStyle: "#fff" }});

var body2 = 
Bodies.rectangle(position2.x, position2.y, 
    (sw/gridSize), ((sw/gridSize)*2), {
    label: "body2",
    render: {
        fillStyle: "#fff",
        strokeStyle: "#fff" }});

var body3 = 
Bodies.rectangle(position3.x, position3.y, 
    (sw/gridSize), ((sw/gridSize)*2), {
    label: "body3",
    render: {
        fillStyle: "#fff",
        strokeStyle: "#fff" }});

var body4 = 
Bodies.rectangle(position4.x, position4.y, 
    (sw/gridSize), ((sw/gridSize)*2), {
    label: "body0",
    render: {
        fillStyle: "#fff",
        strokeStyle: "#fff" }});

var ceiling = Bodies.rectangle(sw/2, -40, sw, 100,
{ isStatic: true,
    label: "ceiling",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallA = Bodies.rectangle(-40, sh/2, 100, sh,
{ isStatic: true,
    label: "wallA",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});
    
var wallB = Bodies.rectangle(sw+40, sh/2, 100, sh, 
{ isStatic: true,
    label: "wallB",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallC = Bodies.rectangle(
((sw/4)-((sw/gridSize)/2)+5), sh/2, 
((sw/2)-(sw/gridSize)-10), 20,
{ isStatic: true,
    label: "wallC",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var wallD = Bodies.rectangle(
(sw-(sw/4)+((sw/gridSize)/2)-5), sh/2, 
((sw/2)-(sw/gridSize)-10), 20,
{ isStatic: true,
    label: "wallD",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

var ground = Bodies.rectangle(sw/2, sh+40, sw, 100,
{ isStatic: true,
    label: "ground",
    render: {
         fillStyle: '#2f2e40',
         strokeStyle: '#2f2e40' }});

function matterJs() {
    // create a renderer
    var render = Render.create({
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

    engine.world.gravity.y = 0;

    Matter.Events.on(engine, "collisionActive", function (event) {
        pairs = [ ...event.pairs ];
        //console.log(event);

        for (var n = 0; n < pairs.length; n++) {
            //console.log(pairs[n].bodyA.label, pairs[n].bodyB.label);

            if (pairs[n].bodyA.label == "body0")
            direction0 = Math.floor(Math.random()*360);
            if (pairs[n].bodyA.label == "body1")
            direction1 = Math.floor(Math.random()*360);
            if (pairs[n].bodyA.label == "body2")
            direction2 = Math.floor(Math.random()*360);
            if (pairs[n].bodyA.label == "body3")
            direction3 = Math.floor(Math.random()*360);
        }
    });

    Matter.Events.on(engine, "beforeUpdate", function (event) {
        Body.setAngle(body0, direction0*-(Math.PI/180));
        Body.setAngle(body1, direction1*-(Math.PI/180));
        Body.setAngle(body2, direction2*-(Math.PI/180));
        Body.setAngle(body3, direction3*-(Math.PI/180));
        Body.setAngle(body4, direction4*-(Math.PI/180));

        Body.setAngularVelocity(body0, 0);
        Body.setAngularVelocity(body1, 0);
        Body.setAngularVelocity(body2, 0);
        Body.setAngularVelocity(body3, 0);
        Body.setAngularVelocity(body4, 0);
    });

    // add all of the bodies to the world
    Composite.add(engine.world,
    [ body0, body1, body2, body3, body4 ]);

    Composite.add(engine.world, 
    [ceiling, wallA, wallB, ground]);

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