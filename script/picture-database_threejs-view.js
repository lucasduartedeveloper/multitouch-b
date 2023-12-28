var cameraParams = {
   fov: 75, aspectRatio: 1, near: 0.1, far: 50
};
var lightParams = {
   color: 0xffffff, intensity: 1, distance: 100, decay: 3
};
var $;
var renderer, scene, light, camera, box, eye;

/*import { StereoscopicEffects } from 'threejs-StereoscopicEffects';*/
//import { Interaction } from 'three.interaction';

var load3D = function() {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, preserveDrawingBuffer: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    // default THREE.PCFShadowMap
    renderer.setSize(500, 500);

    renderer.enable3d = 1;
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.display = "none";
    renderer.domElement.style.left = (0)+"px";
    renderer.domElement.style.top = ((sh/2)-(sw/2))+"px";
    renderer.domElement.style.width = (sw)+"px";
    renderer.domElement.style.height = (sw)+"px";
    //renderer.domElement.style.border = "1px solid #fff";
    //renderer.domElement.style.borderRadius = "50%";
    //renderer.domElement.style.scale = "0.8";
    //renderer.domElement.style.border = "2px solid #ccc";
    renderer.domElement.style.zIndex = "25";
    document.body.appendChild( renderer.domElement ); 

    scene = new THREE.Scene();
    //scene.background = null;
    scene.background = new THREE.Color("#000"); 

    light = new THREE.PointLight(
        lightParams.color,
        lightParams.intensity,
        lightParams.distance,
        lightParams.decay
    );

    light.position.set(0, 2.5, 2.5);
    light.castShadow = true;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default

    lightObj = new THREE.Group();
    //lightObj.add(light);

    virtualCamera = new THREE.PerspectiveCamera( 
        cameraParams.fov, 
        cameraParams.aspectRatio, 
        cameraParams.near, 
        cameraParams.far 
    );
    virtualCamera.add(light);

    scene.add(lightObj);
    scene.add(virtualCamera);

    group = new THREE.Group();
    //group.rotation.x = -(Math.PI/2);
    scene.add(group);

    var geometry = new THREE.SphereGeometry(0.01, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var sphere = new THREE.Mesh(geometry, material );
    group.add(sphere);

    rec = new CanvasRecorder(renderer.domElement);

    virtualCamera.position.set(0, 0, 5);
    virtualCamera.lookAt(0, 0, 0);

    controls = new THREE.OrbitControls(virtualCamera,
    renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.update();

    変数 = sw/1.2;

    const defaultEffect = 0; // Single view left
    //const defaultEffect = 21; // Anaglyph RC half-colors

    stereofx = new StereoscopicEffects(renderer, defaultEffect);
    stereofx.setSize(500, 500);

    renderer.domElement.style.width = (sw)+"px";
    renderer.domElement.style.height = (sw)+"px";

    modes = StereoscopicEffects.effectsListForm();
    modes.value = defaultEffect;
    modes.style.position = 'absolute';
    modes.style.display = "none";
    modes.style.fontFamily = "Khand";
    modes.style.textAlign = "center";
    modes.style.background = "#fff";
    modes.style.left = (((sw-変数)/2)+(sw/2)-(sw/2))+"px";+"px";
    modes.style.top = ((sw/9)*2)+"px";
    modes.style.width = (変数)+"px";
    modes.style.height = (sw/9)+"px";
    modes.style.zIndex = "15";
    modes.addEventListener('change', () => {
        stereofx.setEffect(modes.value);
    });
    document.body.appendChild(modes);

    eyeSep = document.createElement("input");
    eyeSep.type = "range";
    eyeSep.style.display = "none";
    eyeSep.min = -0.05;
    eyeSep.step = 0.05;
    eyeSep.max = 1;
    eyeSep.value = 0;
    eyeSep.style.position = 'absolute';
    eyeSep.style.background = "#fff";
    eyeSep.style.left = (((sw-変数)/2)+(sw/2)-(sw/2))+"px";
    eyeSep.style.top = ((sw/9)*3)+"px";
    eyeSep.style.width = (変数)+"px";
    eyeSep.style.height = (sw/9)+"px"
    eyeSep.style.zIndex = "15";
    eyeSep.addEventListener('change', () => {
        stereofx.setEyeSeparation(eyeSep.value);
    });
    stereofx.setEyeSeparation(eyeSep.value);
    document.body.appendChild(eyeSep);

    var rotationX = 0;
    var speedX = (Math.PI*2)/90;

    var rotationY = 0;
    var speedY = (Math.PI*2)/180;

    var canTexture = false;

    render = true;
    iterations = 9999999999;
    animateThreejs = function() {
        iterations -= 1;
        if (iterations > 0 && render)
        req = requestAnimationFrame( animateThreejs );

        controls.update();
        if (renderer.enable3d == 0) {
            renderer.render( scene, virtualCamera );
        }
        else if (renderer.enable3d == 1) {
            if (eyeSep.value < 0) 
            renderer.render( scene, virtualCamera );
            else stereofx.render( scene, virtualCamera );
        }
    };
    //animateThreejs();
}

var startAnimation = function() {
    render = true;
    animateThreejs();
};

var pauseAnimation = function() {
    render = false;
};

THREE.Object3D.prototype.loadTexture = 
function(url, callback, type="D") {
var rnd = Math.random();
new THREE.TextureLoader().load(url, 
    texture => {
        //Update Texture
        if (this.material) {
        if (type == "D") {
            //console.log("loaded texture");
            this.material.transparent = true;
            this.material.map = texture;
            this.material.needsUpdate = true;
        }
        else if (type == "N") {
            this.material.transparent = true;
            this.material.normalMap = texture;
            this.material.needsUpdate = true;
        }
        else if (type == "O") {
            this.material.transparent = true;
            this.material.alphaMap = texture;
            this.material.needsUpdate = true;
        }
        }
        else {
        if (type == "D") {
            //console.log("loaded texture obj");
            this.children[0].material.transparent = true;
            this.children[0].material.map = texture;
            this.children[0].material.needsUpdate = true;
        }
        else if (type == "N") {
            this.children[0].material.transparent = true;
            this.children[0].material.normalMap = texture;
            this.children[0].material.needsUpdate = true;
        }
        else if (type == "O") {
            this.children[0].material.transparent = true;
            this.children[0].material.alphaMap = texture;
            this.children[0].material.needsUpdate = true;
        }
        }

        if (callback)
        callback();
    },
    xhr => {
       //Download Progress
       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    error => {
       //Error CallBack
        console.log("An error happened", error);
    });
};

var loadOBJ = function(path, callback) {
    var loader = new THREE.OBJLoader();
    // load a resource
    // resource URL
    // called when resource is loaded
    loader.load(path, callback,
    // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
    // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
};

var numPixels = 250;

var createMesh = function(start, size) {
    var positionArr = [];
    var vertexArr = [];
    var uvs = [];

    for (var x = 0; x < numPixels; x++) {
    for (var y = 0; y < numPixels; y++) {
        var c = { x: 0, y: 0 };
        var p = { x: -1/(Math.PI/2), y: 0 };
        var rp = _rotate2d(c, p, start+(x*(size/numPixels)));

        var py = 1+
        ((-2/numPixels)*y);

        vertexArr.push(parseFloat(rp.x.toFixed(2)));
        vertexArr.push(parseFloat(py.toFixed(2)));
        vertexArr.push(parseFloat(rp.y.toFixed(2)));

        uvs.push(
           (1/(numPixels-1))*x, 
           (1/(numPixels-1))*((numPixels-1)-y));

        positionArr.push({
           x: rp.x, y: py, z: rp.y
        });
    }
    }

    vertexArr = new Float32Array(vertexArr);

    var indiceArr = [];
    for (var x = 1; x < numPixels; x++) {
    for (var y = 0; y < (numPixels-1); y++) {
        var a = (((x-1)*numPixels)+y);
        var b = ((x*numPixels)+y);
        var c = (((x-1)*numPixels)+(y+1));
        var d = ((x*numPixels)+(y+1));

        indiceArr.push(d);
        indiceArr.push(b);
        indiceArr.push(a);

        indiceArr.push(a);
        indiceArr.push(c);
        indiceArr.push(d);
    }
    }

    uvs = new Float32Array(uvs);

    var geometry = new THREE.BufferGeometry();

    geometry.setIndex( indiceArr );
    geometry.setAttribute( "position", 
        new THREE.BufferAttribute( vertexArr, 3 ) );
    geometry.setAttribute( "uv",  
        new THREE.Float32BufferAttribute( uvs, 2) );

    geometry.computeVertexNormals();

    var material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        opacity: 1, //0.5,
        transparent: true,
        //wireframe: true,
        side: THREE.FrontSide
    } );
    var mesh = new THREE.Mesh(geometry, material );

    var obj = {
        positionArr: positionArr,
        mesh: mesh
    };
    return obj;
};

var frontMesh = 0;
var backMesh = 0;

var createShape = function() {
    group.clear();

    var geometry = 
    new THREE.SphereGeometry(2.5, 32); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );

    sphereMesh = new THREE.Mesh(geometry, material );
    group.add(sphereMesh);

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.clearRect(0, 0, numPixels, numPixels);
    resolutionCtx.drawImage(pictureView,
    0, 0, numPixels, numPixels);

    new THREE.TextureLoader().load(
    resolutionCanvas.toDataURL(), 
    texture => {
        sphereMesh.material.transparent = true;
        sphereMesh.material.map = texture;
        sphereMesh.material.needsUpdate = true;
    });

    return;
    var geometry = 
    new THREE.CylinderGeometry(
    0.9/(Math.PI/2), 0.9/(Math.PI/2), 2, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0x888888,
        opacity: 0.5,
        transparent: true
    } );
    var cylinder = new THREE.Mesh(geometry, material );
    //group.add(cylinder);

    frontMesh = createMesh(0, 180);
    backMesh = createMesh(180, 180);

    //group.add(frontMesh.mesh);
    //group.add(backMesh.mesh);
};

