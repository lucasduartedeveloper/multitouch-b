var profile = {
    balance: 0,
    selectedTop: 0,
    selectedMid: 1,
    selectedClip: 0
};

var profileToObj = function() {
    var obj = {
        top: profile.selectedTop,
        mid: profile.selectedMid,
        clip: profile.selectedClip,
    };
    return obj;
};

var createProfileView = function() {
    profileButtonView = document.createElement("i");
    profileButtonView.style.position = "absolute";
    profileButtonView.style.background = "#fff";
    profileButtonView.style.color = "#000";
    profileButtonView.className = "fa-solid fa-store";
    profileButtonView.style.fontSize = "25px";
    profileButtonView.style.lineHeight = "50px";
    profileButtonView.style.left = (10)+"px";
    profileButtonView.style.top = (10)+"px";
    profileButtonView.style.width = (50)+"px";
    profileButtonView.style.height = (50)+"px";
    profileButtonView.style.border = "1px solid white";
    profileButtonView.style.borderRadius = "25px";
    profileButtonView.style.zIndex = "15";
    document.body.appendChild(profileButtonView);

    profileButtonView.onclick = function() {
        if (currentChampionship.state != "ready") return;
        profileView.style.display = "initial";
    };

    championshipButtonView = document.createElement("i");
    championshipButtonView.style.position = "absolute";
    championshipButtonView.style.background = "#fff";
    championshipButtonView.style.color = "#000";
    championshipButtonView.className = "fa-solid fa-trophy";
    championshipButtonView.style.fontSize = "25px";
    championshipButtonView.style.lineHeight = "50px";
    championshipButtonView.style.left = (70)+"px";
    championshipButtonView.style.top = (10)+"px";
    championshipButtonView.style.width = (50)+"px";
    championshipButtonView.style.height = (50)+"px";
    championshipButtonView.style.border = "1px solid white";
    championshipButtonView.style.borderRadius = "25px";
    championshipButtonView.style.zIndex = "15";
    document.body.appendChild(championshipButtonView);

    championshipButtonView.onclick = function() {
        if (currentChampionship.stateOpen) return;
        championshipView.style.display = "initial";
    };

    championshipView = document.createElement("div");
    championshipView.style.position = "absolute";
    championshipView.style.background = "#fff";
    championshipView.style.display = "none";
    championshipView.style.left = (10)+"px";
    championshipView.style.top = (10)+"px";
    championshipView.style.width = (sw-20)+"px";
    championshipView.style.height = (300)+"px";
    championshipView.style.border = "1px solid white";
    //championshipView.style.borderRadius = "25px";
    championshipView.style.zIndex = "15";
    document.body.appendChild(championshipView);

    championshipPositionView = 
    document.createElement("img");
    championshipPositionView.style.position = "absolute";
    championshipPositionView.style.background = "#fff";
    championshipPositionView.style.left = (120)+"px";
    championshipPositionView.style.top = (10)+"px";
    championshipPositionView.style.width = (sw-150)+"px";
    championshipPositionView.style.height = (280)+"px";
    championshipPositionView.style.border = "1px solid white";
    //championshipView.style.borderRadius = "25px";
    championshipPositionView.src = 
    drawChampionshipPosition();
    championshipPositionView.style.zIndex = "15";
    championshipView.appendChild(championshipPositionView);

    championshipNoView = document.createElement("span");
    championshipNoView.style.position = "absolute";
    championshipNoView.style.color = "#000";
    championshipNoView.innerText = 
    "Championship #"+championshipNo;
    championshipNoView.style.fontFamily = "Khand";
    championshipNoView.style.fontSize = "15px";
    championshipNoView.style.fontWeight = 900;
    championshipNoView.style.left = (10)+"px";
    championshipNoView.style.top = (10)+"px";
    championshipNoView.style.width = (100)+"px";
    championshipNoView.style.height = (20)+"px";
    championshipNoView.style.border = "1px solid white";
    //championshipView.style.borderRadius = "25px";
    championshipNoView.style.zIndex = "15";
    championshipView.appendChild(championshipNoView);

    championshipTimeView = document.createElement("span");
    championshipTimeView.style.position = "absolute";
    championshipTimeView.style.color = "#000";
    championshipTimeView.innerText = "00:00";
    championshipTimeView.style.fontFamily = "Khand";
    championshipTimeView.style.fontSize = "15px";
    championshipTimeView.style.fontWeight = 900;
    championshipTimeView.style.left = (10)+"px";
    championshipTimeView.style.top = (30)+"px";
    championshipTimeView.style.width = (100)+"px";
    championshipTimeView.style.height = (20)+"px";
    championshipTimeView.style.border = "1px solid white";
    //championshipView.style.borderRadius = "25px";
    championshipTimeView.style.zIndex = "15";
    championshipView.appendChild(championshipTimeView);

    championshipPrizeView = document.createElement("span");
    championshipPrizeView.style.position = "absolute";
    championshipPrizeView.style.color = "#000";
    championshipPrizeView.innerText = "$ "+
    (100+(championshipNo*25)).toFixed(2).replace(".",",");
    championshipPrizeView.style.fontFamily = "Khand";
    championshipPrizeView.style.fontSize = "15px";
    championshipPrizeView.style.fontWeight = 900;
    championshipPrizeView.style.left = (10)+"px";
    championshipPrizeView.style.top = (70)+"px";
    championshipPrizeView.style.width = (100)+"px";
    championshipPrizeView.style.height = (20)+"px";
    championshipPrizeView.style.border = "1px solid white";
    //championshipView.style.borderRadius = "25px";
    championshipPrizeView.style.zIndex = "15";
    championshipView.appendChild(championshipPrizeView);

    championshipStartView = document.createElement("span");
    championshipStartView.style.position = "absolute";
    championshipStartView.style.color = "#000";
    championshipStartView.innerText = "Start";
    championshipStartView.style.fontFamily = "Khand";
    championshipStartView.style.fontSize = "15px";
    championshipStartView.style.lineHeight = "40px";
    championshipStartView.style.fontWeight = 900;
    championshipStartView.style.left = (10)+"px";
    championshipStartView.style.top = (250)+"px";
    championshipStartView.style.width = (100)+"px";
    championshipStartView.style.height = (40)+"px";
    championshipStartView.style.border = "1px solid #000";
    //championshipView.style.borderRadius = "25px";
    championshipStartView.style.zIndex = "15";
    championshipView.appendChild(championshipStartView);

    championshipLabelView = document.createElement("span");
    championshipLabelView.style.position = "absolute";
    championshipLabelView.style.display = "none";
    championshipLabelView.style.color = "#fff";
    championshipLabelView.innerText = "3";
    championshipLabelView.style.textAlign = "center";
    championshipLabelView.style.fontFamily = "Khand";
    championshipLabelView.style.fontSize = "100px";
    championshipLabelView.style.lineHeight = "100px";
    championshipLabelView.style.fontWeight = 900;
    championshipLabelView.style.left = ((sw/2)-(150))+"px";
    championshipLabelView.style.top = ((sh/2)-(50))+"px";
    championshipLabelView.style.width = (300)+"px";
    championshipLabelView.style.height = (100)+"px";
    //championshipLabelView.style.border = "1px solid #000";
    //championshipView.style.borderRadius = "25px";
    championshipLabelView.style.zIndex = "15";
    document.body.appendChild(championshipLabelView);

    var stateInterval = 0;
    var startState = function() {
        currentChampionship.stateOpen = false;
        championshipLabelView.innerText = "";

        for (var n = 0; n < bodyArr.length; n++) {
            bodyArr[n].oscillator.stop();
            //bodyArr[n].audio.pause();
            Composite.remove(engine.world, [ bodyArr[n].body ]);
        }
        bodyArr = [];

        if (currentChampionship.state == "ready") {
            currentChampionship.active = true;
            currentChampionship.state = "semifinal_1st";
        }

        championshipLabelView.style.display = "initial";
        var stateTimer = 4;
        stateInterval = setInterval(function() {
            if (stateTimer == 0) {
                championshipLabelView.style.display = "none";
                clearInterval(stateInterval);
                return;
            }

            if (stateTimer > 0) {
                stateTimer -= 1;
                if (stateTimer > 0) {
                    say(stateTimer);
                    championshipLabelView.innerText = 
                    stateTimer;
                }
            }

            if (stateTimer == 0) {
                currentChampionship.stateOpen = true;
                say("LAUNCH");
                championshipLabelView.innerText = "LAUNCH";
            }

            if (stateTimer == 0)
            if (currentChampionship.state == "semifinal_1st") {
                for (var n = 0; 
                n < currentChampionship.semifinal_1st.length; n++) {
                var participant = 
                currentChampionship.participants[
                currentChampionship.semifinal_1st[n].no];
                if (!participant.cpu) continue;
                var rnd = 0.5+(Math.random()*0.5);
                var x = 10+(sw/gridSize)+
                Math.floor(Math.random()*(sw-(sw/gridSize)-20));
                var y = 10+(sw/gridSize)+
                Math.floor(Math.random()*(sh-(sw/gridSize)-20));
                launchItem(participant, x, y, rnd);
                }
            }
            else if (currentChampionship.state == "semifinal_2nd") {
                for (var n = 0; 
                n < currentChampionship.semifinal_2nd.length; n++) {
                var participant = 
                currentChampionship.participants[
                currentChampionship.semifinal_2nd[n].no];
                if (!participant.cpu) continue;
                var rnd = 0.5+(Math.random()*0.5);
                var x = 10+(sw/gridSize)+
                Math.floor(Math.random()*(sw-(sw/gridSize)-20));
                var y = 10+(sw/gridSize)+
                Math.floor(Math.random()*(sh-(sw/gridSize)-20));
                launchItem(participant, x, y, rnd);
                }
            }
            else if (currentChampionship.state == "final") {
                for (var n = 0; 
                n < currentChampionship.final.length; n++) {
                var participant = 
                currentChampionship.participants[
                currentChampionship.final[n].no];
                if (!participant.cpu) continue;
                var rnd = 0.5+(Math.random()*0.5);
                var x = 10+(sw/gridSize)+
                Math.floor(Math.random()*(sw-(sw/gridSize)-20));
                var y = 10+(sw/gridSize)+
                Math.floor(Math.random()*(sh-(sw/gridSize)-20));
                launchItem(participant, x, y, rnd);
                }
            }
        }, 1000);
    };

    championshipStartView.onclick = function() {
        if (currentChampionship.state == "over") {
            var search_final = 
            currentChampionship.final.filter((o) => {
                var participant = 
                currentChampionship.participants[o.no];
                return (o.active && !participant.cpu);
            });
            if (search_final.length > 0) {
                profile.balance += (100+(championshipNo*25));
                balanceView.innerText = 
                "$ "+profile.balance.toFixed(2).replace(".", ",");
            };
            createChampionship();

            championshipNoView.innerText = 
            "Championship #"+championshipNo;
            championshipPrizeView.innerText = "$ "+
            (100+(championshipNo*25)).toFixed(2).replace(".",",");
            championshipPositionView.src = 
            drawChampionshipPosition();
            return;
        }

        championshipView.style.display = "none";
        startState();
    };

    profileView = document.createElement("div");
    profileView.style.position = "absolute";
    profileView.style.background = "#fff";
    profileView.style.display = "none";
    profileView.style.fontFamily = "Khand";
    profileView.style.fontSize = "15px";
    profileView.style.left = (10)+"px";
    profileView.style.top = (10)+"px";
    profileView.style.width = (sw-20)+"px";
    profileView.style.height = (300)+"px";
    profileView.style.border = "1px solid white";
    //profileView.style.borderRadius = "25px";
    profileView.style.zIndex = "15";
    document.body.appendChild(profileView);

    profileCloseView = document.createElement("span");
    profileCloseView.style.position = "absolute";
    profileCloseView.style.color = "#000";
    profileCloseView.innerText = "close";
    profileCloseView.style.fontFamily = "Khand";
    profileCloseView.style.fontSize = "15px";
    profileCloseView.style.left = (10)+"px";
    profileCloseView.style.top = (10)+"px";
    profileCloseView.style.width = (50)+"px";
    profileCloseView.style.height = (20)+"px";
    profileCloseView.style.border = "1px solid white";
    //profileView.style.borderRadius = "25px";
    profileCloseView.style.zIndex = "15";
    profileView.appendChild(profileCloseView);

    profileCloseView.onclick = function() {
        profileView.style.display = "none";
    };

    balanceView = document.createElement("span");
    balanceView.style.position = "absolute";
    balanceView.style.color = "#000";
    balanceView.style.fontFamily = "Khand";
    balanceView.innerText = 
    "$ "+profile.balance.toFixed(2).replace(".", ",");
    balanceView.style.fontSize = "15px";
    balanceView.style.textAlign = "right";
    balanceView.style.left = (sw-80)+"px";
    balanceView.style.top = (10)+"px";
    balanceView.style.width = (50)+"px";
    balanceView.style.height = (20)+"px";
    //balanceView.style.border = "1px solid white";
    //profileView.style.borderRadius = "25px";
    balanceView.style.zIndex = "15";
    profileView.appendChild(balanceView);

    item0View = document.createElement("img");
    item0View.style.position = "absolute";
    item0View.style.background = "#000";
    item0View.style.fontFamily = "Khand";
    item0View.style.fontSize = "15px";
    item0View.style.left = (10)+"px";
    item0View.style.top = (30)+"px";
    item0View.style.width = (80)+"px";
    item0View.style.height = (80)+"px";
    item0View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    item0View.src = drawTop(profile.selectedTop);
    item0View.style.zIndex = "15";
    profileView.appendChild(item0View);

    item1View = document.createElement("img");
    item1View.style.position = "absolute";
    item1View.style.background = "#000";
    item1View.style.fontFamily = "Khand";
    item1View.style.fontSize = "15px";
    item1View.style.left = (10)+"px";
    item1View.style.top = (120)+"px";
    item1View.style.width = (80)+"px";
    item1View.style.height = (80)+"px";
    item1View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    item1View.src = drawMid(profile.selectedMid);
    item1View.style.zIndex = "15";
    profileView.appendChild(item1View);

    item2View = document.createElement("img");
    item2View.style.position = "absolute";
    item2View.style.background = "#000";
    item2View.style.fontFamily = "Khand";
    item2View.style.fontSize = "15px";
    item2View.style.left = (10)+"px";
    item2View.style.top = (210)+"px";
    item2View.style.width = (80)+"px";
    item2View.style.height = (80)+"px";
    item2View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    item2View.src = drawClip(profile.selectedClip);
    item2View.style.zIndex = "15";
    profileView.appendChild(item2View);

    shop0View = document.createElement("div");
    shop0View.style.position = "absolute";
    shop0View.style.background = "#fff";
    shop0View.style.fontFamily = "Khand";
    shop0View.style.fontSize = "15px";
    shop0View.style.left = (100)+"px";
    shop0View.style.top = (30)+"px";
    shop0View.style.width = (sw-130)+"px";
    shop0View.style.height = (80)+"px";
    shop0View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    shop0View.style.overflowX = "auto";
    shop0View.style.zIndex = "15";
    profileView.appendChild(shop0View);

    loadShop0();

    shop1View = document.createElement("div");
    shop1View.style.position = "absolute";
    shop1View.style.background = "#fff";
    shop1View.style.fontFamily = "Khand";
    shop1View.style.fontSize = "15px";
    shop1View.style.left = (100)+"px";
    shop1View.style.top = (120)+"px";
    shop1View.style.width = (sw-130)+"px";
    shop1View.style.height = (80)+"px";
    shop1View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    shop1View.style.overflowX = "auto";
    shop1View.style.zIndex = "15";
    profileView.appendChild(shop1View);

    loadShop1();

    shop2View = document.createElement("div");
    shop2View.style.position = "absolute";
    shop2View.style.background = "#fff";
    shop2View.style.fontFamily = "Khand";
    shop2View.style.fontSize = "15px";    
    shop2View.style.left = (100)+"px";
    shop2View.style.top = (210)+"px";
    shop2View.style.width = (sw-130)+"px";
    shop2View.style.height = (80)+"px";
    shop2View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    shop2View.style.zIndex = "15";
    profileView.appendChild(shop2View);
};

