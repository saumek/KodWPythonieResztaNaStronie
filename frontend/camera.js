function takePhoto(){
    let canvas = document.createElement('canvas');
    let video = document.getElementById('cameraVideo');

    video.addEventListener("animationend",(event)=>{
        video.style.animation = ''
    });
    video.style.animation = "takePhoto 0.3s linear";
    
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    let ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage( video, 0, 0, canvas.width, canvas.height );

    canvas.toBlob(async (blob) => {
        if (!blob) {
            console.error("Nie udało się utworzyć zdjęcia");
            return;
        }

        const formData = new FormData();

        formData.append("description", " ");
        formData.append("file", blob);

        const response = await fetch("/api/storefile", {
            method: "POST",
            body: formData
        }); 

        if (!response.ok) {
            console.error("Błąd wysyłania:", response.status);
            alert("nie udalo się - spróbuj jeszcze raz")
            return;
        }
        const result = await response.json();
        console.log(result);
    }, "image/jpeg", 0.9);
            
}