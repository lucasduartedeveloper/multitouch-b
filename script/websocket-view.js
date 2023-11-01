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
    $("html, body").css("background", backgroundColor);
    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");

    $("#title")[0].innerText = "";

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

    sendView = document.createElement("i");
    sendView.style.position = "absolute";
    sendView.className = "fa-solid fa-arrows-split-up-and-left";
    sendView.style.color = "#fff";
    sendView.style.lineHeight = (45)+"px";
    sendView.style.left = (sw-60)+"px";
    sendView.style.top = (sh-60)+"px";
    sendView.style.width = (50)+"px";
    sendView.style.height = (50)+"px";
    sendView.style.border = "1px solid #fff";
    sendView.style.borderRadius = "50%";
    sendView.style.zIndex = "15";
    document.body.appendChild(sendView);

    sendView.onclick = function() {
        var tier = Math.floor(Math.random()*10) == 9 ? 1 : 0;
        var rnd = 4;
            /*tier == 0 ? 
            Math.floor(Math.random()*(img_list.length-2)) : 
            (img_list.length-2)+Math.floor(Math.random()*2);*/

        //console.log(tier, rnd);

        var side = Math.floor(Math.random()*2);
        var speed = 1+Math.floor(Math.random()*5);

        var obj = {
            no: rnd,
            side: side,
            speed: speed
        };
        ws.send("PAPER|"+playerId+"|icon|"+JSON.stringify(obj));
    };

    countView = document.createElement("span");
    countView.style.position = "absolute";
    countView.innerText = "0";
    countView.style.color = "#fff";
    countView.style.lineHeight = (45)+"px";
    countView.style.left = (10)+"px";
    countView.style.top = (10)+"px";
    countView.style.width = (50)+"px";
    countView.style.height = (50)+"px";
    countView.style.transform = "rotateZ(90deg)";
    countView.style.zIndex = "15";
    document.body.appendChild(countView);

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "icon") {
            var data = JSON.parse(msg[3]);
            createIcon(data.no, data.side, data.speed);
        }
    };

    loadImages();
    animate();
});

var icons = [];
var createIcon = function(no, side, speed) {
    var obj = {
        no: no,
        img: img_list[no],
        side: side,
        speed: (side == 0 ? speed : -speed),
        position: { 
           x: (side == 0 ? (sw/3)+(sw/12) : ((sw/3)*2)-(sw/12)),
           y: (side == 0 ? 0 : sh)
       }
    };
    icons.push(obj);
};

var updateTime = 0;
var renderTime = 0;
var elapsedTime = 0;
var animationSpeed = 0;

var animate = function() {
    elapsedTime = new Date().getTime()-renderTime;
    if (!backgroundMode && imagesLoaded) {
        if ((new Date().getTime() - updateTime) > 1000) {
            updateTime = new Date().getTime();

            var w = Math.floor(Math.random()*2);
            var tier = Math.floor(Math.random()*10) == 9 ? 1 : 0;
            var rnd = 
                tier == 0 ? 
                Math.floor(Math.random()*(img_list.length-2)) : 
                (img_list.length-2)+Math.floor(Math.random()*2);

            //console.log(tier, rnd);

            var side = Math.floor(Math.random()*2);
            var speed = 1+Math.floor(Math.random()*5);

            var available = true;
            for (var n = 0; n < icons.length; n++) {
                if (icons[n].no == rnd)
                available = false;
            }

            if (w && available) {
                createIcon(rnd, side, speed);
            }
        }

        countView.innerText = icons.length;
        drawImage();
    }
    renderTime = new Date().getTime();
    requestAnimationFrame(animate);
};

var img_list = [
    "img/icons/icon-0.png",
    "img/icons/icon-1.png",
    "img/icons/icon-2.png",
    "img/icons/icon-3.png",
    "img/icons/icon-4.png",
    "img/icons/icon-5.png"
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
                //callback();
            }
        };
        var rnd = Math.random();
        img.src = img_list[n]+"?f="+rnd;
    }
};

var drawImage = function() {
    var ctx = imageView.getContext("2d");
    ctx.clearRect(0, 0, sw, sh);

    ctx.fillStyle = "#000";
    ctx.fillRect((sw/3), 0, (sw/3), sh);

    ctx.strokeStyle = "#fff";
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo((sw/2), 0);
    ctx.lineTo((sw/2), sh);
    ctx.stroke();

    for (var n = 0; n < icons.length; n++) {
        var r = icons[n].img.width / icons[n].img.height;
        var width = (sw/6);
        var height = width * r;

        ctx.save()
        ctx.translate(icons[n].position.x, 
        icons[n].position.y);

        if (icons[n].side == 0)
        ctx.rotate(-Math.PI);

        if (icons[n].side == 0) {
            //ctx.scale(1, -1);
            //ctx.translate(0, -sh);
        }

        ctx.drawImage(icons[n].img, 
        -(sw/12), -(height/2), 
        width, height);

        if (icons[n].side == 0)
        ctx.rotate(Math.PI);

        var x = -(sw/12);
        var y = -(height/2)

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(x-(sw/12), y+(height/4));
        ctx.lineTo(x-(sw/12), y-(height/4));
        ctx.lineTo(x+(sw/12), y-(height/4));
        ctx.lineTo(x+(sw/12), y+(height/4)+10);
        ctx.lineTo(x+(sw/12)-10, y+(height/4));
        ctx.lineTo(x-(sw/12), y+(height/4));
        //ctx.fill();
        ctx.restore();

        icons[n].position.y += icons[n].speed;

        for (var k = 0; k < icons.length; k++) {
            if (icons[n].side == icons[k].side && 
            Math.abs(icons[k].position.y - icons[n].position.y) < (sw/6)) {
                icons[n].speed = icons[k].speed;
            }
        }

        if (icons[n].position.y > sh+(height/2))
        icons.splice(n, 1);
        else if (icons[n].position.y < 0-(height/2))
        icons.splice(n, 1);
    }
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