var numPixels = 200;

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

var img_depth = [
    "img/image_color_height.png",
    "img/image_depth.png",
    "img/image_light_angle.png"
];

var imageDepthLoaded = false;
var loadImageDepth_array = function(callback) {
    var count = 0;
    for (var n = 0; n < img_depth.length; n++) {
        var img = document.createElement("img");
        img.n = n;
        img.onload = function() {
            count += 1;
            img_depth[this.n] = this;
            if (count == img_depth.length) {
                imageDepthLoaded = true;
                callback();
            }
        };
        var rnd = Math.random();
        img.src = img_depth[n]+"?f="+rnd;
    }
};

var colorHeight = [
    { r: 130, g: 60, b: 255, height: 1 },
    { r: 255, g: 255, b: 0, height: 2 },
];

var createLightMap_preloaded = function(callback) {
    var imageColorHeightCanvas = document.createElement("canvas");
    imageColorHeightCanvas.width = numPixels;
    imageColorHeightCanvas.height = numPixels;
    
    var imageColorHeightCtx = imageColorHeightCanvas.getContext("2d");
    imageColorHeightCtx.drawImage(img_depth[0], 0, 0, numPixels, numPixels);

    var imageDepthCanvas = document.createElement("canvas");
    imageDepthCanvas.width = numPixels;
    imageDepthCanvas.height = numPixels;
    
    var imageDepthCtx = imageDepthCanvas.getContext("2d");
    imageDepthCtx.drawImage(img_depth[1], 0, 0, numPixels, numPixels);

    var lightAngleCanvas = document.createElement("canvas");
    lightAngleCanvas.width = numPixels;
    lightAngleCanvas.height = numPixels;
    
    var lightAngleCtx = lightAngleCanvas.getContext("2d");
    lightAngleCtx.drawImage(img_depth[2], 0, 0, numPixels, numPixels);

    var resolutionCanvas = document.createElement("canvas");
    resolutionCanvas.width = numPixels;
    resolutionCanvas.height = numPixels;

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.drawImage(squareCanvas,
    0, 0, numPixels, numPixels);

    var ctx = squareCanvas.getContext("2d");

    var colorHeightImgData = 
    imageColorHeightCtx.getImageData(0, 0, numPixels, numPixels);
    var colorHeightData = colorHeightImgData.data;
    
    var depthImgData = 
    imageDepthCtx.getImageData(0, 0, numPixels, numPixels);
    var depthData = depthImgData.data;

    var angleImgData = 
    lightAngleCtx.getImageData(0, 0, numPixels, numPixels);
    var angleData = angleImgData.data;

    var imgData = 
    resolutionCtx.getImageData(0, 0, numPixels, numPixels);
    var data = imgData.data;

    var newImageArray = new Uint8ClampedArray(data);
    for (var i = 0; i < data.length; i += 4) {
        newImageArray[i] = colorHeightData[i] != 0 ? data[i] : 0;
        newImageArray[i + 1] = colorHeightData[i + 1] != 0 ? data[i + 1] : 0;
        newImageArray[i + 2] = colorHeightData[i + 2] != 0 ? data[i + 2] : 0;
        //newImageArray[i + 3] = colorHeightData[i] != 0 ? 255 : 0;
    }
    var newImageData = new ImageData(newImageArray, numPixels, numPixels);
    resolutionCtx.putImageData(newImageData, 0, 0);

    var textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 512;

    var textureCtx = textureCanvas.getContext("2d");
    textureCtx.imageSmoothingEnabled = false;

    textureCtx.drawImage(resolutionCanvas,
    0, 0, 512, 512);
    
    lightMap.loadTexture(textureCanvas.toDataURL(), callback);
    //lightMap.loadTexture("img/box-template-0_texture.png");

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
        red = /*angleData[i] + */ 
        (depthData[i] != 0 ? 
        colorHeightData[i] + ((depthData[i] + data[i])/2) : 0);
        // green
        green = /*angleData[i + 1] + */
        (depthData[i] != 0 ? 
        colorHeightData[i + 1] + ((depthData[i + 1] + data[i + 1])/2) : 0);
        // blue
        blue = /*angleData[i + 2] + */
        (depthData[i] != 0 ? 
        colorHeightData[i + 2] + ((depthData[i + 2] + data[i + 2])/2) : 0);
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