
function startGallery(){
  load_categories()
  load_files()
  this.isSomethingOpen = false
}

async function load(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    
    return result

  } catch (error) {
    console.error(error.message);
    return []
  }
}

async function load_template(template,values){
  const response = await fetch(template);
  let tekst = await response.text();
  Object.entries(values).forEach(([name,value]) => {
      tekst = tekst.replaceAll('${'+`${name}`+'}',value)
  });
  tekst = tekst.replaceAll(/\$\{[^}]*\}/g,'') //usuwa pozostale znaczniki 
  return tekst
}

async function load_categories(){
  const url = "/api/categories";
 
  const result = await load(url)
  let placeForCat = document.querySelectorAll(".kategorie")[0]
  placeForCat.innerHTML=''
  this.Categories={}
  for (const element of result) {
    this.Categories[element[0]]={"id":element[0],"name":element[1]}
    placeForCat.innerHTML += await get_single_html_category_cell(this.Categories[element[0]])
  }
}

async function get_single_html_category_cell(element){
    return load_template("./templates/categoryCell.html",element)
}

async function load_files(){
  const url = "/api/files";
  const result = await load(url);
  let placeForFiles = document.querySelectorAll(".files")[0]
  placeForFiles.innerHTML=''
  this.Files = {}
  for (const element of result) {
    this.Files[element[0]]={"id":element[0],"name":element[1],"desc":element[2],"date":element[3]}
    placeForFiles.innerHTML += await get_single_html_file_cell(this.Files[element[0]])
  }
}

async function get_single_html_file_cell(element){
    return load_template("./templates/photoCell.html",element)
}

async function createNewCategoryWindow(){
  if(!this.isSomethingOpen){
    this.isSomethingOpen = true
    document.querySelector("body").innerHTML+= await load_template("./templates/createCategory.html",{})
    form = document.getElementById("saveCat")
    form.addEventListener("submit",(event)=>{onAddCategorySubmit(form,event)})
  }
}

async function renameCategory(id){
  if(!this.isSomethingOpen){
    this.isSomethingOpen = true
    document.querySelector("body").innerHTML+= await load_template("./templates/renameCategory.html",this.Categories[id])
    form = document.getElementById("changeCat")
    form.addEventListener("submit",(event)=>{onAddChangeCategoryNameSubmit(form,event)})
  }
}

async function openFile(id){
  if(!this.isSomethingOpen){
    this.isSomethingOpen=true
    document.querySelector("body").innerHTML += await load_template("./templates/openFile.html",this.Files[id])
  }
}

function closeAddCategory(){
  document.querySelectorAll("div[dodawaniekategori]")[0].remove()
  this.isSomethingOpen=false
}
function closeChangeCategoryName(){
  document.querySelectorAll("div[zmianaNazwyKategori]")[0].remove()
  this.isSomethingOpen=false
}
function closePreview(){
  document.querySelectorAll("div[filePreview]")[0].remove()
  this.isSomethingOpen=false
}

function onAddCategorySubmit(form, event){
  event.preventDefault();
  catname = form.querySelectorAll("input")[0].value
  saveCat(catname)
  closeAddCategory()
}
function onAddChangeCategoryNameSubmit(form, event){
  event.preventDefault();
  catname = form.querySelectorAll("input")[0].value
  id = form.querySelectorAll("input")[1].value
  console.log(id);
  changeCat(id,catname)
  closeChangeCategoryName()
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

async function changeCat(id,catname){
  await fetch(`/api/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: catname,
    }),
  });
  load_categories()
}

async function deleteCategory(id){
  await fetch(`/api/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  load_categories()
}
// kod do testowania websocket //
const ws = new WebSocket("ws://127.0.0.1:8000/ws");

ws.onopen = () => {
  console.log("WS connected");
  ws.send("hello");
};

ws.onmessage = (event) => {
  if (event.data === "LEFT") {
    console.log(new Date(),"GEST W LEWO");
  }
  if (event.data === "KLIK") {
    console.log(new Date(),"Klikam");
  }
};
