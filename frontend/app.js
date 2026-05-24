document.addEventListener("DOMContentLoaded",async (e)=>{
    
  load_categories()
  load_files()
  this.isSomethingOpen = false
})

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
  for (const element of result) {
      placeForCat.innerHTML += await get_single_html_category_cell(element[0],element[1])
  }
}

async function get_single_html_category_cell(id,name){
    return load_template("./templates/categoryCell.html",{"id":id,"name":name})
}

async function load_files(){
  const url = "/api/files";

  const result = await load(url);
  let placeForFiles = document.querySelectorAll(".files")[0]
  placeForFiles.innerHTML=''
  for (const element of result) {
      placeForFiles.innerHTML += await get_single_html_file_cell(element[0],element[1],element[2])
  }
}

async function get_single_html_file_cell(id,name,desc){
    return load_template("./templates/photoCell.html",{"id":id,"name":name,"desc":desc})
}

async function createNewCategoryWindow(){
  if(!this.isSomethingOpen){
    this.isSomethingOpen = true
    document.querySelector("body").innerHTML+= await load_template("./templates/createCategory.html",{})
    form = document.getElementById("saveCat")
    form.addEventListener("submit",(event)=>{onAddCategorySubmit(form,event)})
  }
}

async function openFile(name){
  if(!this.isSomethingOpen){
    this.isSomethingOpen=true
    document.querySelector("body").innerHTML += await load_template("./templates/openFile.html",{"name":name})
  }
}

function closeAddCategory(){
  document.querySelectorAll("div[dodawaniekategori]")[0].remove()
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
