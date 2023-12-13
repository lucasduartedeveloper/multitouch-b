var numPixels = 150;

var createPlane4 = function() { //vertices, faces) {
    var planeGeometry = 
    new THREE.PlaneGeometry(5, 5, numPixels, numPixels);
    var planeMaterial = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: 0xaaaaaa, //wireframe: true
    });
    lightMap = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(lightMap);
    lightMap.texture = false;
    lightMap.modeNo = 0;
    lightMap.modes = 
    ["blank", "textured", "wireframe", "textured-volume"];
    lightMap.position.x = 0;
    //lightMap.position.y = 0.9;
    lightMap.position.z = 0;
    //lightMap.rotation.x = -Math.PI/2;

    // wireframe
    var geo = new THREE.EdgesGeometry( lightMap.geometry ); 
    // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( { color: 0x88ff88 } );
    var wireframe = new THREE.LineSegments( geo, mat );
    //lightMap.add( wireframe );
};

var set = function() {
    var w = numPixels / 5;
    render = false;

    for (var i = 0; i < numPixels; i++) {
    for (var j = 0; j < numPixels; j++) {
        vertexArray = lightMap.geometry.getAttribute("position").array;
        var random = THREE.MathUtils.randFloat(0, 0.25);

        var pixel = ((i*numPixels)+j);

        //var x = vertexArray[((i*(numPixels*3))+i*3) + (3*j)] = newArray[pixel] + (w/2);
        //var y = vertexArray[((i*(numPixels*3))+i*3) + (3*j+1)] = newArray[pixel] + (w/2);
        var z = vertexArray[((i*(numPixels*3))+i*3) + (3*j+2)] = newArray[pixel]; // + (w/2);
        var dist = { x: 0, y: 0, z: 0 }; 

        vertexArray[((i*(numPixels*3))+i*3) + (3*j+2)] = newArray[pixel];
        vertexArray[((i*(numPixels*3))+i*3) + (3*j+5)] = newArray[pixel];
        vertexArray[(((i+1)*(numPixels*3))+(i+1)*3) + (3*j+2)] = newArray[pixel];

        vertexArray[(((i+1)*(numPixels*3))+(i+1)*3) + (3*j+5)] = newArray[pixel];

        lightMap.geometry.getAttribute("position").needsUpdate = true;
        j++;
    }
    }

    render = true;
};

var createLightMap_preloaded = function(callback) {
    var resolutionCanvas = document.createElement("canvas");
    resolutionCanvas.width = numPixels;
    resolutionCanvas.height = numPixels;

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.drawImage(squareCanvas,
    0, 0, numPixels, numPixels);

    var textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 512;

    var textureCtx = textureCanvas.getContext("2d");
    textureCtx.imageSmoothingEnabled = false;

    textureCtx.drawImage(resolutionCanvas,
    0, 0, 512, 512);

    lightMap.loadTexture(textureCanvas.toDataURL(), callback);
    //lightMap.loadTexture("img/box-template-0_texture.png");

    var ctx = squareCanvas.getContext("2d");

    var imgData = 
    resolutionCtx.getImageData(0, 0, numPixels, numPixels);
    var data = imgData.data;

    var red = 0;
    var green = 0;
    var blue = 0;

    var redFactor = 1;
    var greenFactor = 1;
    var blueFactor = 1;

    //console.log(data);

    newArray = new Array();
    for (var i = 0; i < data.length; i += 4) {
        // red
        red = data[i];
        // green
        green = data[i + 1];
        // blue
        blue = data[i + 2];
        //console.log(red+","+green+","+blue);
        var sum = redFactor + greenFactor + blueFactor;
        //console.log(sum);
        var diff = 
            (red * redFactor) + 
            (green * greenFactor) +
            (blue * blueFactor);
        //console.log(diff);
        diff = (1/255) * (diff/sum);
        //console.log(diff);
        newArray.push(diff);
    }
    set();
};

var createLightMap = function(url, callback) {
    var canvas = document.createElement("canvas");
    canvas.width = numPixels;
    canvas.height = numPixels;
    var ctx = canvas.getContext("2d");

    canvas.style.position = "fixed";
    canvas.style.right = "0px";
    canvas.style.bottom = "0px";

    canvas.onclick = function() {
       this.remove();
    };

    var img = document.createElement("img");
    img.ctx = ctx;
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        var x = 0;
        var y = 0;

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.drawImage(this, x, y);

        var imgData = 
        this.ctx.getImageData(0, 0, numPixels, numPixels);
        var data = imgData.data;

        var red = 0;
        var green = 0;
        var blue = 0;

        var redFactor = 1;
        var greenFactor = 1;
        var blueFactor = 1;

        //console.log(data);

        newArray = new Array();
        for (var i = 0; i < data.length; i += 4) {
            // red
            red = data[i];
            // green
            green = data[i + 1];
            // blue
            blue = data[i + 2];
            //console.log(red+","+green+","+blue);
            var sum = redFactor + greenFactor + blueFactor;
            //console.log(sum);
            var diff = 
                (red * redFactor) + 
                (green * greenFactor) +
                (blue * blueFactor);
            //console.log(diff);
            diff = (1/255) * (diff/sum);
            //console.log(diff);
            newArray.push(diff);
        }
        set();
    };
    img.src = url;
};