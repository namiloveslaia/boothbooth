onst video = document.getElementById("video");
const mirrorCanvas = document.getElementById("mirrorCanvas");
const ctxMirror = mirrorCanvas.getContext("2d");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countdown = document.getElementById("countdown");
const recordedVideo = document.getElementById("recordedVideo");
const downloadButton = document.getElementById("download");
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

// Access the camera with audio
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();

        // Mirror effect
        function drawMirroredVideo() {
            ctxMirror.save();
            ctxMirror.scale(-1, 1);
            ctxMirror.drawImage(video, -mirrorCanvas.width, 0, mirrorCanvas.width, mirrorCanvas.height);
            ctxMirror.restore();
            requestAnimationFrame(drawMirroredVideo);
        }
        drawMirroredVideo();
    })
    .catch(error => console.error("Camera access error:", error));

// Take Photo
function takePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    downloadButton.href = canvas.toDataURL("image/png");
    downloadButton.download = "photo.png";
}

document.getElementById("capture").addEventListener("click", () => {
    countdown.innerText = "3";
    setTimeout(() => { countdown.innerText = "2"; }, 1000);
    setTimeout(() => { countdown.innerText = "1"; }, 2000);
    setTimeout(() => { countdown.innerText = ""; takePhoto(); }, 3000);
});

// Start Video Recording
function startRecording() {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(video.srcObject, { mimeType: "video/webm" });
    mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
    mediaRecorder.onstop = saveVideo;
    mediaRecorder.start();
    isRecording = true;
}

document.getElementById("record").addEventListener("click", () => {
    startRecording();
    document.getElementById("record").style.display = "none";
    document.getElementById("stop").style.display = "inline-block";
});

document.getElementById("stop").addEventListener("click", () => {
    mediaRecorder.stop();
    document.getElementById("record").style.display = "inline-block";
    document.getElementById("stop").style.display = "none";
});

// Save Video
function saveVideo() {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    recordedVideo.src = url;
    recordedVideo.style.display = "block";
    downloadButton.href = url;
    downloadButton.download = "video.webm";
}

// Boomerang Effect
function captureBoomerang() {
    let frames = [];
    let captureInterval = setInterval(() => {
        let frame = document.createElement("canvas");
        frame.width = video.videoWidth;
        frame.height = video.videoHeight;
        let frameCtx = frame.getContext("2d");
        frameCtx.drawImage(video, 0, 0, frame.width, frame.height);
        frames.push(frame);
        if (frames.length >= 10) {
            clearInterval(captureInterval);
            playBoomerang(frames);
        }
    }, 100);
}

function playBoomerang(frames) {
    let index = 0;
    let playInterval = setInterval(() => {
        if (index >= frames.length) index = frames.length - 2;
        if (index < 0) clearInterval(playInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frames[index], 0, 0);
        index--;
    }, 100);
}

document.getElementById("boomerang").addEventListener("click", captureBoomerang);
