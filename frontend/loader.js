import { startGestureSystem } from "./gestureController.js";

let cameraTMP = "";
let galleryTMP = "";

// wystawiamy do HTML (onclick)
window.openCamera = openCamera;
window.openGallery = openGallery;

document.addEventListener("DOMContentLoaded", async () => {
    console.log("INIT");

    // wczytaj galerię
    const response = await fetch("./templates/gallery.html");
    galleryTMP = await response.text();

    // odpal system gestów (kamera w tle)
    startGestureSystem(ws);

    // pokaż galerię na start
    openGallery();
});

async function openGallery(){
    document.querySelector(".main-div").innerHTML = galleryTMP;

    // to ładuje kategorie + pliki
    if (typeof startGallery === "function") {
        await startGallery();
    } else {
        console.error("startGallery nie istnieje");
    }
}

async function openCamera(){
    if (cameraTMP === "") {
        const response = await fetch("./templates/camera.html");
        cameraTMP = await response.text();
    }

    
    document.querySelector(".main-div").innerHTML = cameraTMP;
    // tylko podgląd (nie wysyłanie do WS)
    await startCamera();
    // to ładuje kategorie + pliki
    if (typeof cameraInit === "function") {
        await cameraInit();
    } else {
        console.error("cameraInit nie istnieje");
    }
}

async function startCamera(){
    const video = document.querySelector("#cameraVideo");

    if (!video) {
        console.error("Brak video");
        return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });

    video.srcObject = stream;
    video.style.transform = "scaleX(-1)";
    await video.play();
    console.log("CAMERA UI STARTED");
}

/*let cameraTMP = "";
let galleryTMP = "";

document.addEventListener("DOMContentLoaded",async (e)=>{
    console.log(window.location.href);
    
    const response = await fetch("./templates/gallery.html");
    document.querySelectorAll(".main-div")[0]
    openGallery()
})

async function openGallery(){
    document.querySelectorAll(".main-div")[0].innerHTML=galleryTMP
    // zakomentowalam bo blokowalo
    await startGallery()
}

async function openCamera(){
    if(cameraTMP==""){
    const response = await fetch("./templates/camera.html");
    cameraTMP = await response.text();
    }
    document.querySelectorAll(".main-div")[0].innerHTML = cameraTMP
    //startPhotos()
    startCamera()
}

async function startCamera(){
    const video = document.querySelector("#cameraVideo");
    const canvas = document.querySelector("#cameraCanvas");

    if(!video || !canvas){
        console.error("Brak video lub canvas");
        return;
    }

    const ctx = canvas.getContext("2d");

    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });

    video.srcObject = stream;
    await video.play();

    // czekam aż video ma wymiary
    await new Promise(r => setTimeout(r, 500));

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const sendFrame = () => {
        if (video.readyState !== 4) return;
        if (ws.readyState !== 1) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) return;

            blob.arrayBuffer().then(buffer => {
                ws.send(buffer);
            });
        }, "image/jpeg", 0.6);
    };

    setInterval(sendFrame, 100);

    console.log("START CAMERA");
}

import { startGestureSystem } from "./gestureController.js";

window.openCamera = openCamera;
window.openGallery = openGallery;

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("./templates/gallery.html");
    galleryTMP = await response.text();
    startGestureSystem(ws); // KLUCZOWE
    openGallery();
});*/