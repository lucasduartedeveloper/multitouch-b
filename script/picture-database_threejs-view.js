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

    //createPlane4();
    //lightMap.visible = false;

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

var updateShape = function(polygon) {
    group.clear();

    var newPolygon = [];
    for (var n = 0; n < ((polygon.length)/(sw/2)); n++) {
    var count = 0;
    var sum = 0;
    for (var k = 0; k < 2; k++) {
        if (((n*2)+k) > (polygon.length-1))
        break;

        count += 1;
        sum += 
        ((polygon[(n*5)+k][0]+polygon[(n*5)+k][1])/2);
    }
    newPolygon[n] = (sum/count);
    }

    //console.log(polygon, newPolygon);

    var vertexArr = [ ];
    for (var w = 0; w < 4; w++) {
    for (var n = 0; n < newPolygon.length; n++) {
        var c = { x: 0, y: 0 };
        var p = { x: (newPolygon[n]), y: 0 };
        var rp = _rotate2d(c, p, w*(360/4));

        var y = (2/newPolygon.length)*(-(newPolygon.length/2)+n);

        vertexArr.push(rp.x);
        vertexArr.push(y);
        vertexArr.push(rp.y);

        var geometry = new THREE.SphereGeometry(0.01, 32); 
        var material = new THREE.MeshStandardMaterial( {
            color: 0x55ff55,
            opacity: 0.5,
            transparent: true
        } );
       var sphere = new THREE.Mesh(geometry, material );

       group.add( sphere );
       sphere.position.x = rp.x;
       sphere.position.y = y;
       sphere.position.z = rp.y;
    }
    }
    console.log(vertexArr);

    var indiceArr = [];
    for (var w = 0; w < 4; w++) {
    for (var n = 1; n < newPolygon.length; n++) {
        var a = (((n-1)*newPolygon.length)+w);
        var b = ((n*newPolygon.length)+w);
        var c = (((n-1)*newPolygon.length)+(w+1));
        var d = ((n*newPolygon.length)+(w+1));

        indiceArr.push(a);
        indiceArr.push(b);
        indiceArr.push(d);

        indiceArr.push(a);
        indiceArr.push(c);
        indiceArr.push(d);
    }
    }
    console.log(indiceArr);

    var geometry = 
    new THREE.PolyhedronGeometry(
    vertexArr, indiceArr, 1, 2 );
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var mesh = new THREE.Mesh(geometry, material );

    group.add(mesh);
}

var setTexture = function(no, dataURL) {
    new THREE.TextureLoader().load(
    dataURL, 
    texture => {
        boxObj.material[no].map = texture;
        boxObj.material[no].needsUpdate = true;
    });
};

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

var charList = "abcd";
var rnd = charList[Math.floor(Math.random()*4)];
var code = 
"var _"+rnd+" = function(side) {\n"+
    "var result = Math.sqrt(\n"+
        "Math.pow(side, 2)+\n"+
        "Math.pow((side/2), 2)\n"+
    ");\n"+
    "return result;\n"+
"};";

eval(code);