var drawTop = function(no, dataURL=true) {
    var canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;

    var size = 80;

    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.rect(0, 0, 80, 80);
    ctx.arc((size/2), (size/2), (size/8), 0, (Math.PI*2), true);
    ctx.clip();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc((size/2), (size/2), (size/4.5), 0, (Math.PI*2));
    ctx.fill();
    ctx.clip();

    ctx.save();
    ctx.translate((size/2), (size/2));
    ctx.rotate(-(Math.PI/4));
    ctx.translate(-(size/2), -(size/2));

    ctx.lineWidth = (size/10);
    ctx.strokeStyle = "#555";
    if (no == 1) {
        for (var n = 0; n < 10; n+=2) {
            ctx.beginPath();
            ctx.moveTo(n*(size/10), 0);
            ctx.lineTo(n*(size/10), size);
            ctx.stroke();
        }
    }
    if (no == 2) {
        ctx.fillStyle = "#555";
        ctx.beginPath();
        ctx.moveTo((size/2), (size/2));
        ctx.arc((size/2), (size/2), (size/4.5), 0, ((Math.PI*2)/4));
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo((size/2), (size/2));
        ctx.arc((size/2), (size/2), (size/4.5), 
        ((Math.PI*2)/4)*2, (((Math.PI*2)/4)*2)+((Math.PI*2)/4));
        ctx.fill();
    };
    if (no == 3) {
        ctx.translate((size/2), (size/2));
        ctx.rotate((Math.PI/4));
        ctx.translate(-(size/2), -(size/2));

        var c = {
            x: (size/2),
            y: (size/2)
        };
        var p = {
            x: c.x,
            y: c.y-(size/4.5)
        };

        ctx.fillStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        for (var n = 0; n < 3; n++) {
            var rp = _rotate2d(c, p, n*(360/3));
            ctx.lineTo(rp.x, rp.y);
        }
        ctx.fill();
    };
    if (no == 4) {
        var c = {
            x: (size/2),
            y: (size/2)
        };
        var p = {
            x: c.x,
            y: c.y-(size/4.5)
        };

        ctx.fillStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        for (var n = 0; n < 4; n++) {
            var rp = _rotate2d(c, p, n*(360/4));
            ctx.lineTo(rp.x, rp.y);
        }
        ctx.fill();
    };

    ctx.restore();

    return !dataURL ? canvas : canvas.toDataURL();
};

