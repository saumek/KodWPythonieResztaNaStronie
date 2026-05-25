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
    startGallery()
}

async function openCamera(){
    if(this.cameraTMP==""){
    const response = await fetch("./templates/camera.html");
    this.cameraTMP = await response.text();
    }
    document.querySelectorAll(".main-div")[0].innerHTML = this.cameraTMP
    //startPhotos()

}