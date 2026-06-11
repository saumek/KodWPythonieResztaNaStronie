
let video = null;
let canvas = null;
let ctx = null;
let stream = null;
let running = false;

export async function startGestureSystem(ws) {
    if (running) return;
    running = true;

    video = document.createElement("video");
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });

    video.srcObject = stream;
    await video.play();

    await new Promise(r => setTimeout(r, 500));

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setInterval(() => {
        if (video.readyState !== 4) return;
        if (ws.readyState !== 1) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) return;

            blob.arrayBuffer().then(buffer => {
                ws.send(buffer);
            });
        }, "image/jpeg", 0.6);

    }, 100);

    console.log("GESTURE SYSTEM STARTED");
}