var drawMid = function(no, dataURL=true) {
    var canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;

    var size = 80;

    var ctx = canvas.getContext("2d");

    var polygon = 
    getPolygon(no, { x: (size/2), y: (size/2) }, (size/2));

    ctx.beginPath();
    ctx.rect(0, 0, 80, 80);
    ctx.arc((size/2), (size/2), (size/8), 0, (Math.PI*2), true);
    ctx.clip();

    ctx.fillStyle = "#555";
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (var n = 1; n < polygon.length; n++) {
        ctx.lineTo(polygon[n].x, polygon[n].y);
    }
    ctx.fill();

    return !dataURL ? canvas : canvas.toDataURL();
};

var drawClip = function(no, dataURL=true) {
    var canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;

    var size = 80;

    var ctx = canvas.getContext("2d");

    var color = colors[no];

    ctx.fillStyle = color;
    ctx.fillRect(((size/2)-(size/20)), ((size/2)-(size/7.5)), 
    (size/10), (size/3.75));

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc((size/2), (size/2), (size/10), 0, (Math.PI*2));
    ctx.fill();

    return !dataURL ? canvas : canvas.toDataURL();
};

var loadShop0 = function() {
    for (var n = 0; n < 5; n++) {
        var shopItemView = document.createElement("img");
        shopItemView.style.position = "absolute";
        shopItemView.style.background = "#000";
        shopItemView.style.fontFamily = "Khand";
        shopItemView.style.fontSize = "15px";
        shopItemView.style.left = (n*80)+"px";
        shopItemView.style.top = (0)+"px";
        shopItemView.style.width = (80)+"px";
        shopItemView.style.height = (80)+"px";
        shopItemView.style.border = "1px solid #fff";
        //shopView.style.borderRadius = "25px";
        shopItemView.no = n;
        shopItemView.src = drawTop(n);
        shopItemView.style.zIndex = "15";
        shop0View.appendChild(shopItemView);

        shopItemView.onclick = function() {
            profile.selectedTop = this.no;
            item0View.src = drawTop(profile.selectedTop);
        };
    }
};

