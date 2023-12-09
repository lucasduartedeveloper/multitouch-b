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

    var geometry = new THREE.ConeGeometry( 5, 5, 4 ); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffff00,
        opacity: 0.5,
        transparent: true
    } );
    var cone = new THREE.Mesh(geometry, material ); 
    //group.add( cone );

    cone.rotation.y = -(Math.PI/4);

    var geometry = new THREE.SphereGeometry( 0.2, 32 ); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0x555555
    } );
    center = new THREE.Mesh(geometry, material ); 
    group.add( center );

    center.position.x = -4;
    center.position.y = 0;
    center.position.z = 4;
    center.rotation.x = -(Math.PI/2);
    center.rotation.z = -(Math.PI/2);

    var arrX = [ -0.25, 0.25, -0.25, 0.25, -0.25, 0.25, -0.25, 0.25 ];
    var arrY = [ 0.25, 0.25, -0.25, -0.25, 0.25, 0.25, -0.25, -0.25 ];
    var arrZ = [ -0.25, -0.25, -0.25, -0.25, 0.25, 0.25, 0.25, 0.25 ];

    // right, left, top, bottom, front, back
    var materialOpacity = [
        [ 0.35, 0.7, 0.7, 0.35, 0.35, 0.7 ],
        [ 0.7, 0.35, 0.7, 0.35, 0.35, 0.7 ],
        [ 0.35, 0.7, 0.35, 0.7, 0.35, 0.7 ],
        [ 0.7, 0.35, 0.35, 0.7, 0.35, 0.7 ],
        [ 0.35, 0.7, 0.7, 0.35, 0.7, 0.35 ],
        [ 0.7, 0.35, 0.7, 0.35, 0.7, 0.35 ],
        [ 0.35, 0.7, 0.35, 0.7, 0.7, 0.35 ],
        [ 0.7, 0.35, 0.35, 0.7, 0.7, 0.35 ]
    ];

    var hyp = 1+(lineWidth/25);

    var parts = [];
    for (var n = 0; n < 8; n++) {
        var geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 ); 
        var material = new THREE.MeshBasicMaterial( {
            color: 0x9999ff,
            transparent: true
        } );

        var materials = [
            material.clone(),
            material.clone(),
            material.clone(),
            material.clone(),
            material.clone(),
            material.clone()
        ];
        for (var k = 0; k < 6; k++) {
            materials[k].opacity = materialOpacity[n][k];
        }

        part0 = new THREE.Mesh(geometry, materials );
        part0.position.x = arrX[n] * hyp;
        part0.position.y = arrY[n] * hyp;
        part0.position.z = arrZ[n] * hyp;

        // wireframe
        var geo = new THREE.EdgesGeometry( part0.geometry ); 
        // or WireframeGeometry
        var mat = 
        new THREE.LineBasicMaterial( { color: 0xaaaaaff } );
        var wireframe = new THREE.LineSegments( geo, mat );
        part0.add( wireframe );

        parts.push(part0);
        //scene.add(part0);
    }

    loadOBJ("img/box-template-0.obj", function(object) {
        object.position.y = 0;
        object.rotation.x = -(Math.PI/2);
        object.rotation.z = -(Math.PI);

        //object.scale.set(0.5, 0.5, 0.5);

        object.loadTexture("img/box-template-0_texture.png");
        //scene.add(object)
    });

    var geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0xFFFFFF,
        transparent: true
    } );

    var materials = [
        material.clone(),
        material.clone(),
        material.clone(),
        material.clone(),
        material.clone(),
        material.clone()
    ];
    for (var k = 0; k < 6; k++) {
        materials[k].opacity = 1;
    }

    boxObj = new THREE.Mesh(geometry, materials );
    boxObj.position.x = 0;
    boxObj.position.y = 0;
    boxObj.position.z = 0;

    scene.add(boxObj);

    var geometry = new THREE.CylinderGeometry( 0.05, 0.05, 5 ); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0x555555
    } );
    axisX = new THREE.Mesh(geometry, material ); 
    group.add( axisX );

    axisX.position.x = -1.5;
    axisX.position.y = 0;
    axisX.position.z = 4;
    axisX.rotation.x = -(Math.PI/2);
    axisX.rotation.z = -(Math.PI/2);

    var geometry = new THREE.ConeGeometry( 0.15, 0.5, 32 ); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0x555555,
    } );
    var axisXend = new THREE.Mesh(geometry, material ); 
    group.add( axisXend );

    axisXend.position.x = 1;
    axisXend.position.y = 0;
    axisXend.position.z = 4;
    axisXend.rotation.x = -(Math.PI/2);
    axisXend.rotation.z = -(Math.PI/2);

    var geometry = new THREE.CylinderGeometry( 0.05, 0.05, 5 ); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0x555555 
    } );
    axisY = new THREE.Mesh(geometry, material ); 
    group.add( axisY );

    axisY.position.x = -4;
    axisY.position.y = 2.5;
    axisY.position.z = 4;
    //axisY.rotation.x = -(Math.PI/2);

    var geometry = new THREE.ConeGeometry( 0.15, 0.5, 32 ); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0x555555
    } );
    var axisYend = new THREE.Mesh(geometry, material ); 
    group.add( axisYend );

    axisYend.position.x = -4;
    axisYend.position.y = 5;
    axisYend.position.z = 4;
    //axisYend.rotation.x = -(Math.PI);

    var geometry = new THREE.CylinderGeometry( 0.05, 0.05, 5 ); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0x555555
    } );
    axisZ = new THREE.Mesh(geometry, material ); 
    group.add( axisZ );

    axisZ.position.x = -4;
    axisZ.position.y = 0;
    axisZ.position.z = 1.5;
    axisZ.rotation.x = -(Math.PI/2);

    var geometry = new THREE.ConeGeometry( 0.15, 0.5, 32 ); 
    var material = new THREE.MeshBasicMaterial( {
        color: 0x555555,
    } );
    var axisZend = new THREE.Mesh(geometry, material ); 
    group.add( axisZend );

    axisZend.position.x = -4;
    axisZend.position.y = 0;
    axisZend.position.z = -1;
    axisZend.rotation.x = -(Math.PI/2);

    /*var pos = new THREE.Vector3();
    createPackaging(
    "nicolediretora", "img/rect/texture-1.png", 1, pos);
    pos.x = 5.5;
    createPackaging(
    "jinjinn00_", "img/rect/texture-2.png", 2, pos);*/

    rec = new CanvasRecorder(renderer.domElement);

    virtualCamera.position.set(0, 7.5, 17.5);
    virtualCamera.lookAt(0, 7.5, 0);

    controls = new THREE.OrbitControls(virtualCamera,
    renderer.domElement);
    controls.target = new THREE.Vector3(0, 7.5, 0);
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

    render = true;
    iterations = 9999999999;
    animateThreejs = function() {
        iterations -= 1;
        if (iterations > 0 && render)
        req = requestAnimationFrame( animateThreejs );

        //if (!motionSensorAvailable)
        //group.rotation.z += 0.01;

        //group.rotation.x -= 0.01;

        var hyp = 1+(lineWidth/50);
        for (var n = 0; n < 8; n++) {
            parts[n].position.x = arrX[n] * hyp;
            parts[n].position.y = arrY[n] * hyp;
            parts[n].position.z = arrZ[n] * hyp;
        }

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
    animateThreejs();
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

var drawLabel = function(nick, callback) {
    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 100;

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 500, 100);

    ctx.fillStyle = "#000";
    ctx.font = "50px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(nick, 300, 50);

    var img = document.createElement("img");
    img.canvas = canvas;
    img.ctx = ctx;
    img.onload = function() {
        this.ctx.drawImage(this, 0, 0, 100, 100);
        callback(this.canvas.toDataURL());
    };
    img.src = "img/ig-logo.png";
};

