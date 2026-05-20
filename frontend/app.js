document.addEventListener("DOMContentLoaded",async (e)=>{
    
  load_categories()
  load_files()
  this.isAddCategoryWindowOpen = false
  this.isFileOpen = false
})

async function load_categories(){
  const url = "/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    placeForCat = document.querySelectorAll(".kategorie")[0]
    placeForCat.innerHTML=''
    result.forEach(element => {
        console.log(element)
        placeForCat.innerHTML+=get_category_html(element[0],element[1])
    });
  } catch (error) {
    console.error(error.message);
  }
}

function get_category_html(id,name){
    return `
      <div catid=${id} class="group flex z-30 flex-row justify-between items-center bg-gray-900 border-gray-800 border-1 min-h-10 h-10 mr-1 rounded-4xl pl-3 pr-1.5 fill-red-100 hover:scale-102 duration-100 transition-all mb-2" onclick="select_category(self)">
        <button class="text-left">${name}</button>
        <button class="relative min-h-10 aspect-square transition-all duration-200 hover:scale-120 hover:fill-red-500 hover:rotate-12 opacity-0 group-hover:opacity-100">
          <svg class="" viewBox="-2.5 0 61 61" xmlns="http://www.w3.org/2000/svg"><defs><filter id="a" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="10" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" in="shadowBlurOuter1" result="shadowMatrixOuter1"/><feMerge><feMergeNode in="shadowMatrixOuter1"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path fill-rule="evenodd" d="M36 26v10.997c0 1.659-1.337 3.003-3.009 3.003h-9.981c-1.662 0-3.009-1.342-3.009-3.003v-10.997h16zm-2 0v10.998c0 .554-.456 1.002-1.002 1.002h-9.995c-.554 0-1.002-.456-1.002-1.002v-10.998h12zm-9-5c0-.552.451-1 .991-1h4.018c.547 0 .991.444.991 1 0 .552-.451 1-.991 1h-4.018c-.547 0-.991-.444-.991-1zm0 6.997c0-.551.444-.997 1-.997.552 0 1 .453 1 .997v6.006c0 .551-.444.997-1 .997-.552 0-1-.453-1-.997v-6.006zm4 0c0-.551.444-.997 1-.997.552 0 1 .453 1 .997v6.006c0 .551-.444.997-1 .997-.552 0-1-.453-1-.997v-6.006zm-6-5.997h-4.008c-.536 0-.992.448-.992 1 0 .556.444 1 .992 1h18.016c.536 0 .992-.448.992-1 0-.556-.444-1-.992-1h-4.008v-1c0-1.653-1.343-3-3-3h-3.999c-1.652 0-3 1.343-3 3v1z" filter="url(#a)"/></svg>
        </button>
      </div>`
}

async function load_files(){
  const url = "/api/files";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    placeForFiles = document.querySelectorAll(".files")[0]
    placeForFiles.innerHTML=''
    result.forEach(element => {
        console.log(element)
        placeForFiles.innerHTML+=get_file_html(element[0],element[1],element[2])
    });
  } catch (error) {
    console.error(error.message);
  }
}

function get_file_html(id,name,desc){
    return `
      <button class="group relative min-w-32 w-32 aspect-square overflow-hidden rounded-2xl border-gray-800 border-1 hover:scale-105 transition-all duration-100" onclick="openFile('${name}')">
        <img src="images/${name}" alt="${desc}" fileId=${id}>
        <div class="absolute bottom-0 right-0 left-0 bg-[#00000045] group-hover:opacity-100 opacity-0 transition-all duration-150">${desc}</div>
      </button>`
}

function createNewCategoryWindow(){
  if(!this.isAddCategoryWindowOpen){
    this.isAddCategoryWindowOpen = true
      document.querySelector("body").innerHTML+=`
        <div dodawaniekategori class="z-10 absolute flex flex-row top-0 right-0 bg-[#dfa7f911] left-0 bottom-0 align-middle justify-around items-center pb-30">
          <div class="relative bg-gray-800 w-100 h-50 rounded-4xl">
            <div class="relative top-2 left-0 right-0 text-center">Dodajesz nową kategorie</div>
            <form id="saveCat" class="relative left-0 right-0 top-15 flex flex-col items-center justify-around gap-6">
              <label class="relative w-[60%]">Nazwa:<input type="text" name="name" id="name" class="bg-gray-700 ml-2" required></label>
              <button type="submit" class=" hover:bg-gray-700 text-center rounded-4xl border-gray-700 transition-all duration-75 border-1 pt-1.5 pb-1.5 pl-3 pr-3">Zapisz</button>
            </form>
            <button onclick="closeAddCategory()" class="absolute top-2 right-4 hover:bg-gray-700 text-center aspect-square w-7 rounded-full border-gray-700 transition-all duration-75 border-1"> 
              <div class="absolute top-0 left-0 right-0 bottom-0 text-center">x</div>
            </button>
          </div>
        </div>
      `
    form = document.getElementById("saveCat")
    form.addEventListener("submit",(event)=>{onAddCategorySubmit(form,event)})
  }
}

function openFile(name){
  if(!this.isFileOpen){

    document.querySelector("body").innerHTML+=`
        <div filePreview class="z-30 absolute flex flex-row top-0 right-0 bg-[#000000bb] left-0 bottom-0 align-middle justify-around items-center pb-30">
          <img class="relative bg-gray-800 max-w-[80vw] max-h-[90dvh] rounded-4xl" src="images/${name}">
          </img>
          <button onclick="closePreview()" class="absolute top-8 right-10 hover:bg-gray-700 text-center aspect-square w-11 rounded-full border-gray-700 transition-all duration-75 border-1"> 
            <div class="absolute top-0 left-0 right-0 bottom-0 text-center text-3xl">x</div>
          </button>
        </div>
      `

  }
}

function closeAddCategory(){
  document.querySelectorAll("div[dodawaniekategori]")[0].remove()
  this.isAddCategoryWindowOpen=false
}
function closePreview(){
  document.querySelectorAll("div[filePreview]")[0].remove()
  this.isFileOpen=false
}

function onAddCategorySubmit(form, event){
  event.preventDefault();
  catname = form.querySelectorAll("input")[0].value
  saveCat(catname)
  closeAddCategory()
}

async function saveCat(catname){
  await fetch("/api/storecategory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: catname,
    }),
  });
  load_categories()
}