var loadShop1 = function() {
    for (var n = 0; n < 5; n++) {
        var shopItemView = document.createElement("img");
        shopItemView.style.position = "absolute";
        shopItemView.style.background = "#000";
        shopItemView.style.fontFamily = "Khand";
        shopItemView.style.fontSize = "15px";
        shopItemView.style.left = (n*80)+"px";
        shopItemView.style.top = (0)+"px";
        shopItemView.style.width = (80)+"px";
        shopItemView.style.height = (80)+"px";
        shopItemView.style.border = "1px solid #fff";
        //shopView.style.borderRadius = "25px";
        shopItemView.no = n;
        shopItemView.src = drawMid(n);
        shopItemView.style.zIndex = "15";
        shop1View.appendChild(shopItemView);

        shopItemView.onclick = function() {
            profile.selectedMid = this.no;
            item1View.src = drawMid(profile.selectedMid);
        };
    }
};

var drawChampionshipPosition = function() {
    var canvas = document.createElement("canvas");
    canvas.width = sw-150;
    canvas.height = 280;

    var ctx = canvas.getContext("2d");

    ctx.save();
    ctx.translate(0, -((canvas.height/5)/4));

    // semifinal
    ctx.strokeStyle = "#000";
    ctx.strokeRect(
    ((canvas.width/5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    ctx.fillStyle = "#000";
    ctx.fillRect(
    ((canvas.width/5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    ctx.drawImage(
    drawItem(
    currentChampionship.participants[
    currentChampionship.semifinal_1st[0].no], false),
    ((canvas.width/5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (!currentChampionship.semifinal_1st[0].active) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)-((canvas.height/5)/4)),
    (((canvas.height/5)*4)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.lineTo(
    ((canvas.width/5)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)-((canvas.height/5)/4)),
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.lineTo(
    ((canvas.width/5)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*4)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.stroke();

    ctx.lineWidth = 1;
    }

    ctx.strokeStyle = "#000";
    ctx.strokeRect(
    (((canvas.width/5)*2)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    ctx.fillStyle = "#000";
    ctx.fillRect(
    (((canvas.width/5)*2)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    ctx.drawImage(
    drawItem(
    currentChampionship.participants[
    currentChampionship.semifinal_1st[1].no], false),
    (((canvas.width/5)*2)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (!currentChampionship.semifinal_1st[1].active) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*2)-((canvas.height/5)/4)),
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.lineTo(
    (((canvas.width/5)*2)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*4)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*2)-((canvas.height/5)/4)),
    (((canvas.height/5)*4)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.lineTo(
    (((canvas.width/5)*2)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.stroke();

    ctx.lineWidth = 1;
    }

    ctx.strokeStyle = "#000";
    ctx.strokeRect(
    (((canvas.width/5)*3)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    ctx.fillStyle = "#000";
    ctx.fillRect(
    (((canvas.width/5)*3)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    ctx.drawImage(
    drawItem(
    currentChampionship.participants[
    currentChampionship.semifinal_2nd[0].no], false),
    (((canvas.width/5)*3)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (!currentChampionship.semifinal_2nd[0].active) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*3)-((canvas.height/5)/4)),
    (((canvas.height/5)*4)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.lineTo(
    (((canvas.width/5)*3)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*3)-((canvas.height/5)/4)),
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.lineTo(
    (((canvas.width/5)*3)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*4)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.stroke();

    ctx.lineWidth = 1;
    }

    ctx.strokeStyle = "#000";
    ctx.strokeRect(
    (((canvas.width/5)*4)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    ctx.fillStyle = "#000";
    ctx.fillRect(
    (((canvas.width/5)*4)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    ctx.drawImage(
    drawItem(
    currentChampionship.participants[
    currentChampionship.semifinal_2nd[1].no], false),
    (((canvas.width/5)*4)-((canvas.height/5)/4)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (!currentChampionship.semifinal_2nd[1].active) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*4)-((canvas.height/5)/4)),
    (((canvas.height/5)*4)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.lineTo(
    (((canvas.width/5)*4)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*4)-((canvas.height/5)/4)),
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.lineTo(
    (((canvas.width/5)*4)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*4)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.stroke();

    ctx.lineWidth = 1;
    }

    // final
    ctx.strokeStyle = "#000";
    ctx.strokeRect(
    (((canvas.width/5)*1.5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (currentChampionship.final.length > 0) {
    ctx.fillStyle = "#000";
    ctx.fillRect(
    (((canvas.width/5)*1.5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));
    }

    if (currentChampionship.final.length > 0)
    ctx.drawImage(
    drawItem(
    currentChampionship.participants[
    currentChampionship.final[0].no], false),
    (((canvas.width/5)*1.5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (currentChampionship.final.length > 0 && 
    !currentChampionship.final[0].active) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*1.5)-((canvas.height/5)/4)),
    (((canvas.height/5)*2)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.lineTo(
    (((canvas.width/5)*1.5)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*2)+((canvas.height/5)/2)));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*1.5)-((canvas.height/5)/4)),
    (((canvas.height/5)*2)+((canvas.height/5)/2)));
    ctx.lineTo(
    (((canvas.width/5)*1.5)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*2)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.stroke();

    ctx.lineWidth = 1;
    }

    ctx.strokeStyle = "#000";
    ctx.strokeRect(
    (((canvas.width/5)*3.5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (currentChampionship.final.length > 1) {
    ctx.fillStyle = "#000";
    ctx.fillRect(
    (((canvas.width/5)*3.5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));
    }

    if (currentChampionship.final.length > 1)
    ctx.drawImage(
    drawItem(
    currentChampionship.participants[
    currentChampionship.final[1].no], false),
    (((canvas.width/5)*3.5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (currentChampionship.final.length > 1 && 
    !currentChampionship.final[1].active) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*3.5)-((canvas.height/5)/4)),
    (((canvas.height/5)*2)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.lineTo(
    (((canvas.width/5)*3.5)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*2)+((canvas.height/5)/2)));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((((canvas.width/5)*3.5)-((canvas.height/5)/4)),
    (((canvas.height/5)*2)+((canvas.height/5)/2)));
    ctx.lineTo(
    (((canvas.width/5)*3.5)-((canvas.height/5)/4))+
    ((canvas.height/5)/2),
    (((canvas.height/5)*2)+((canvas.height/5)/2))+
    ((canvas.height/5)/2));
    ctx.stroke();

    ctx.lineWidth = 1;
    }

    // result
    ctx.strokeStyle = "#000";
    ctx.strokeRect(
    (((canvas.width/5)*2.5)-((canvas.height/5)/4)), 
    ((canvas.height/5)/2),
    ((canvas.height/5)/2), ((canvas.height/5)/2));

    if (currentChampionship.state == "over") {
    ctx.fillStyle = "#000";
    ctx.fillRect(
    (((canvas.width/5)*2.5)-((canvas.height/5)/4)), 
    ((canvas.height/5)/2),
    ((canvas.height/5)/2), ((canvas.height/5)/2));
    }

    if (currentChampionship.state == "over") {
    var search = 
    currentChampionship.final.toSorted((o) => {
        return o.active ? -1 : 1;
    });
    ctx.drawImage(
    drawItem(
    currentChampionship.participants[search[0].no], false),
    (((canvas.width/5)*2.5)-((canvas.height/5)/4)), 
    ((canvas.height/5)/2),
    ((canvas.height/5)/2), ((canvas.height/5)/2));
    }

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo((canvas.width/5), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.lineTo((canvas.width/5), 
    ((canvas.height/5)*4)-((canvas.height/5)/2));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo((canvas.width/5), 
    ((canvas.height/5)*4)-((canvas.height/5)/2));
    ctx.lineTo(((canvas.width/5)*2), 
    ((canvas.height/5)*4)-((canvas.height/5)/2));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*2), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.lineTo(((canvas.width/5)*2), 
    ((canvas.height/5)*4)-((canvas.height/5)/2));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*1.5), 
    (((canvas.height/5)*3)+((canvas.height/5)/2)));
    ctx.lineTo(((canvas.width/5)*1.5), 
    ((canvas.height/5)*3));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*3), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.lineTo(((canvas.width/5)*3), 
    ((canvas.height/5)*4)-((canvas.height/5)/2));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*3), 
    ((canvas.height/5)*4)-((canvas.height/5)/2));
    ctx.lineTo(((canvas.width/5)*4), 
    ((canvas.height/5)*4)-((canvas.height/5)/2));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*4), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)));
    ctx.lineTo(((canvas.width/5)*4), 
    ((canvas.height/5)*4)-((canvas.height/5)/2));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*3.5), 
    (((canvas.height/5)*3)+((canvas.height/5)/2)));
    ctx.lineTo(((canvas.width/5)*3.5), 
    ((canvas.height/5)*3));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*1.5), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)));
    ctx.lineTo(((canvas.width/5)*1.5), 
    (((canvas.height/5)*2)-((canvas.height/5)/2)));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*1.5), 
    ((canvas.height/5)*2)-((canvas.height/5)/2));
    ctx.lineTo(((canvas.width/5)*3.5), 
    ((canvas.height/5)*2)-((canvas.height/5)/2));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*3.5), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)));
    ctx.lineTo(((canvas.width/5)*3.5), 
    ((canvas.height/5)*2)-((canvas.height/5)/2));
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(((canvas.width/5)*2.5), 
    ((canvas.height/5)+((canvas.height/5)/2)));
    ctx.lineTo(((canvas.width/5)*2.5), 
    (canvas.height/5));
    ctx.stroke();

    ctx.strokeStyle = "#000";

    if (currentChampionship.state == "ready" || 
    currentChampionship.state == "semifinal_1st")
    ctx.strokeRect(
    ((canvas.width/5)-((canvas.height/5)/4)
    -((canvas.height/5)/8)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)
    -((canvas.height/5)/8)),
    ((canvas.width/5)+((canvas.height/5)/2)
    +((canvas.height/5)/4)), 
    ((canvas.height/5)/2)+((canvas.height/5)/4));

    if (currentChampionship.state == "semifinal_2nd")
    ctx.strokeRect(
    (((canvas.width/5)*3)-((canvas.height/5)/4)
    -((canvas.height/5)/8)), 
    (((canvas.height/5)*4)+((canvas.height/5)/2)
    -((canvas.height/5)/8)),
    ((canvas.width/5)+((canvas.height/5)/2)
    +((canvas.height/5)/4)), 
    ((canvas.height/5)/2)+((canvas.height/5)/4));

    if (currentChampionship.state == "final")
    ctx.strokeRect(
    (((canvas.width/5)*1.5)-((canvas.height/5)/4)
    -((canvas.height/5)/8)), 
    ((((canvas.height/5)*2)+((canvas.height/5)/2))
    -((canvas.height/5)/8)),
    (((canvas.width/5)*2)+((canvas.height/5)/2)
    +((canvas.height/5)/4)), 
    ((canvas.height/5)/2)+((canvas.height/5)/4));

    ctx.restore();

    return canvas.toDataURL();
};

var drawItem = function(obj, toDataURL=true, toSprite=false) {
    var canvas = document.createElement("canvas");
    canvas.width = toSprite ? (sw/gridSize)*2 : 80;
    canvas.height = toSprite ? (sw/gridSize)*2 : 80;

    var size = toSprite ? (sw/gridSize)*2 : 80;

    var ctx = canvas.getContext("2d");

    ctx.drawImage(drawMid(obj.mid, false), 
    0, 0, size, size);
    ctx.drawImage(drawTop(obj.top, false), 
    0, 0, size, size);
    ctx.drawImage(drawClip(obj.clip, false), 
    0, 0, size, size);

    return !toDataURL ? canvas : canvas.toDataURL();
};

var championshipNo = 1;
var championshipState = [
    "ready", 
    "semifinal_1st", 
    "semifinal_2nd",
    "final"
];
var championshipStateNo = 0;

var currentChampionship = {
    active: false,
    stateOpen: false,
    participants: [
       { top: 0, mid: 0, clip: 0, cpu: false },
       { top: 0, mid: 0, clip: 1, cpu: true },
       { top: 0, mid: 2, clip: 2, cpu: true },
       { top: 0, mid: 3, clip: 3, cpu: true }
    ],
    state: "ready",
    time: 0,
    semifinal_1st: [
       { no: 0, active: true },
       { no: 1, active: true }
    ],
    semifinal_2nd: [
       { no: 2, active: true },
       { no: 3, active: true }
   ],
   final: []
};

var skipChampionship = function() {
   if (currentChampionship.state == "semifinal_1st") {
       currentChampionship.state = "over";
       var rnd = Math.floor(Math.random()*2);
       currentChampionship.semifinal_2nd[rnd].active = false;

      var search_1st = 
      currentChampionship.semifinal_1st.filter((o) => {
          return o.active;
      });

      var search_2nd = 
      currentChampionship.semifinal_2nd.filter((o) => {
          return o.active;
      });

      currentChampionship.final = [
          search_1st[0], 
          search_2nd[0]
      ];

       var rnd = Math.floor(Math.random()*2);
       currentChampionship.final[rnd].active = false;
   }
};

var createChampionship = function() {
    championshipNo += 1;

    var obj = {
        active: false,
        stateOpen: false,
        participants: [
            { top: 0, mid: 0, clip: 0, cpu: false },
            { top: 0, mid: 0, clip: 1, cpu: true },
            { top: 0, mid: 2, clip: 2, cpu: true },
            { top: 0, mid: 3, clip: 3, cpu: true }
        ],
        state: "ready",
        time: 0,
        semifinal_1st: [
            { no: 0, active: true },
            { no: 1, active: true }
        ],
        semifinal_2nd: [
            { no: 2, active: true },
            { no: 3, active: true }
        ],
       final: []
   };
   currentChampionship = obj;
};

var getMidMass = function(no) {
    var polygon = 
    getPolygon(no, { x: 0.5, y: 0.5 }, 1);

    var total = 0;

    for (var n = 0; n < polygon.length; n++) {
      var addX = polygon[n].x;
      var addY = polygon[n == polygon.length - 1 ? 0 : n + 1].y;
      var subX = polygon[n == polygon.length - 1 ? 0 : n + 1].x;
      var subY = polygon[n].y;

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
};

var launchItem = function(item, x, y, offset) {
    if (!currentChampionship.stateOpen || 
    bodyArr.length > 1) return;

    var baseArea = Math.PI*Math.pow(((sw/gridSize)/2), 2);

    var polygonArr = [ 1, 0, 0 ];

    var size = (sw/gridSize);
    var area = Math.PI*Math.pow((size/2), 2);
    var min = (bodyArr.length*5);
    var max = ((bodyArr.length+1)*5);

    var polygon = 
    getPolygon(item.mid, { x: x, y: y }, size);

    var oscillator = createOscillator();
    var frequency = 50+(offset*20);
    oscillator.frequency.value = frequency;

    var audio = new Audio("audio/spinning-sfx.wav");
    audio.loop = true;

    var obj = {
        no: item.clip,
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
            mass: getMidMass(item.mid),
            render: {
                fillStyle: "#fff",
                strokeStyle: "#fff"
            }}),
        frequency: frequency,
        oscillator: oscillator,
        audio: audio
    };

    obj.body.render.sprite.texture = drawItem(item, true, true);

    bodyArr.push(obj);
    obj.oscillator.start();
    //obj.audio.play();

    Composite.add(engine.world, [ obj.body ]);
    bodyNo += 1;

    if (bodyArr.length > 1)
    victoryRequirementsMet = true;
};