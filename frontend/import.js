async function closeImportWindow(){
    document.getElementById("import").remove()
    isSomethingOpen=false
}
async function fileChanged(input) {
    const fileList = document.getElementById('fileList')
    for (const file of input.files) {
        console.log(file);
        const item = document.createElement("div");

        item.className = "flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm";

        item.innerHTML = `
            <span class="truncate">${file.name}</span>
            <span class="ml-3 text-xs text-gray-400">
                ${(file.size / 1024).toFixed(1)} KB
            </span>
        `;

        fileList.appendChild(item);
        
    }
    
}
async function ImportSubmit(){
    const input = document.getElementById("filesInput")
    for (const file of input.files) {
        const formData = new FormData();

        formData.append("description", " ");
        formData.append("file", file);

        const response = await fetch("/api/storefile", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            console.error("Błąd przy pliku:", file.name, response.status);
            continue;
        }

        const data = await response.json();
        if(current_category!=-67){
            addToCategory(data['id'],current_category)
        }
        console.log("Wysłano:", file.name, data);
    }
    await load_files()
    await closeImportWindow()
}