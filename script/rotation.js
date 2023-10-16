var beepDone = new Audio("audio/beep-done.wav");
var beepMilestone = new Audio("audio/beep-milestone.wav");

var bgmNo = 0;
var bgm = new Audio("audio/eletronic-0.wav");

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

    $("#title")[0].innerText = "";

    frameView = document.createElement("canvas");
    frameView.style.position = "absolute";
    frameView.width = (sw);
    frameView.height = (sh); 
    frameView.style.left = (0)+"px";
    frameView.style.top = (0)+"px";
    frameView.style.width = (sw)+"px";
    frameView.style.height = (sh)+"px"; 
    //frameView.style.scale = "0.9";
    frameView.style.zIndex = "15";
    document.body.appendChild(frameView);

    motion = true;
    gyroUpdated = function(gyro) {
        var accX = gyro.accX;
        var accY = gyro.accY;
        var accZ = gyro.accZ;
        var fangle_xy = _angle2d(accX, accY)*(180/Math.PI);
        var angle_xy = 
        ((Math.round(fangle_xy / (360/60))*(360/60))*
        (Math.PI/180)) - ((Math.PI/180)*180);

        var fangle_yz = _angle2d(accY, accZ)*(180/Math.PI);
        var angle_yz = 
        ((Math.round(-fangle_yz / (360/60))*(360/60))*
        (Math.PI/180)) + ((Math.PI/180)*90);

        if (!lockRotation) {
            angle_xy = angle_xy < 0 ? ((Math.PI*2) + angle_xy) :
            angle_xy;
            angle_yz = angle_yz < 0 ? ((Math.PI*2) + angle_yz) :
            angle_yz;
            angle = accX != 0 ? angle_xy : angle_yz;
        }
        else return;

        var completeCount = 0;
        for (var n = 0; n < milestones.length; n++) {
            if (angle_yz == milestones[n].value) {
                 //beepMilestone.play();
                 if (completeCount < 4)
                 milestones[n].done = true;
            }
            if (milestones[n].done)
            completeCount += 1;
        }
        if (completeCount == 4) {
            //beepDone.play();
        }
    };

    window.onclick = function() {
        lockRotation = !lockRotation;
    };

    loadImages();
    animate();
});

var imagesLoaded = false;
var img_list = [
    "img/img-0.png",
    "img/img-1.png"
];
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
                if (callback) callback();
            }
        };
        var rnd = Math.random();
        img.src = img_list[n]+"?f="+rnd;
    }
};

var milestones = [
    { value: 270*(Math.PI/180), done: false },
    { value: 180*(Math.PI/180), done: false },
    { value: 90*(Math.PI/180), done: false },
    { value: 0*(Math.PI/180), done: false }
];

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode) {
        if (new Date().getTime()-updateTime > 1000) {
            updateTime = new Date().getTime();
        }

        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var lockRotation = true;

var angle = 0;
var drawImage = function() {
     var ctx = frameView.getContext("2d");
     ctx.clearRect(0, 0, sw, sh);
     ctx.fillStyle = "#fff";
     ctx.fillRect(0, 0, sw, sh);

     ctx.lineWidth = 1;
     ctx.strokeStyle = "#888";

     ctx.save();
     ctx.translate((sw/2), (sh/2));
     ctx.rotate(angle);
     ctx.translate(-(sw/2), -(sh/2));

     ctx.beginPath();
     ctx.moveTo((sw/2), (sh/2)+50);
     ctx.lineTo((sw/2), (sh/2)-50);
     ctx.stroke();

     ctx.beginPath();
     ctx.moveTo((sw/2)-50, (sh/2));
     ctx.lineTo((sw/2)+50, (sh/2));
     ctx.stroke();

     if (imagesLoaded) {
         var r = (img_list[0].width/img_list[0].height);
         var width = 20;
         var height = (20/r);

         ctx.drawImage(img_list[0], 
         ((sw/2)-(width/2)), ((sh/2)-(height/2)),
         width, height);
     }

     ctx.restore();

     if (imagesLoaded) {
         var r = (img_list[1].width/img_list[1].height);
         var width = 100;
         var height = (100/r);

         ctx.drawImage(img_list[1], 
         ((sw/2)-(width/2)), ((sh/2)-250)-(height/2),
         width, height);
     }

     ctx.strokeStyle = "#000";
     var c = { x: (sw/2), y: (sh/2) };
     var p0 = { x: (sw/2), y: (sh/2)-75 };
     var p1 = { x: (sw/2), y: (sh/2)-55 };
     for (var n = 0; n < 60; n++) {
         var rp0 = _rotate2d(c, p0, n*(360/60));
         var rp1 = _rotate2d(c, p1, n*(360/60));
         ctx.beginPath();
         ctx.moveTo(rp0.x, rp0.y);
         ctx.lineTo(rp1.x, rp1.y);
         ctx.stroke();
     }

     ctx.fillStyle = "#000";
     ctx.fontSize = "20px";
     ctx.textAlign = "center";
     ctx.textBaseline = "middle";
     ctx.fillText((angle*(180/Math.PI)).toFixed(2)
     +"°", (sw/2), (sh/2)+100);
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