var createPackaging = function(nick, url, size, offset) {
    var pos = offset.clone();

    var group = new THREE.Group();
    group.position.x = pos.x;
    group.position.y = pos.y;
    group.position.z = pos.z;

    var geometry = new THREE.PlaneGeometry( 5, 5 ); 
    var material = new THREE.MeshStandardMaterial( {
        //color: 0xffff00 
    } );
    plane = new THREE.Mesh(geometry, material ); 
    group.add( plane );

    plane.position.y = 0;
    plane.rotation.x = -(Math.PI/2);

    var geometry = new THREE.PlaneGeometry( 5, 5 ); 
    var material = new THREE.MeshStandardMaterial( {
        side: THREE.DoubleSide,
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
    } );
    planeTop = new THREE.Mesh(geometry, material ); 
    group.add( planeTop );

    planeTop.position.y = 15;
    planeTop.rotation.x = -(Math.PI/2);

    var geometry = new THREE.PlaneGeometry( 5, 15 ); 
    var material = new THREE.MeshStandardMaterial( {
        side: THREE.DoubleSide,
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
    } );
    planeLeft = new THREE.Mesh(geometry, material ); 
    group.add( planeLeft );

    planeLeft.position.y = 7.5;
    planeLeft.position.x = -2.5;
    planeLeft.rotation.y = -(Math.PI/2);

    planeRight = new THREE.Mesh(geometry, material ); 
    group.add( planeRight );

    planeRight.position.y = 7.5;
    planeRight.position.x = +2.5;
    planeRight.rotation.y = -(Math.PI/2);

    planeBack = new THREE.Mesh(geometry, material ); 
    group.add( planeBack );

    planeBack.position.y = 7.5;
    planeBack.position.z = -2.5;

    planeFront = new THREE.Mesh(geometry, material ); 
    group.add( planeFront );

    planeFront.position.y = 7.5;
    planeFront.position.z = 2.5;

    loadRectangle(url, size, group);

    drawLabel(nick, function(url) {
        var geometry = new THREE.PlaneGeometry( 5, 1 ); 
        var material = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
            opacity: 1,
            transparent: true
         } );
         label = new THREE.Mesh(geometry, material ); 
         group.add( label );

         label.position.x = 0;
         label.position.y = 14.5;
         label.position.z = 2.55;

         label.loadTexture(url);
    });

    scene.add(group);
};

