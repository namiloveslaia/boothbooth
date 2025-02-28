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

const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const filters = document.querySelectorAll(".filter");
const captureBtn = document.getElementById("capture");
const downloadBtn = document.getElementById("download");
let currentFilter = ""; // Default: No filter

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => console.error("Error accessing camera:", err));

// Apply filter when a button is clicked
filters.forEach(filter => {
  filter.addEventListener("click", function () {
    currentFilter = this.dataset.filter;
    video.style.filter = currentFilter;
  });
});

// Capture the photo
captureBtn.addEventListener("click", function () {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the flipped video frame
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1); // Flip horizontally
  ctx.filter = currentFilter; // Apply filter
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Enable download button
  downloadBtn.style.display = "block";
});

// Download the image
downloadBtn.addEventListener("click", function () {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "photo.png";
  link.click();
});

