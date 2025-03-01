  document.addEventListener("DOMContentLoaded", () => {
      const video = document.getElementById("camera");
      const filterSelect = document.getElementById("filter");
      const toggleMirrorButton = document.getElementById("toggle-mirror");
      let isMirrored = false;

      const constraints = {
          video: {
              facingMode: "user"
          }
      };

      function startCamera() {
          navigator.mediaDevices.getUserMedia(constraints)
              .then(stream => {
                  video.srcObject = stream;
              })
              .catch(error => console.error("Error accessing camera:", error));
      }

      startCamera();

      filterSelect.addEventListener("change", () => {
          video.style.filter = filterSelect.value;
      });

      toggleMirrorButton.addEventListener("click", () => {
          isMirrored = !isMirrored;
          video.style.transform = isMirrored ? "scaleX(-1)" : "scaleX(1)";
      });
  });

