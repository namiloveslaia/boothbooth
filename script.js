const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countdownDisplay = document.getElementById("countdown");
const filters = document.querySelectorAll(".filter");
const captureBtn = document.getElementById("capture");
const downloadBtn = document.getElementById("download");
const errorMsg = document.getElementById("error-message");
const retryBtn = document.getElementById("retry");

let currentFilter = ""; // No filter initially

// Function to ask for camera access
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            errorMsg.style.display = "none"; // Hide error message
        })
        .catch((err) => {
            console.error("Camera access error:", err);
            errorMsg.innerText = "⚠️ Camera access denied. Please allow camera permissions.";
            errorMsg.style.display = "block";
            retryBtn.style.display = "block"; // Show retry button
        });
}

// Call function on page load
startCamera();

// Retry button to request camera again
retryBtn.addEventListener("click", () => {
    startCamera();
    retryBtn.style.display = "none"; // Hide button after retrying
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
    let countdown = 3; // 3 seconds countdown
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

    // Flip & Apply Filter
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.filter = currentFilter;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Show download button
    downloadBtn.style.display = "block";
}

// Download Photo
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "pastel_photobooth.png";
    link.click();
});


