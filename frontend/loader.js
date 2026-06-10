document.addEventListener("DOMContentLoaded",async (e)=>{
    console.log(window.location.href);
    
    const response = await fetch("./templates/gallery.html");
    this.galleryTMP = await response.text();
    document.querySelectorAll(".main-div")[0]
    this.cameraTMP = ""
    openGallery()
})

async function openGallery(){
    document.querySelectorAll(".main-div")[0].innerHTML=this.galleryTMP
    // zakomentowalam bo blokowalo await startGallery()
}

async function openCamera(){
    if(this.cameraTMP==""){
    const response = await fetch("./templates/camera.html");
    this.cameraTMP = await response.text();
    }
    document.querySelectorAll(".main-div")[0].innerHTML = this.cameraTMP
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