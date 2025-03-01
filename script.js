function openCamera() {
    window.location.href = "mode-selection.html";
}

function goToPhoto() {
    window.location.href = "photo-mode.html";
}

function goToBoomerang() {
    window.location.href = "boomerang-mode.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const filterSelect = document.getElementById("filter");

    if (video) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
        });

        // Apply live filter preview
        filterSelect.addEventListener("change", () => {
            video.style.filter = filterSelect.value;
        });

        function capturePhoto() {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.filter = filterSelect.value;
            context.translate(canvas.width, 0);
            context.scale(-1, 1); // Ensures mirror effect
            context.drawImage(video, 0, 0, -canvas.width, canvas.height);
        }

        window.capturePhoto = capturePhoto;
    }
});
