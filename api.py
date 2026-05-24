from fastapi import FastAPI, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi import WebSocket
from pydantic import BaseModel
from DB import DB
from file_add import FileAdd
from datetime import datetime
##################################
# schemat bazy danych
# mamy tabele: 
# files - tutaj sa wszysztkie zdjecia i filmy czy cos. Kolumny - (id, filename, description)
# categories - tutaj sa wszystkie kategorie. Kolumny - (id, name)
# file_category - to tabela posredniczaca ktora lacza pliki z kategoriami. Kolumny - (file_id, category_id)
# nie ustawiajcie 'id' recznie ono samo sie ustawia
class StoreCategoryModel(BaseModel):
    name:str

app = FastAPI()

db = DB()

file_add = FileAdd()

@app.get("/api/status")
async def status():
    return {"ok": True}

@app.get("/api/file/id={x}")
async def get_photo(x:int):
    return db.get_by_id("files","*",x)

@app.get("/api/files")
async def get_photos():
    return db.get("files")

@app.post("/api/storefile")
async def store_file(
    description: str = Form(...),
    file: UploadFile = File(...)
):
    saved_filename = await file_add.save_file(file)

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.custom_sql(
        "INSERT INTO files (filename, description, created_at) VALUES (?, ?, ?)",
        [saved_filename, description, current_time]
    )
    return {
        "status": "success",
        "filename": saved_filename,
        "description": description,
        "created_at": current_time
    }


@app.get("/api/categories")
async def get_categories():
    return db.get("categories")

@app.post("/api/storecategory")
async def set_category(category: StoreCategoryModel):
    return db.store("categories","name",category.name)

@app.put("/api/category/{id}")
async def update_category(id: int, category: StoreCategoryModel):
    db.custom_sql(
        "UPDATE categories SET name = ? WHERE id = ?",
        (category.name, id)
    )
    return {"ok": True}

#frontend na adresie /
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
