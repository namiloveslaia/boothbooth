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
    const startButton = document.getElementById("start-button");

    const constraints = {
        video: {
            facingMode: "user" // Ensures front camera is used on mobile
        }
    };

    function startCamera() {
        if (video) {
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    video.srcObject = stream;
                    video.play().catch(error => console.log("Autoplay blocked, waiting for user interaction."));
                })
                .catch(error => console.error("Error accessing camera:", error));
        }
    }

    // Fix for iOS & Android autoplay restrictions
    if (startButton) {
        startButton.addEventListener("click", () => {
            startCamera();
            startButton.style.display = "none"; // Hide button after starting
        });
    } else {
        startCamera(); // Start immediately if button is not required
    }

    // Apply live filter preview
    if (filterSelect) {
        filterSelect.addEventListener("change", () => {
            video.style.filter = filterSelect.value;
        });
    }

    // Capture photo with mirror effect
    function capturePhoto() {
        if (canvas && video) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Apply mirror effect to captured image
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.filter = filterSelect.value;
            context.drawImage(video, 0, 0, -canvas.width, canvas.height);
        }
    }

    window.capturePhoto = capturePhoto;
});
