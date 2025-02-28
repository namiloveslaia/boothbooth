const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Camera error:", err));

// Capture photo
function takePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}
const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function drawFlippedVideo() {
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    requestAnimationFrame(drawFlippedVideo);
}

// Start drawing when the video starts playing
video.addEventListener("play", drawFlippedVideo);