var updateShape = function() {
    render = false;

    var resolutionCtx = resolutionCanvas.getContext("2d");
    resolutionCtx.imageSmoothingEnabled = false;

    resolutionCtx.clearRect(0, 0, numPixels, numPixels);
    resolutionCtx.drawImage(pictureView,
    0, 0, numPixels, numPixels);

    new THREE.TextureLoader().load(
    previousResolutionCanvas.toDataURL(), 
    texture => {
        cubeMesh.material[0].transparent = true;
        cubeMesh.material[0].map = texture;
        cubeMesh.material[0].needsUpdate = true;
    });

    new THREE.TextureLoader().load(
    resolutionCanvas.toDataURL(), 
    texture => {
        cubeMesh.material[1].transparent = true;
        cubeMesh.material[1].map = texture;
        cubeMesh.material[1].needsUpdate = true;
    });

    return;
    new THREE.TextureLoader().load(
    previousResolutionCanvas.toDataURL(), 
    texture => {
        backMesh.mesh.material.transparent = true;
        backMesh.mesh.material.map = texture;
        backMesh.mesh.material.needsUpdate = true;
    });

    new THREE.TextureLoader().load(
    resolutionCanvas.toDataURL(), 
    texture => {
        frontMesh.mesh.material.transparent = true;
        frontMesh.mesh.material.map = texture;
        frontMesh.mesh.material.needsUpdate = true;
    });

    var imgData = 
    resolutionCtx.getImageData(0, 0, numPixels, numPixels);
    var data = imgData.data;

    var positionArr = 
    frontMesh.positionArr;

    var vertexArray = 
    frontMesh.mesh.geometry.getAttribute("position").array;

    for (var x = 1; x < numPixels; x++) {
    for (var y = 0; y < (numPixels-1); y++) {

        var n = ((x*numPixels)+y)*4;
        var brightness = 
        (1/255) * 
        ((data[n] * grayscaleRatio[grayscaleNo][0]) + 
        (data[n + 1] * grayscaleRatio[grayscaleNo][1]) + 
        (data[n + 2] * grayscaleRatio[grayscaleNo][2]));
        reachedHeight = brightness > reachedHeight ? 
        brightness : reachedHeight;

        var a = (((x-1)*numPixels)+y);
        var b = ((x*numPixels)+y);
        var c = (((x-1)*numPixels)+(y+1));
        var d = ((x*numPixels)+(y+1));

        vertexArray[(a*3)] = 
        positionArr[a].x * (1+brightness);
        vertexArray[(a*3)+2] = 
        positionArr[a].z * (1+brightness);

        vertexArray[(b*3)] = 
        positionArr[b].x * (1+brightness);
        vertexArray[(b*3)+2] = 
        positionArr[b].z * (1+brightness);

        vertexArray[(c*3)] = 
        positionArr[c].x * (1+brightness);
        vertexArray[(c*3)+2] = 
        positionArr[c].z * (1+brightness);

        vertexArray[(d*3)] = 
        positionArr[d].x * (1+brightness);
        vertexArray[(d*3)+2] = 
        positionArr[d].z * (1+brightness);
    }
    }

    frontMesh.mesh.
    geometry.getAttribute("position").needsUpdate = true;

    render = true;
};

var createTexture = function() {
    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 500, 500);

    ctx.fillStyle = "#000";

    for (var x = 1; x < numPixels; x++) {
    for (var y = 0; y < (numPixels-1); y++) {
        if ((((x-1) % 2 == 0) && (y % 2 == 0)) || 
        (((x-1) % 2 == 1) && (y % 2 == 1)))
        ctx.fillRect((x-1)*(500/numPixels), y*(500/numPixels), 
        (500/numPixels), (500/numPixels));
    }
    }

    return canvas.toDataURL();
}