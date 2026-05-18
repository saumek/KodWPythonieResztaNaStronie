document.addEventListener("DOMContentLoaded",async (e)=>{
    
  const url = "/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    result.forEach(element => {
        console.log(element)
        document.querySelectorAll(".kategorie")[0].innerHTML+=get_category_html(element[0],element[1])
    });
  } catch (error) {
    console.error(error.message);
  }

})

function get_category_html(id,name){
    return `<button id=${id} class="bg-gray-400 h-10 rounded-4xl pl-3 hover:scale-102 duration-100 transition-all mb-2" onclick="select_category(self)"><h1 class="text-left">${name}</h1></button>`
}