var loadRectangle = function(url, size, group) {
    var img = document.createElement("img");
    img.onload = function() {
        var width = (5/size);
        var height = (5*(this.height/this.width))/size;
        var geometry = new THREE.PlaneGeometry( width, height ); 
        var material = new THREE.MeshBasicMaterial( {
            side: THREE.DoubleSide,
            color: 0xffffff
        } );
       rectangle = new THREE.Mesh(geometry, material ); 
       group.add(rectangle);

       rectangle.position.y = (height/2)+(Math.abs(1-size)*height);
       rectangle.position.x = 0;
       rectangle.loadTexture(url);

       if (size > 1) {
           var geometry = 
           new THREE.CylinderGeometry( 0.1, 0.1, 5, 32 );
           var material = new THREE.MeshBasicMaterial( {
                side: THREE.DoubleSide,
                color: 0xffffff
           } );
           left = new THREE.Mesh(geometry, material ); 
           group.add(left);
           left.position.x = -0.5;
           left.position.y = 2.5;

           var geometry = 
           new THREE.CylinderGeometry( 0.1, 0.1, 5, 32 );
           var material = new THREE.MeshBasicMaterial( {
                side: THREE.DoubleSide,
                color: 0xffffff
           } );
           right = new THREE.Mesh(geometry, material ); 
           group.add(right);
           right.position.x = 0.5;
           right.position.y = 2.5;
       }
    };
    img.src = url;
};

THREE.Object3D.prototype.loadTexture = 
function(url, type="D") {
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