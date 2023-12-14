var audioDevice = 0;
var audioDevices = [];

if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
         devices.forEach(function(device) {
             if (device.kind == "audioinput")
             audioDevices.push({
                 kind: device.kind,
                 label: device.label,
                 deviceId: device.deviceId
             });
         });
         audioDeviceNo = audioDevices.length > 1 ? 
         (audioDevices.length-1) : 0;
    })
    .catch(function(err) {
         console.log(err.name + ": " + err.message);
    });
}

class EasyMicrophone {

    constructor() {
        var scope = this;

        // wave drawing setup
        this.audioContent = new AudioContext();
        this.analyser = 0;
        this.frequencyArray = [];
        this.audioStream = 0;
        this.frequencyLength = 0;

        // recording setup
        this.recordingQueue = [];
        this.audio = new Audio();
        this.mediaRecorder = 0;
        this.audioBlob = [];

        this.curve = false;
        this.clipArray = 0;

        this.onsuccess = function() { };
        this.onupdate = function() { };
        this.onclose = function() { };
        this.closed = true;
    }

    open(curve, clipArray=0) {
        this.closed = false;
        var scope = this;

        // configuration
        this.audioContent = new AudioContext();
        this.curve = curve;
        this.clipArray = clipArray;

        function soundAllowed(stream) {
            // configuration
            scope.audioStream = 
            scope.audioContent.createMediaStreamSource(stream);
            scope.analyser = scope.audioContent.createAnalyser();
            scope.audioStream.connect(scope.analyser);
            //scope.analyser.minDecibels = -200;
            scope.analyser.fftSize = 1024;

            scope.frequencyArray = 
            new Uint8Array(scope.analyser.frequencyBinCount);

            // enter rendering loop
            scope.onsuccess();
            scope.animate();
        }

        function soundNotAllowed(error) {
            console.log("EasyMicrophone: " + error);
        }

        // request microphone access
        navigator.mediaDevices.getUserMedia({
            audio: audioDevices.length == 1 ? true : {
            deviceId: { 
               exact: audioDevices[deviceNo].deviceId
            } }, 
        }).
        then((stream) => {
            soundAllowed(stream);
        }).
        catch((err) => {
            soundNotAllowed(err);
        });
    }

    close() {
        this.closed = true;

        // check stream is open
        if (this.audioStream.mediaStream)
        this.audioStream.mediaStream.getTracks()[0].stop();

        if(this.mediaRecorder) {
            this.mediaRecorder.stop();
        }
        this.onclose();
    }

    record() {
        var queueInterval = false;

        this.mediaRecorder = 
        new MediaRecorder(this.audioStream.mediaStream);

        var mimeType = this.mediaRecorder.mimeType;
        this.mediaRecorder.ondataavailable = 
        function(e) {
            this.audioBlob.push(e.data);
        }.bind(this);
        this.mediaRecorder.onstop = 
        function(e) {
            this.audioBlob = [];
            this.recordingQueue.push(this.audioBlob);

            console.log(
            "recording ended: queue length: "+
            this.recordingQueue.length);
        }.bind(this);

        queueInterval = setInterval(
        function() {
            this.mediaRecorder.stop();
            this.mediaRecorder.start();
        }.bind(this), 5000);

        this.playQueue();
    }

    playQueue() {
        var dequeueInterval = false;
        var audioEnded = true;

        this.audio.onended = function() {
             console.log(
             "audio ended: queue length: "+
             this.recordingQueue.length);
             audioEnded = true;
        }.bind(this);

        dequeueInterval = setInterval(
        function() {
            console.log(audioEnded, this.recordingQueue.length);
            if (this.recordingQueue.length < 2) return;
            if (audioEnded) {
                var audioBlob = 
                this.recordingQueue.splice(0, 1)[0];
                console.log(
                "dequeued audio: queue length: "+
                this.recordingQueue.length);

                var url = URL.createObjectURL(
                new Blob(audioBlob, 
                { type: "audio/webm;codecs=opus" }));

                audioEnded = false;
                this.audio.src = url;
                this.audio.play();
            }
        }.bind(this), 5000);
    }

    animate() {
        var animate = function() {
            this.animate()
        }.bind(this);

        this.analyser.getByteFrequencyData(this.frequencyArray);
        //console.log(this.frequencyArray.join(","));

        var floatArray = [];
        var sum = 0;
        var averageValue = 0;
        var topValue = 0;
        var reachedFrequency = 0;
        var adjustedLength = 0;

        // clip to reached frequency
        for (var i = 0 ; i < 255 ; i++) {
            if (this.frequencyArray[i] < topValue)
            topValue = this.frequencyArray[i];
            adjustedLength = this.frequencyArray[i];

            if (adjustedLength > 0) reachedFrequency = (i+1);
        }
        reachedFrequency = 
            reachedFrequency < this.clipArray ? 
            this.clipArray : (this.clipArray > 0 ? reachedFrequency : 
            this.frequencyArray.length);

        for (var i = 0 ; i < reachedFrequency ; i++) {
            if (this.frequencyArray[i] < topValue)
            topValue = this.frequencyArray[i];

            adjustedLength = this.frequencyArray[i];
            adjustedLength = (1/255)*adjustedLength;
            sum += adjustedLength;

            if (this.curve) {
                adjustedLength = 
                curve(adjustedLength);
            }

            floatArray.push(adjustedLength);
        }

        averageValue = (sum/reachedFrequency);
        averageValue = isNaN(averageValue) ? 0 : averageValue;
        this.onupdate(floatArray, reachedFrequency, averageValue);

        if (!this.closed) requestAnimationFrame(animate);
    }

    download(file_name) {
        const name = file_name || "recording.mp3";
        const url = this.audio.src;
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
}

function curve(value, limit=1) {
    var a = ((Math.PI*2)/limit)*value;
    var c = { x: 0, y: 0 };
    var p0 = { x: -1, y: 0 };
    var p1 = _rotate2d(c, p0, a, false);
    return (limit*p1.y)/2;
}

function _rotate2d(c, p, angle, deg=true) {
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