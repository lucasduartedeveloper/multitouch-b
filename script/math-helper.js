var _rotate2d = function(c, p, angle, deg=true) {
    var cx = c.x;
    var cy = c.y;
    var x = p.x;
    var y = p.y;
    var radians = deg ? (Math.PI / 180) * angle : angle,
    cos = Math.cos(parseFloat(radians.toFixed(2))),
    sin = Math.sin(parseFloat(radians.toFixed(2))),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
};

var _angle2d = function(co, ca) {
    var h = Math.sqrt(
    Math.abs(Math.pow(co, 2)) + 
    Math.abs(Math.pow(ca, 2)));

    var senA = co/h;
    var a = Math.asin(senA);
    a = co == 0 && ca > 0 ? 1.5707963267948966 * 2 : a;
    a = co > 0 && ca > 0 ? 1.5707963267948966 * 2 - a : a;
    a = co < 0 && ca > 0 ? 1.5707963267948966 * 2 - a : a;

    return isNaN(a) ? 0 : a;
};

Math.clip = function(value, max) {
    if (value > max) value = max;
    if (value < 0) value = 0;
    return value;
};

Math.normalize = function(v, max=1) {
    var openning = ((Math.abs(v.x)+Math.abs(v.y))/2)*2;
    openning = Math.clip(openning, max);
    var a = _angle2d(v.x, v.y);
    var c = { x: 0, y: 0 };
    var p = { x: 0, y: -openning };
    var n = _rotate2d(c, p, -a, false);
    return n;
};

var centerBitmap = function(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    var imgData = 
    ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    var positionArr = [];
    for (var n = 0; n < data.length; n += 4) {
        var x = (n%canvas.width);
        var y = Math.floor(n/canvas.width);

        if (data[(n*4)+3] == 0)
        positionArr.push({ x: x, y: y });
    };

    console.log(
    ((100/(data.length/4))*positionArr.length).toFixed(2)+
    "% image detected");

    var minX = canvas.width;
    var minY = canvas.height;
    var maxX = 0;
    var maxY = 0;

    var sumX = 0;
    var sumY = 0;

    for (var n = 0; n < positionArr.length; n++) {
        minX = positionArr[n].x < minX ? positionArr[n].x : minX;
        minY = positionArr[n].y < minY ? positionArr[n].y : minY;
        maxX = positionArr[n].x > maxX ? positionArr[n].x : maxX;
        maxY = positionArr[n].y > maxY ? positionArr[n].y : maxY;

        sumX += positionArr[n].x;
        sumY += positionArr[n].y;
    }

    var width = maxX-minX;
    var height = maxY-minY;
    var size = width > height ? width : height;

    var centerX = sumX/positionArr.length;
    var centerY = sumY/positionArr.length;

    var left = centerX - (size/2);
    var top = centerX - (size/2);

    var resultCanvas = document.createElement("canvas");
    resultCanvas.width = 100;
    resultCanvas.height = 100;

    var resultCtx = resultCanvas.getContext("2d");

    resultCtx.drawImage(image, left, top, size, size,
    0, 0, 100, 100);

    return resultCanvas;
};