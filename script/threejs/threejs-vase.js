var updateShape = function() {
    var previousPolygonX = previousImagePolygonX;
    var polygonX = imagePolygonX;
    var previousPolygonY = previousImagePolygonY;
    var polygonY = imagePolygonY;

    //console.log(polygon);
    group.clear();

    var previousNewPolygonX = [];
    for (var n = 0; n < ((previousPolygonX.length)/(sw/20)); n++) {
    var count = 0;
    var sum = 0;
    for (var k = 0; k < (sw/20); k++) {
        if (((n*(sw/20))+k) > (previousPolygonX.length-1))
        break;

        count += 1;
        sum += 
        ((previousPolygonX[(n*(sw/20))+k][0]+
        previousPolygonX[(n*(sw/20))+k][1])/2);
    }
    previousNewPolygonX[n] = (sum/count);
    }

    var previousNewPolygonY = [];
    for (var n = 0; n < ((previousPolygonY.length)/(sw/20)); n++) {
    var count = 0;
    var sum = 0;
    for (var k = 0; k < (sw/20); k++) {
        if (((n*(sw/20))+k) > (previousPolygonY.length-1))
        break;

        count += 1;
        sum += 
        ((previousPolygonY[(n*(sw/20))+k][0]+
        previousPolygonY[(n*(sw/20))+k][1])/2);
    }
    previousNewPolygonY[n] = (sum/count);
    }

    var previousNewPolygon = [];
    for (var y = 0; y < previousNewPolygonY.length; y++) {
        previousNewPolygon[y] = [];
    for (var x = 0; x < previousNewPolygonX.length; x++) {
        previousNewPolygon[y][x] = 
        (previousNewPolygonY[y] +
        previousNewPolygonY[x])/2;
    }
    }

    var newPolygonX = [];
    for (var n = 0; n < ((polygonX.length)/(sw/20)); n++) {
    var count = 0;
    var sum = 0;
    for (var k = 0; k < (sw/20); k++) {
        if (((n*(sw/20))+k) > (polygonX.length-1))
        break;

        count += 1;
        sum += 
        ((polygonX[(n*(sw/20))+k][0]+
        polygonX[(n*(sw/20))+k][1])/2);
    }
    newPolygonX[n] = (sum/count);
    }

    var newPolygonY = [];
    for (var n = 0; n < ((polygonY.length)/(sw/20)); n++) {
    var count = 0;
    var sum = 0;
    for (var k = 0; k < (sw/20); k++) {
        if (((n*(sw/20))+k) > (polygonY.length-1))
        break;

        count += 1;
        sum += 
        ((polygonY[(n*(sw/20))+k][0]+
        polygonY[(n*(sw/20))+k][1])/2);
    }
    newPolygonY[n] = (sum/count);
    }

    var newPolygon = [];
    for (var y = 0; y < newPolygonY.length; y++) {
        newPolygon[y] = [];
    for (var x = 0; x < newPolygonX.length; x++) {
        newPolygon[y][x] = 
        (newPolygonY[y] +
        newPolygonY[x])/2;
    }
    }

    previousNewPolygonY.reverse();
    newPolygonY.reverse();

    var vertexArr = [];
    for (var w = 0; w < 20; w++) {
    for (var n = 0; n < newPolygonY.length; n++) {
        var polygon = w < 10 ?
        newPolygonY : previousNewPolygonY;

        var c = { x: 0, y: 0 };
        var p = { x: 1-(polygon[n]), y: 0 };
        var rp = _rotate2d(c, p, w*(360/20));

        var y = -1+
        ((2/polygon.length)*n);

        vertexArr.push(parseFloat(rp.x.toFixed(2)));
        vertexArr.push(parseFloat(y.toFixed(2)));
        vertexArr.push(parseFloat(rp.y.toFixed(2)));

        var geometry = new THREE.SphereGeometry(0.01, 32); 
        var material = new THREE.MeshBasicMaterial( {
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

    vertexArr = new Float32Array(vertexArr);
    //console.log(vertexArr);

    var indiceArr = [];
    for (var w = 1; w < 20; w++) {
    for (var n = 0; n < (newPolygon.length-1); n++) {
        var a = (((w-1)*newPolygon.length)+n);
        var b = ((w*newPolygon.length)+n);
        var c = (((w-1)*newPolygon.length)+(n+1));
        var d = ((w*newPolygon.length)+(n+1));

        indiceArr.push(a);
        indiceArr.push(b);
        indiceArr.push(d);

        indiceArr.push(a);
        indiceArr.push(c);
        indiceArr.push(d);
    }
    }

    for (var n = 0; n < (newPolygon.length-1); n++) {
        var a = (((19)*newPolygon.length)+n);
        var b = ((0*newPolygon.length)+n);
        var c = (((19)*newPolygon.length)+(n+1));
        var d = ((0*newPolygon.length)+(n+1));

        indiceArr.push(a);
        indiceArr.push(b);
        indiceArr.push(d);

        indiceArr.push(a);
        indiceArr.push(c);
        indiceArr.push(d);
    }

    //console.log(indiceArr);

    var geometry = new THREE.BufferGeometry();

    geometry.setIndex( indiceArr );
    geometry.setAttribute( "position", 
        new THREE.BufferAttribute( vertexArr, 3 ) );

    var material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
        wireframe: true
    } );
    var mesh = new THREE.Mesh(geometry, material );
    mesh.loadTexture(pictureView.toDataURL());
    //mesh.loadTexture("img/box-template-0_texture.png");

    group.add(mesh);
}