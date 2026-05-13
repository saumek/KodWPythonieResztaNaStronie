const galleryItems = Array.from(document.querySelectorAll("[data-gallery-item]"));
const lightbox = document.querySelector("[data-lightbox]");
let activeGalleryIndex = 0;

function openLightbox(index) {
  if (!lightbox || !galleryItems.length) {
    return;
  }

  activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeGalleryIndex];
  const image = item.querySelector("img");
  const label = item.querySelector("span")?.textContent || image.alt;

  lightbox.querySelector("[data-lightbox-image]").src = image.src;
  lightbox.querySelector("[data-lightbox-image]").alt = image.alt;
  lightbox.querySelector("[data-lightbox-caption]").textContent = label;
  lightbox.hidden = false;
  document.body.classList.add("has-lightbox");
  lightbox.querySelector("[data-lightbox-close]").focus();
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("has-lightbox");
}

function moveLightbox(step) {
  openLightbox(activeGalleryIndex + step);
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

if (lightbox) {
  lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => moveLightbox(-1));
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => moveLightbox(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      moveLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      moveLightbox(1);
    }
  });
}

const cameraVideo = document.querySelector("[data-camera-video]");
const cameraCanvas = document.querySelector("[data-camera-canvas]");
const cameraStatus = document.querySelector("[data-camera-status]");
const cameraStart = document.querySelector("[data-camera-start]");
const cameraCapture = document.querySelector("[data-camera-capture]");
let cameraStream = null;

async function startCamera() {
  if (!cameraVideo || !navigator.mediaDevices?.getUserMedia) {
    if (cameraStatus) {
      cameraStatus.textContent = "Ta przegladarka nie udostepnia kamery.";
    }
    return;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    cameraVideo.srcObject = cameraStream;
    cameraVideo.classList.add("is-active");
    cameraStatus.textContent = "Podglad kamery jest wlaczony.";
  } catch (error) {
    cameraStatus.textContent = "Nie udalo sie wlaczyc kamery.";
  }
}

function capturePhoto() {
  if (!cameraVideo || !cameraCanvas || !cameraVideo.videoWidth) {
    if (cameraStatus) {
      cameraStatus.textContent = "Najpierw wlacz podglad kamery.";
    }
    return;
  }

  cameraCanvas.width = cameraVideo.videoWidth;
  cameraCanvas.height = cameraVideo.videoHeight;
  cameraCanvas.getContext("2d").drawImage(cameraVideo, 0, 0);
  cameraCanvas.hidden = false;
  cameraStatus.textContent = "Zdjecie zostalo zrobione lokalnie jako podglad.";
}

cameraStart?.addEventListener("click", startCamera);
cameraCapture?.addEventListener("click", capturePhoto);
