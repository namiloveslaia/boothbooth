const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const recordedVideo = document.getElementById("recordedVideo");
const countdownDisplay = document.getElementById("countdown");
const filters = document.querySelectorAll(".filter");
const captureBtn = document.getElementById("capture");
const recordBtn = document.getElementById("record");
const stopBtn = document.getElementById("stop");
const downloadBtn = document.getElementById("download");
const photoModeBtn = document.getElementById("photoMode");
const videoModeBtn = document.getElementById("videoMode");

let mediaRecorder;
let recordedChunks = [];
let currentFilter = ""; // No filter initially
let isPhotoMode = true; // Default mode

// Start Camera
function startCamera() {
    const constraints = {
        video: {
            facingMode: "user", // Front camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error("Camera access error:", err);
            alert("⚠️ Camera access failed. Please allow camera permissions.");
        });
}

// Initialize Camera on Load
startCamera();

// Switch to Photo Mode
photoModeBtn.addEventListener("click", () => {
    isPhotoMode = true;
    captureBtn.style.display = "block";
    recordBtn.style.display = "none";
    stopBtn.style.display = "none";
    recordedVideo.style.display = "none";
    downloadBtn.style.display = "none";
});

// Switch to Video Mode
videoModeBtn.addEventListener("click", () => {
    isPhotoMode = false;
    captureBtn.style.display = "none";
    recordBtn.style.display = "block";
    stopBtn.style.display = "none";
    recordedVideo.style.display = "none";
    downloadBtn.style.display = "none";
});

// Apply Filters
filters.forEach(filter => {
    filter.addEventListener("click", function () {
        currentFilter = this.dataset.filter;
        video.style.filter = currentFilter;
    });
});

// Capture Photo with Timer
captureBtn.addEventListener("click", () => {
    let countdown = 3;
    countdownDisplay.innerText = countdown;
    countdownDisplay.style.display = "block";

    const timer = setInterval(() => {
        countdown--;
        countdownDisplay.innerText = countdown;
        if (countdown <= 0) {
            clearInterval(timer);
            countdownDisplay.style.display = "none";
            takePhoto();
        }
    }, 1000);
});

// Take Photo
function takePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.filter = currentFilter;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    downloadBtn.style.display = "block";
    downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "photo.png";
        link.click();
    };
}

// Start Video Recording
recordBtn.addEventListener("click", () => {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(video.srcObject);
    mediaRecorder.start();
    
    recordBtn.style.display = "none";
    stopBtn.style.display = "block";

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data);
    };
});

// Stop Recording
stopBtn.addEventListener("click", () => {
    mediaRecorder.stop();
    stopBtn.style.display = "none";
    recordBtn.style.display = "block";

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/mp4" });
        recordedVideo.src = URL.createObjectURL(blob);
        recordedVideo.style.display = "block";

        downloadBtn.style.display = "block";
        downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.href = recordedVideo.src;
            link.download = "video.mp4";
            link.click();
        };
    };
});


