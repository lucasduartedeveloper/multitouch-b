var profile = {
    balance: 1000000,
    selectedTop: 0,
    selectedMid: 1,
    selectedClip: 0,
    selectedDispatcher: 1
};

var assemblyLine = [
    {
        top: 0,
        mid: 1,
        clip: 0,
        dispatcher: 0
    }, 
    {
        top: 0,
        mid: 1,
        clip: 1,
        dispatcher: 0
    }
];

var shopItemPrice = [
    [ 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5 ],
    [ 5, 15, 25, 35, 45, 100, 185, 225 ]
];

var inventory = [
    [ 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 1, 0, 0, 0, 0 ]
];

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

    championshipCloseView = document.createElement("span");
    championshipCloseView.style.position = "absolute";
    championshipCloseView.style.color = "#000";
    championshipCloseView.innerText = "close";
    championshipCloseView.style.textAlign = "right";
    championshipCloseView.style.fontFamily = "Khand";
    championshipCloseView.style.fontSize = "15px";
    championshipCloseView.style.lineHeight = "15px";
    championshipCloseView.style.left = (sw-80)+"px";
    championshipCloseView.style.top = (10)+"px";
    championshipCloseView.style.width = (50)+"px";
    championshipCloseView.style.height = (20)+"px";
    championshipCloseView.style.border = "1px solid white";
    //profileView.style.borderRadius = "25px";
    championshipCloseView.style.zIndex = "25";
    championshipView.appendChild(championshipCloseView);

    championshipCloseView.onclick = function() {
        championshipView.style.display = "none";
    };

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
    championshipTimeView.style.fontSize = "30px";
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
    championshipPrizeView.style.top = (90)+"px";
    championshipPrizeView.style.width = (100)+"px";
    championshipPrizeView.style.height = (20)+"px";
    championshipPrizeView.style.border = "1px solid white";
    //championshipView.style.borderRadius = "25px";
    championshipPrizeView.style.zIndex = "15";
    championshipView.appendChild(championshipPrizeView);

    autoPlay = false;
    championshipAutoPlayView = document.createElement("span");
    championshipAutoPlayView.style.position = "absolute";
    championshipAutoPlayView.style.color = "#000";
    championshipAutoPlayView.innerText = "auto: "+
    (autoPlay ? "on" : "off");
    championshipAutoPlayView.style.fontFamily = "Khand";
    championshipAutoPlayView.style.fontSize = "15px";
    championshipAutoPlayView.style.lineHeight = "40px";
    championshipAutoPlayView.style.fontWeight = 900;
    championshipAutoPlayView.style.left = (10)+"px";
    championshipAutoPlayView.style.top = (200)+"px";
    championshipAutoPlayView.style.width = (100)+"px";
    championshipAutoPlayView.style.height = (40)+"px";
    championshipAutoPlayView.style.border = "1px solid #000";
    //championshipView.style.borderRadius = "25px";
    championshipAutoPlayView.style.zIndex = "15";
    championshipView.appendChild(championshipAutoPlayView);

    championshipAutoPlayView.onclick = function() {
        autoPlay = !autoPlay;
        championshipAutoPlayView.innerText = "auto: "+
        (autoPlay ? "on" : "off");
    };

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
                    if (!autoPlay && !participant.cpu) continue;
                    launchCPU(participant);
                }
            }
            else if (currentChampionship.state == "semifinal_2nd") {
                for (var n = 0; 
                n < currentChampionship.semifinal_2nd.length; n++) {
                    var participant = 
                    currentChampionship.participants[
                    currentChampionship.semifinal_2nd[n].no];
                    if (!autoPlay && !participant.cpu) continue;
                    launchCPU(participant);
                }
            }
            else if (currentChampionship.state == "final") {
                for (var n = 0; 
                n < currentChampionship.final.length; n++) {
                    var participant = 
                    currentChampionship.participants[
                    currentChampionship.final[n].no];
                    if (!autoPlay && !participant.cpu) continue;
                    launchCPU(participant);
                }
            }
        }, 1000);
    };

    championshipStartView.onclick = function() {
        closeExits();

        if (currentChampionship.state == "over") {
            var search_final = 
            currentChampionship.final.filter((o) => {
                var participant = 
                currentChampionship.participants[o.no];
                return (o.active && !participant.cpu);
            });
            if (search_final.length > 0) {
                profile.balance += (100+(championshipNo*25));
                sfxPool.play("audio/kaching-sfx.wav");
                balanceView.innerText = 
                "$ "+profile.balance.toFixed(2).replace(".", ",");
            };
            championshipStartView.innerText = "Start";
            createChampionship();

            championshipNoView.innerText = 
            "Championship #"+championshipNo;
            championshipPrizeView.innerText = "$ "+
            (100+(championshipNo*25)).toFixed(2).replace(".",",");
            championshipPositionView.src = 
            drawChampionshipPosition();

            if (autoPlay) 
                setTimeout(function() {
                championshipStartView.click();
            }, 5000);
            return;
        }

        if (currentChampionship.state == "ready") {
            var no = assemblyLine.findIndex((o) => {
                return o.clip == profile.selectedClip;
             });
            currentChampionship.participants[0] = 
            assemblyLine[no];
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
    profileView.style.height = (390)+"px";
    profileView.style.border = "1px solid white";
    //profileView.style.borderRadius = "25px";
    profileView.style.zIndex = "15";
    document.body.appendChild(profileView);

    profileCloseView = document.createElement("span");
    profileCloseView.style.position = "absolute";
    profileCloseView.style.color = "#000";
    profileCloseView.innerText = "close";
    profileCloseView.style.textAlign = "left";
    profileCloseView.style.fontFamily = "Khand";
    profileCloseView.style.fontSize = "15px";
    profileCloseView.style.lineHeight = "15px";
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
    balanceView.innerText = "$ 0,00";
    balanceView.style.fontSize = "15px";
    balanceView.style.lineHeight = "15px";
    balanceView.style.textAlign = "right";
    balanceView.style.left = (sw-180)+"px";
    balanceView.style.top = (10)+"px";
    balanceView.style.width = (150)+"px";
    balanceView.style.height = (20)+"px";
    //balanceView.style.border = "1px solid white";
    //profileView.style.borderRadius = "25px";
    balanceView.style.zIndex = "15";
    profileView.appendChild(balanceView);

    refreshBalance();

    // x * 1.5 = 0;
    // x = 1/1.5;

    var offset = parseInt(((40*1.5)-40)*(1/1.5));

    item0View = document.createElement("img");
    item0View.style.position = "absolute";
    item0View.style.background = "#000";
    item0View.style.objectFit = "cover";
    item0View.style.fontFamily = "Khand";
    item0View.style.fontSize = "15px";
    item0View.style.left = (10)+"px";
    item0View.style.top = (30)+"px";
    item0View.style.width = (80)+"px";
    item0View.style.height = (80)+"px";
    item0View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    item0View.src = drawTop(profile.selectedTop);
    item0View.style.clipPath = 
    "inset("+offset+"px "+offset+"px)";
    item0View.style.transform = "scale(1.5)";
    item0View.style.zIndex = "15";
    profileView.appendChild(item0View);

    item1View = document.createElement("img");
    item1View.style.position = "absolute";
    item1View.style.background = "#000";
    item1View.style.objectFit = "cover";
    item1View.style.fontFamily = "Khand";
    item1View.style.fontSize = "15px";
    item1View.style.left = (10)+"px";
    item1View.style.top = (120)+"px";
    item1View.style.width = (80)+"px";
    item1View.style.height = (80)+"px";
    item1View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    item1View.src = drawMid(profile.selectedMid);
    item1View.style.clipPath = 
    "inset("+offset+"px "+offset+"px)";
    item1View.style.transform = "scale(1.5)";
    item1View.style.zIndex = "15";
    profileView.appendChild(item1View);

    item2View = document.createElement("img");
    item2View.style.position = "absolute";
    item2View.style.background = "#000";
    item2View.style.objectFit = "cover";
    item2View.style.fontFamily = "Khand";
    item2View.style.fontSize = "15px";
    item2View.style.left = (10)+"px";
    item2View.style.top = (210)+"px";
    item2View.style.width = (80)+"px";
    item2View.style.height = (80)+"px";
    item2View.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    item2View.src = drawClip(profile.selectedClip);
    item2View.style.clipPath = 
    "inset("+offset+"px "+offset+"px)";
    item2View.style.transform = "scale(1.5)";
    item2View.style.zIndex = "15";
    profileView.appendChild(item2View);

    assembleView = document.createElement("button");
    assembleView.style.position = "absolute";
    assembleView.style.background = "#fff";
    assembleView.style.colot = "#000";
    assembleView.innerText = "ASSEMBLE";
    assembleView.style.fontFamily = "Khand";
    assembleView.style.fontSize = "15px";
    assembleView.style.left = (10)+"px";
    assembleView.style.top = (300)+"px";
    assembleView.style.width = (80)+"px";
    assembleView.style.height = (40)+"px";
    assembleView.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    assembleView.style.zIndex = "15";
    profileView.appendChild(assembleView);

    assembleView.onclick = function() {
        var no = assemblyLine.findIndex((o) => {
            return o.clip == profile.selectedClip;
        });

        if (no < 0) { 
            assemblyLine.push(profileToObj());
            loadProfile();
            return;
        }

        assemblyLine[no].top = profile.selectedTop;
        assemblyLine[no].mid = profile.selectedMid;
        assemblyLine[no].clip = profile.selectedClip;
        assemblyLine[no].dispatcher = profile.selectedDispatcher;

        loadProfile();

        if (bodyArr.length > 0 && bodyArr[0].no == 0) {
            var velocity = bodyArr[0].body.velocity;
            var angularVelocity = bodyArr[0].body.angularVelocity;
            var position = bodyArr[0].body.position;

            var size = ((sw/gridSize)*2);

            var polygon = 
            getPolygon(assemblyLine[no].mid, { 
                x: position.x, 
                y: position.y
            }, size);

            var body = Bodies.fromVertices(
                position.x, position.y, polygon, {
                label: "body0",
                mass: getMidMass(this.no),
                render: {
                    fillStyle: "#fff",
                    strokeStyle: "#fff"
                }});

            Body.setVelocity(body, velocity);
            Body.setAngularVelocity(body, angularVelocity);
            Body.setPosition(body, position);

            body.render.sprite.texture = 
            drawItem(assemblyLine[no], true, true);
            body.render.sprite.xScale = 0.5;
            body.render.sprite.yScale = 0.5;

            Composite.remove(engine.world, [ bodyArr[0].body ]);

            bodyArr[0].body = body;
            Composite.add(engine.world, [ bodyArr[0].body ]);
        }
    };

    disassembleView = document.createElement("button");
    disassembleView.style.position = "absolute";
    disassembleView.style.background = "#fff";
    disassembleView.style.colot = "#000";
    disassembleView.innerText = "DISASSEMBLE";
    disassembleView.style.fontFamily = "Khand";
    disassembleView.style.fontSize = "15px";
    disassembleView.style.left = (10)+"px";
    disassembleView.style.top = (340)+"px";
    disassembleView.style.width = (80)+"px";
    disassembleView.style.height = (40)+"px";
    disassembleView.style.border = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    disassembleView.style.zIndex = "15";
    profileView.appendChild(disassembleView);

    disassembleView.onclick = function() {
        if (assemblyLine.length == 1) return;

        var no = assemblyLine.findIndex((o) => {
            return o.clip == profile.selectedClip;
        });

        if (no < 0) return;

        var disassembly = 
        assemblyLine.splice(no, 1)[0];

        inventory[1][disassembly.mid] += 1;
        loadProfile();
    };

    shop0View = document.createElement("div");
    shop0View.style.position = "absolute";
    shop0View.style.background = "#fff";
    shop0View.style.fontFamily = "Khand";
    shop0View.style.fontSize = "15px";
    shop0View.style.left = (100)+"px";
    shop0View.style.top = (30)+"px";
    shop0View.style.width = (sw-130)+"px";
    shop0View.style.height = (80)+"px";
    shop0View.style.outline = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    shop0View.style.overflowX = "auto";
    shop0View.style.overflowY = "hidden";
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
    shop1View.style.outline = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    shop1View.style.overflowX = "auto";
    shop1View.style.overflowY = "hidden";
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
    shop2View.style.outline = "1px solid #000";
    //shopView.style.borderRadius = "25px";
    shop2View.style.overflowX = "auto";
    shop2View.style.overflowY = "hidden";
    shop2View.style.zIndex = "15";
    profileView.appendChild(shop2View);

    loadShop2();

    profileArrView = document.createElement("div");
    profileArrView.style.position = "absolute";
    profileArrView.style.background = "#fff";
    profileArrView.style.fontFamily = "Khand";
    profileArrView.style.fontSize = "15px";    
    profileArrView.style.left = (100)+"px";
    profileArrView.style.top = (300)+"px";
    profileArrView.style.width = (sw-130)+"px";
    profileArrView.style.height = (80)+"px";
    profileArrView.style.outline = "1px solid #000";
    profileArrView.style.overflowX = "auto";
    //shopView.style.borderRadius = "25px";
    profileArrView.style.zIndex = "15";
    profileView.appendChild(profileArrView);

    loadProfile();

    fixedCamera0 = document.createElement("canvas");
    fixedCamera0.style.position = "absolute";
    fixedCamera0.style.width = (sw/3);
    fixedCamera0.style.height = (sw/3);
    fixedCamera0.style.left = ((sw/2)-(sw/3)) +"px";
    fixedCamera0.style.top = ((sh/2)+(sh/3)-(sw/3))+"px";
    fixedCamera0.style.width = (sw/3)+"px";
    fixedCamera0.style.height = (sw/3)+"px";
    fixedCamera0.style.border = "1px solid #fff";
    fixedCamera0.style.zIndex = "15";
    profileView.appendChild(fixedCamera0);

    fixedCamera1 = document.createElement("canvas");
    fixedCamera1.style.position = "absolute";
    fixedCamera1.style.width = (sw/3);
    fixedCamera1.style.height = (sw/3);
    fixedCamera1.style.left = ((sw/2)) +"px";
    fixedCamera1.style.top = ((sh/2)+(sh/3)-(sw/3))+"px";
    fixedCamera1.style.width = (sw/3)+"px";
    fixedCamera1.style.height = (sw/3)+"px";
    fixedCamera1.style.border = "1px solid #fff";
    fixedCamera1.style.zIndex = "15";
    profileView.appendChild(fixedCamera1);

    render0 = Render.create({
        engine: engine,
        canvas: fixedCamera0,
        options: {
            width: (sw/3),
            height: (sw/3),
            background: "#000",
            wireframes: false
            //showPerformance: true
        }
    });

    render0.options.hasBounds = true;

    // run the renderer
    Render.run(render0);

    render1 = Render.create({
        engine: engine,
        canvas: fixedCamera1,
        options: {
            width: (sw/3),
            height: (sw/3),
            background: "#000",
            wireframes: false
            //showPerformance: true
        }
    });

    render1.options.hasBounds = true;

    // run the renderer
    Render.run(render1);

    cpuLaunchCount = 0;

    cpuLaunchSettings0 = {
        active: false,
        startX: (sw/2),
        startY: (sh/2),
        moveX: (sw/2),
        moveY: (sh/2),
        clip: 0,
        dispatcher: 0
    };

    cpuLaunchSettings1 = {
        active: false,
        startX: (sw/2),
        startY: (sh/2),
        moveX: (sw/2),
        moveY: (sh/2),
        clip: 0,
        dispatcher: 0
    };

    championshipTime = 0;
    setInterval(function() {
        if (currentChampionship.state != "over")
        championshipTime += 1;

        championshipTimeView.innerText = 
        moment(championshipTime*1000).format("mm:ss");
    }, 1000);

    loadImages(function() {
        loadShop0();
    });
};

var refreshBalance = function() {
    var formattedValue = 
    profile.balance.toLocaleString("en-US", {
        style: "currency", 
        currency: "USD"
    });

    formattedValue = formattedValue.replace("$", "");
    formattedValue = formattedValue.replaceAll(",", "#");
    formattedValue = formattedValue.replace(".", ",");
    formattedValue = formattedValue.replaceAll("#", ".");
    formattedValue = "$ "+formattedValue;

    balanceView.innerText = formattedValue;
};

var getNextAssembly = function(skip=-1) {
    var search = [];
    for (var n = 0; n < assemblyLine.length; n++) {
        var no = assemblyLine[n].clip;
        if (no == skip) continue;
        search = bodyArr.filter((o) => { 
            return o.no == no; 
        });
        if (search.length == 0 || n == (assemblyLine.length-1))
        return n;
    }
    return false;
};

var loadProfile = function() {
    profileArrView.innerHTML = "";

    var no = assemblyLine.findIndex((o) => {
        return o.clip == profile.selectedClip;
    });

    var paperclipView = document.createElement("i");
    paperclipView.style.position = "absolute";
    paperclipView.style.color = "#fff";
    paperclipView.className = "fa-solid fa-paperclip";
    paperclipView.style.fontSize = "15px";
    paperclipView.style.left = (no*80)+"px";
    paperclipView.style.top = (0)+"px";
    paperclipView.style.width = (20)+"px";
    paperclipView.style.height = (20)+"px";
    paperclipView.style.transform = "rotateZ(-45deg)";
    paperclipView.style.zIndex = "15";

    /*
    var removeArr = [];
    for (var n = 0; profileArrView.children.length; n++) {
        removeArr.push(profileArrView.children[n]);
    }
    for (var n = 0; removeArr.length; n++) {
        removeArr[n].remove();
    }*/

    for (var n = 0; n < assemblyLine.length; n++) {
        var assemblyView = document.createElement("img");
        assemblyView.style.position = "absolute";
        assemblyView.style.background = "#000";
        assemblyView.style.objectFit = "cover";
        assemblyView.style.fontFamily = "Khand";
        assemblyView.style.fontSize = "15px";
        assemblyView.style.left = (n*80)+"px";
        assemblyView.style.top = (0)+"px";
        assemblyView.style.width = (80)+"px";
        assemblyView.style.height = (80)+"px";
        assemblyView.style.border = "1px solid #fff";
        assemblyView.src = drawItem(assemblyLine[n]);
        assemblyView.style.zIndex = "15";
        profileArrView.appendChild(assemblyView);

        assemblyView.no = n;

        assemblyView.onclick = function() {
            paperclipView.style.left = (this.no*80)+"px";

            profile.selectedTop = assemblyLine[this.no].top;
            profile.selectedMid = assemblyLine[this.no].mid;
            profile.selectedClip = assemblyLine[this.no].clip;

            item0View.src = drawTop(profile.selectedTop);
            item1View.src = drawMid(profile.selectedMid);
            item2View.src = drawClip(profile.selectedClip);
        };
    }

    profileArrView.appendChild(paperclipView);
}; 

var img_list = [
    "img/grid-position/clip-image/tile000.png",
    "img/grid-position/clip-image/tile001.png",
    "img/grid-position/clip-image/tile002.png",
    "img/grid-position/clip-image/tile003.png",
    "img/grid-position/clip-image/tile005.png",
    "img/grid-position/top-image/tile000.png",
    "img/grid-position/top-image/tile001.png",
    "img/grid-position/top-image/tile002.png",
    "img/grid-position/top-image/tile003.png"
];

var imagesLoaded = false;
var loadImages = function(callback) {
    var count = 0;
    for (var n = 0; n < img_list.length; n++) {
        var img = document.createElement("img");
        img.n = n;
        img.onload = function() {
            count += 1;
            console.log("loading ("+count+"/"+img_list.length+")");
            img_list[this.n] = this;
            if (count == img_list.length) {
                imagesLoaded = true;
                if (callback) callback();
            }
        };
        var rnd = Math.random();
        img.src = img_list[n].includes("img") ? 
        img_list[n]+"?f="+rnd : 
        img_list[n];
    }
};

var launchCPU = function(obj) {
    var settings = cpuLaunchCount == 0 ? 
    cpuLaunchSettings0 : cpuLaunchSettings1;

    var c = {
        x: (sw/2),
        y: (sh/2)
    };
    var p0 = {
        x: c.x,
        y: c.y-Math.floor(Math.random()*(sw/3))
        +Math.floor(Math.random()*(sw/3))
    };
    var p1 = {
        x: c.x,
        y: p.y-Math.floor(Math.random()*(sw/3))+
        Math.floor(Math.random()*(sw/3))
    };
    var a0 = Math.floor(Math.random()*360);
    var a1 = a0+(-7.5+Math.floor(Math.random()*15));
    var rp0 = _rotate2d(c, p0, a0);
    var rp1 = _rotate2d(c, p1, a1);

    settings.startX = rp0.x;
    settings.startY = rp0.y;

    settings.moveX = rp1.x;
    settings.moveY = rp1.y;

    settings.clip = obj.clip;
    settings.dispatcher = 
    profile.selectedDispatcher;

    cpuLaunchCount += 1;
    settings.active = true;

    var rnd = 0.5+(Math.random()*0.5);

    setTimeout(function() {
        cpuLaunchCount -= 1;
        settings.active = false;
        launchItem(obj, 
            settings.startX, 
            settings.startY, 
            settings.moveX, 
            settings.moveY, 
            rnd);
    }, 1500);
};

var drawTop = function(no, dataURL=true) {
    var canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;

    var size = 160;

    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.arc((size/2), (size/2), (size/8), 0, (Math.PI*2), true);
    ctx.clip();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc((size/2), (size/2), 
    (no == 7) ? (size/7) : (size/4.5), 0, (Math.PI*2));
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
    if (no == 5) {
        ctx.translate((size/2), (size/2));
        ctx.rotate((Math.PI/4));
        ctx.translate(-(size/2), -(size/2));

        ctx.lineWidth = ((size/4.5)/4);
        ctx.fillStyle = "#555";
        ctx.beginPath();
        ctx.arc((size/2), (size/2), ((size/4.5)/1.25), 
        0, ((Math.PI*2)/4));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc((size/2), (size/2), ((size/4.5)/1.25), 
        ((Math.PI*2)/4)*2, (((Math.PI*2)/4)*2)+((Math.PI*2)/4));
        ctx.stroke();
    };
    if (no == 6) {
        ctx.translate((size/2), (size/2));
        ctx.rotate((Math.PI/4));
        ctx.translate(-(size/2), -(size/2));

        var c = {
            x: (size/2),
            y: (size/2)
        };
        var p = {
            x: c.x,
            y: c.y-((size/4.5)/1.25)
        };

        ctx.fillStyle = "#000";

        if (imagesLoaded)
        for (var n = 0; n < 4; n++) {
            var rp = _rotate2d(c, p, n*(360/4));
            ctx.save();
            ctx.translate(rp.x, rp.y);
            ctx.rotate(-(n*(360/4))*(Math.PI/180));
            ctx.translate(-rp.x, -rp.y);

            ctx.beginPath();
            ctx.rect(rp.x-(size/16), rp.y-(size/16), (size/8), (size/8));
            //ctx.fill();

            ctx.drawImage(img_list[5+n], 
            rp.x-(size/16), rp.y-(size/16), (size/8), (size/8));

            ctx.restore();
        }
    };

    ctx.restore();

    return !dataURL ? canvas : canvas.toDataURL();
};

var drawMid = function(no, dataURL=true) {
    var canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;

    var size = 160;

    var ctx = canvas.getContext("2d");

    var polygon = 
    getPolygon(no, { x: (size/2), y: (size/2) }, (size/2));

    ctx.beginPath();
    ctx.rect(0, 0, size, size);
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

var drawClip = 
    function(no, dataURL=true, standalone=true) {
    var canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;

    var size = 160;

    var ctx = canvas.getContext("2d");

    ctx.save();
    ctx.translate((size/2), (size/2));
    if (!standalone)
    ctx.rotate(-(Math.PI/2));
    ctx.translate(-(size/2), -(size/2));

    var color = colors[no];

    ctx.fillStyle = color;
    ctx.fillRect(((size/2)-(size/20)), ((size/2)-(size/7.5)), 
    (size/10), (size/3.75));

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc((size/2), (size/2), (size/10), 0, (Math.PI*2));
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc((size/2), (size/2), (size/11), 0, (Math.PI*2));

    ctx.restore();

    /*
    ctx.fill();
    ctx.clip();

    if (imagesLoaded)
    ctx.drawImage(img_list[no], 
    (size/2)-(size/11), (size/2)-(size/11),
    (size/11)*2, (size/11)*2);*/

    return !dataURL ? canvas : canvas.toDataURL();
};

var getDispatcherPath = function(n, pos, size) {
    var polygon = [];

    if (n == 0) {
        polygon.push({ x: pos.x, y: pos.y });
    }
    else if (n == 1) {
        polygon.push({ x: pos.x+(size/4), y: pos.y });
        polygon.push({ x: pos.x-(size/4), y: pos.y });
    }
    else if (n == 2) {
        polygon.push({ x: pos.x+(size/4), y: pos.y });
        polygon.push({ x: pos.x-(size/4), y: pos.y });
        polygon.push({ x: pos.x-(size/4), y: pos.y+(size/4) });
    }
    else if (n == 3) {
        polygon.push({ x: pos.x+(size/4), y: pos.y });
        polygon.push({ x: pos.x-(size/4), y: pos.y });
        polygon.push({ x: pos.x-(size/4), y: pos.y+(size/4) });
        polygon.push({ x: pos.x, y: pos.y+(size/4) });
    }
    else if (n == 4) {
        polygon.push({ x: pos.x+(size/4), y: pos.y });
        polygon.push({ x: pos.x-(size/4), y: pos.y });
        polygon.push({ x: pos.x-(size/4), y: pos.y+(size/4) });
        polygon.push({ x: pos.x-(size/4)-(size/8), 
        y: pos.y+(size/8) });
    }

    return polygon;
};

var drawDispatcher = function(no, dataURL=true, a) {
    var canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;

    var size = 80;

    var ctx = canvas.getContext("2d");

    var polygon = 
    getDispatcherPath(no, { x: (size/2), y: (size/2) }, size);
    //console.log(polygon);

    ctx.save();
    ctx.translate((size/2), (size/2));
    ctx.rotate(a);
    ctx.translate(-(size/2), -(size/2));

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (var n = 1; n < polygon.length; n++) {
        ctx.lineTo(polygon[n].x, polygon[n].y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(polygon[polygon.length-1].x, 
    polygon[polygon.length-1].y, 
    (size/20), 0, (Math.PI*2));
    ctx.stroke();

    ctx.restore();

    return !dataURL ? canvas : canvas.toDataURL();
};

var loadShop0 = function() {
    shop0View.innerHTML = "";

    for (var n = 0; n < 8; n++) {
        var shopItemView = document.createElement("img");
        shopItemView.style.position = "absolute";
        shopItemView.style.background = "#000";
        shopItemView.style.objectFit = "cover";
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

        itemInventoryView = document.createElement("span");
        itemInventoryView.style.position = "absolute";
        itemInventoryView.style.color = "#fff";
        itemInventoryView.style.fontFamily = "Khand";
        itemInventoryView.innerText = inventory[0][n];
        itemInventoryView.style.fontSize = "10px";
        itemInventoryView.style.lineHeight = "15px";
        itemInventoryView.style.textAlign = "left";
        itemInventoryView.style.left = ((n*80)+5)+"px";
        itemInventoryView.style.top = (5)+"px";
        itemInventoryView.style.width = (80)+"px";
        itemInventoryView.style.height = (20)+"px";
        itemInventoryView.style.zIndex = "15";
        shop0View.appendChild(itemInventoryView);

        shopItemPriceView = document.createElement("span");
        shopItemPriceView.style.position = "absolute";
        shopItemPriceView.style.color = "#fff";
        shopItemPriceView.style.fontFamily = "Khand";
        shopItemPriceView.innerText = 
        "$ "+shopItemPrice[0][n].toFixed(2).replace(".", ",");
        shopItemPriceView.style.fontSize = "10px";
        shopItemPriceView.style.lineHeight = "15px";
        shopItemPriceView.style.textAlign = "right";
        shopItemPriceView.style.left = ((n*80)-5)+"px";
        shopItemPriceView.style.top = (60)+"px";
        shopItemPriceView.style.width = (80)+"px";
        shopItemPriceView.style.height = (20)+"px";
        //balanceView.style.border = "1px solid white";
        //profileView.style.borderRadius = "25px";
        shopItemPriceView.style.zIndex = "15";
        shop0View.appendChild(shopItemPriceView);

        shopItemView.onclick = function() {
            if (inventory[0][this.no] == 1) {
                profile.selectedTop = this.no;
                item0View.src = 
                drawTop(profile.selectedTop);
            }
            else {
                if (profile.balance < shopItemPrice[0][this.no])
                swal("Insuficient funds.");
                else {
                    swal({ text: "Purchase for $ "+
                    (shopItemPrice[0][this.no]).toFixed(2).replace(".", ",")+
                    "?", buttons: [ "No", "Yes"] })
                    .then((value) => {
                        //console.log(value);
                        if (value) {
                            profile.balance -= shopItemPrice[0][this.no];
                            refreshBalance();

                            profile.selectedTop = this.no;
                            item0View.src = 
                            drawTop(profile.selectedTop);

                            inventory[0][this.no] += 1;
                            loadShop0();
                        }
                    });
                }
            }
        };
    }
};

var loadShop1 = function() {
    shop1View.innerHTML = "";

    for (var n = 0; n < 8; n++) {
        var shopItemView = document.createElement("img");
        shopItemView.style.position = "absolute";
        shopItemView.style.background = "#000";
        shopItemView.style.objectFit = "cover";
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

        itemInventoryView = document.createElement("span");
        itemInventoryView.style.position = "absolute";
        itemInventoryView.style.color = "#fff";
        itemInventoryView.style.fontFamily = "Khand";
        itemInventoryView.innerText = inventory[1][n];
        itemInventoryView.style.fontSize = "10px";
        itemInventoryView.style.lineHeight = "15px";
        itemInventoryView.style.textAlign = "left";
        itemInventoryView.style.left = ((n*80)+5)+"px";
        itemInventoryView.style.top = (5)+"px";
        itemInventoryView.style.width = (80)+"px";
        itemInventoryView.style.height = (20)+"px";
        itemInventoryView.style.zIndex = "15";
        shop1View.appendChild(itemInventoryView);

        shopItemPriceView = document.createElement("span");
        shopItemPriceView.style.position = "absolute";
        shopItemPriceView.style.color = "#fff";
        shopItemPriceView.style.fontFamily = "Khand";
        shopItemPriceView.innerText = 
        "$ "+shopItemPrice[1][n].toFixed(2).replace(".", ",");
        shopItemPriceView.style.fontSize = "10px";
        shopItemPriceView.style.lineHeight = "15px";
        shopItemPriceView.style.textAlign = "right";
        shopItemPriceView.style.left = ((n*80)-5)+"px";
        shopItemPriceView.style.top = (60)+"px";
        shopItemPriceView.style.width = (80)+"px";
        shopItemPriceView.style.height = (20)+"px";
        //balanceView.style.border = "1px solid white";
        //profileView.style.borderRadius = "25px";
        shopItemPriceView.style.zIndex = "15";
        shop1View.appendChild(shopItemPriceView);

        shopItemView.priceView = shopItemPriceView;

        shopItemView.onclick = function() {
            if (inventory[1][this.no] == 1) {
                profile.selectedMid = this.no;
                item1View.src = drawMid(profile.selectedMid);
            }
            else {
                if (profile.balance < shopItemPrice[1][this.no])
                swal("Insuficient funds.");
                else {
                    swal({ text: "Purchase for $ "+
                    (shopItemPrice[1][this.no]).toFixed(2).replace(".", ",")+
                    "?", buttons: [ "No", "Yes"] })
                    .then((value) => {
                        //console.log(value);
                        if (value) {
                            profile.balance -= shopItemPrice[1][this.no];
                            refreshBalance();

                            profile.selectedMid = this.no;
                            item1View.src = drawMid(profile.selectedMid);

                            inventory[1][this.no] += 1;
                            loadShop1();
                        }
                    });
                }
            }
        };
    }
};

var loadShop2 = function() {
    for (var n = 0; n < 5; n++) {
        var shopItemView = document.createElement("img");
        shopItemView.style.position = "absolute";
        shopItemView.style.background = "#000";
        shopItemView.style.objectFit = "cover";
        shopItemView.style.fontFamily = "Khand";
        shopItemView.style.fontSize = "15px";
        shopItemView.style.left = (n*80)+"px";
        shopItemView.style.top = (0)+"px";
        shopItemView.style.width = (80)+"px";
        shopItemView.style.height = (80)+"px";
        shopItemView.style.border = "1px solid #fff";
        //shopView.style.borderRadius = "25px";
        shopItemView.no = n;
        shopItemView.src = drawClip(n);
        shopItemView.style.zIndex = "15";
        shop2View.appendChild(shopItemView);

        shopItemView.onclick = function() {
            profile.selectedClip = this.no;
            item2View.src = drawClip(profile.selectedClip);
        };
    }
};

var loadShop3 = function() {
    for (var n = 0; n < 5; n++) {
        var shopItemView = document.createElement("img");
        shopItemView.style.position = "absolute";
        shopItemView.style.background = "#000";
        shopItemView.style.objectFit = "cover";
        shopItemView.style.fontFamily = "Khand";
        shopItemView.style.fontSize = "15px";
        shopItemView.style.left = (n*80)+"px";
        shopItemView.style.top = (0)+"px";
        shopItemView.style.width = (80)+"px";
        shopItemView.style.height = (80)+"px";
        shopItemView.style.border = "1px solid #fff";
        //shopView.style.borderRadius = "25px";
        shopItemView.no = n;
        shopItemView.src = drawDispatcher(n);
        shopItemView.style.zIndex = "15";
        shop3View.appendChild(shopItemView);

        shopItemView.onclick = function() {
            profile.selectedDispatcher = this.no;
            item3View.src = 
            drawDispatcher(profile.selectedDispatcher);
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

    if (currentChampionship.final.length > 0 && 
    currentChampionship.final[0].no != -1) {
    ctx.fillStyle = "#000";
    ctx.fillRect(
    (((canvas.width/5)*1.5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));
    }

    if (currentChampionship.final.length > 0 && 
    currentChampionship.final[0].no != -1)
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

    if (currentChampionship.final.length > 1 && 
    currentChampionship.final[1].no != -1) {
    ctx.fillStyle = "#000";
    ctx.fillRect(
    (((canvas.width/5)*3.5)-((canvas.height/5)/4)), 
    (((canvas.height/5)*2)+((canvas.height/5)/2)),
    ((canvas.height/5)/2), ((canvas.height/5)/2));
    }

    if (currentChampionship.final.length > 1 && 
    currentChampionship.final[1].no != -1)
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
    canvas.width = toSprite ? (sw/gridSize)*4 : 80;
    canvas.height = toSprite ? (sw/gridSize)*4 : 80;

    var size = toSprite ? (sw/gridSize)*4 : 80;

    var ctx = canvas.getContext("2d");

    ctx.drawImage(drawMid(obj.mid, false), 
    0, 0, size, size);
    ctx.drawImage(drawTop(obj.top, false), 
    0, 0, size, size);
    ctx.drawImage(drawClip(obj.clip, false, false), 
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
          { ...search_1st[0] }, 
          { ...search_2nd[0] }
      ];

       var rnd = Math.floor(Math.random()*2);
       currentChampionship.final[rnd].active = false;
   }
};

var createChampionship = function() {
    championshipNo += 1;
    championshipTime = 0;

    var minTop = 0;
    var maxTop = championshipNo < 2 ? 2 : 4;

    var topArr = [
       Math.floor(Math.random()*(maxTop+1)),
       Math.floor(Math.random()*(maxTop+1)),
       Math.floor(Math.random()*(maxTop+1))
    ];

    var minMid = 0;
    var maxMid = championshipNo < 2 ? 2 : 4;

    var midArr = [
       Math.floor(Math.random()*(maxMid+1)),
       Math.floor(Math.random()*(maxMid+1)),
       Math.floor(Math.random()*(maxMid+1))
    ];

    clipArr = [ 1, 2, 3, 4 ];
    clipArr.sort((a, b) => {  return 0.5 - Math.random(); });

    var obj = {
        active: false,
        stateOpen: false,
        participants: [
            { top: 0, mid: 0, clip: 0, cpu: false },
            { top: topArr[0], mid: midArr[0], clip: clipArr[0], cpu: true },
            { top: topArr[1], mid: midArr[1], clip: clipArr[1], cpu: true },
            { top: topArr[2], mid: midArr[2], clip: clipArr[2], cpu: true }
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

var getAirFriction = function(no) {
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

    return Math.abs(total)*0.001;
};

var launchItem = function(item, x, y, mx, my, offset, singlePlayer=false) {
    if (!singlePlayer && (!currentChampionship.stateOpen || 
    bodyArr.length > 1)) return;

    var baseArea = Math.PI*Math.pow(((sw/gridSize)/2), 2);

    var polygonArr = [ 1, 0, 0 ];

    var size = (sw/gridSize);
    var area = Math.PI*Math.pow((size/2), 2);
    var min = (bodyArr.length*5);
    var max = ((bodyArr.length+1)*5);

    var co = mx-x;
    var ca = my-y;
    var a = _angle2d(co, ca)-(Math.PI);

    var dispatcher = 
    getDispatcherPath(
    profile.selectedDispatcher, { x: x, y: y }, (size*2));
    /*console.log(
        x, y, 
        dispatcher[dispatcher.length-1].x, 
        dispatcher[dispatcher.length-1].y
    );*/

    var polygon = 
    getPolygon(item.mid, { 
        x: dispatcher[dispatcher.length-1].x, 
        y: dispatcher[dispatcher.length-1].y
    }, size);

    var oscillator = createOscillator();
    var frequency = 50+(offset*20);
    oscillator.frequency.value = frequency;

    var audio = new Audio("audio/spinning-sfx.wav");
    audio.loop = true;

    var obj = {
        no: item.clip,
        speed: (offset*10),
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
            frictionAir: getAirFriction(item.mid),
            mass: getMidMass(item.mid),
            render: {
                fillStyle: "#fff",
                strokeStyle: "#fff"
            }}),
        scale: 1,
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

    obj.body.render.sprite.texture = drawItem(item, true, true);
    obj.body.render.sprite.xScale = 0.5;
    obj.body.render.sprite.yScale = 0.5;

    bodyArr.push(obj); 
    obj.oscillator.start();
    //obj.audio.play();

    Composite.add(engine.world, [ obj.body ]);
    bodyNo += 1;

    if (bodyArr.length > 1)
    victoryRequirementsMet = true;
};