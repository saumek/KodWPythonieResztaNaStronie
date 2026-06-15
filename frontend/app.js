
async function startGallery(){
  current_category = -67
  isSomethingOpen = false
  isEditPhotoOpen = false
  photo_ready=false
  load_categories()
  load_files()
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

async function select_category(cat_id) {
  let cat_cell = document.getElementById(`cat_${cat_id}`)
  if(cat_id==current_category){
    current_category=-67
    cat_cell.style=""
  }else{
    current_category=Number(cat_id)
    cells = document.querySelectorAll(".categoryCell")
    for (const element of cells) {
      element.style = ""
    }
    cat_cell.style="background: #1e2939"
  }
  await load_files()
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
  Categories={}
  for (const element of result) {
    Categories[element[0]]={"id":element[0],"name":element[1]}
    placeForCat.innerHTML += await get_single_html_category_cell(Categories[element[0]])
  }
}

async function get_single_html_category_cell(element){
    return load_template("./templates/categoryCell.html",element)
}

async function load_files(){
  const url = "/api/files";
  let result = NaN
  if(current_category<0){
    result = await load(url)
  }else{
    result = await load(`/api/category/${current_category}/files`)
  }
  let placeForFiles = document.querySelectorAll(".files")[0]
  placeForFiles.innerHTML=''
  Files = {}
  for (const element of result) {
    Files[element[0]]={"id":element[0],"name":element[1],"desc":element[2],"date":element[3]}
    placeForFiles.innerHTML += await get_single_html_file_cell(Files[element[0]])
  }
  placeForFiles.innerHTML += await load_template("./templates/addNewFileCell.html",{})
}

async function deleteFile(f_id){
  await fetch(`/api/files/${f_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  closePreview()
  load_files()
}

async function get_single_html_file_cell(element){
    return load_template("./templates/photoCell.html",element)
}

async function createNewCategoryWindow(){
  if(!isSomethingOpen){
    isSomethingOpen = true
    document.querySelector("body").innerHTML+= await load_template("./templates/createCategory.html",{})
    form = document.getElementById("saveCat")
    form.addEventListener("submit",(event)=>{onAddCategorySubmit(form,event)})
  }
}

async function renameCategory(id){
  if(!isSomethingOpen){
    isSomethingOpen = true
    document.querySelector("body").innerHTML+= await load_template("./templates/renameCategory.html",Categories[id])
    form = document.getElementById("changeCat")
    form.addEventListener("submit",(event)=>{onAddChangeCategoryNameSubmit(form,event)})
  }
}

async function addToCategory(f_id,cat_id) {
  await fetch("/api/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_id: f_id,
      category_id: cat_id,
    }),
  });
}

async function load_connections_html(file_id){
  let f_cat = await load(`/api/file/${file_id}/categories`)
  file_categories={}
  file_categories[file_id]=[]
  let categories_html = ''
  let used_id=[]
  for (const element of f_cat) {
    used_id.push(element[0])
    file_categories[file_id].push(element[0])
    categories_html += await load_template("./templates/category_inFile.html",{'id':element[0],'name':element[1],'checked':'checked'})
  }

  for (const element of Object.values(Categories)) {
    if(!used_id.includes(element['id'])){
      categories_html += await load_template("./templates/category_inFile.html",{'id':element['id'],'name':element['name'],'checked':''})
    }
  }
  document.getElementById("editFileCatPleace").innerHTML=categories_html
}

async function openFile(id){
  if(!isSomethingOpen){
    isSomethingOpen=true
    let dane = Files[id]
    // let cats = ""
    // for (const element of Object.values(Categories)) {
    //       cats+=`<option value=${element['id']}>${element['name']}</option>`
    // }
    // console.log(dane);
    
    // dane["cats"]=cats
    document.querySelector("body").innerHTML += await load_template("./templates/openFile.html",dane)
  }
}

function closeAddCategory(){
  document.querySelectorAll("div[dodawaniekategori]")[0].remove()
  isSomethingOpen=false
}
function closeChangeCategoryName(){
  document.querySelectorAll("div[zmianaNazwyKategori]")[0].remove()
  isSomethingOpen=false
}
function closePreview(){
  document.querySelectorAll("div[filePreview]")[0].remove()
  isSomethingOpen=false
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
function onEditFileSubmit(form, event){
  event.preventDefault();
  let desc = form.querySelector('textarea').value
  let file_id = form.querySelectorAll('#id')[0].value
  const chceckedCats = form.querySelectorAll('input[type="checkbox"]:checked');
  const uncheckedCats = form.querySelectorAll('input[type="checkbox"]:not(:checked)');

  for (const element of chceckedCats) {
    if(!file_categories[file_id].includes(Number(element.value))){ //nie bylo a jest czyli nowe
      addToCategory(Number(file_id),Number(element.value))
    }
  }
  for (const element of uncheckedCats) {
    if(file_categories[file_id].includes(Number(element.value))){ //bylo a nie ma wiec usuwamy takie polaczenie
      deleteConection(file_id,Number(element.value))
    }
  }
  changeFileDesc(file_id,desc)
  closeEditFile(file_id)
}

async function addNewFile(){
  if(!isSomethingOpen){
    isSomethingOpen=false
    document.querySelectorAll('body')[0].innerHTML += await load_template("./templates/import.html",{})
  }
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

async function changeFileDesc(f_id,desc){
  await fetch(`/api/change`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description:desc,
      id:Number(f_id),
    }),
  });
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

async function deleteConection(f_id,c_id){
  await fetch(`/api/file/${f_id}/category/${c_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function editFile(file_id){
  if(!isEditPhotoOpen){
    let dane=Files[file_id]
    
    const result = await load_template("./templates/editFile.html",dane)
    document.querySelectorAll('body')[0].innerHTML+=result
    await load_connections_html(file_id)
    isEditPhotoOpen=true
    form = document.getElementById("editFileForm")
    form.addEventListener("submit",(event)=>{onEditFileSubmit(form,event)})
  }
}
async function closeEditFile(f_id) {
    document.querySelectorAll("div[editFile]")[0].remove()
    await load_files()
    isEditPhotoOpen=false
    await closePreview()
    await openFile(f_id)
}

// kod do testowania websocketa //
const ws = new WebSocket("ws://127.0.0.1:8000/ws");

ws.onopen = () => {
  console.log("WS connected");
  ws.send("hello");
};

/*
ws.onmessage = (msg) => console.log("GEST:", msg.data);
ws.onopen = () => console.log("OPEN");
ws.onclose = () => console.log("CLOSE");
ws.onerror = (e) => console.log("ERROR", e);
ws.onmessage = (e) => console.log("MSG:", e.data);
*/

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

ws.onmessage = async (event) => {
  switch (event.data){
    case "LEFT":
      openGallery();
      break;
    case "RIGHT":
      openCamera();
      break;
    case "PHOTO":
      if (photo_ready){
        photo_ready=false
        licznik = await load_template("templates/counter_to_take_a_photo.html",{})
        document.body.insertAdjacentHTML("beforeend", licznik);      
        await sleep(3000);
        document.getElementById('counter-usmiech').remove()
        takePhoto();
        photo_ready=true
      }
      break;
  }
};

window.openCamera = openCamera;