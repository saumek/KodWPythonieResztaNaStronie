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

class FileCategory(BaseModel):
    file_id:int
    category_id:int

class StoreFileModel(BaseModel):
    description:str

app = FastAPI()

db = DB()

file_add = FileAdd()

@app.get("/api/status")
async def status():
    return {"ok": True}

@app.get("/api/file/{id}")
async def get_photo(id:int):
    return db.get_by_id("files","*",id=id)

@app.get("/api/files")
async def get_photos():
    return db.get("files")

@app.post("/api/storefile")
#endpoint wymagający od użytkownika opisu i załączenia pliku
async def store_file(
    description: str = Form(...),
    file: UploadFile = File(...)
):
    #zapis pliku z wygenerowaną nazwą
    saved_filename = await file_add.save_file(file)

    #pobranie aktualnej daty i godziny
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    #zapis danych do bazy
    db.store(
        "files","filename , description, created_at",
        [saved_filename, description, current_time]
    )
    return {
        "status": "success",
        "filename": saved_filename,
        "description": description,
        "created_at": current_time
    }

@app.get("/api/category/{id}")
async def get_category(id:int):
    return db.get_by_id("categories","*",id=id)

@app.get("/api/categories")
async def get_categories():
    return db.get("categories")

@app.post("/api/storecategory")
async def set_category(category: StoreCategoryModel):
    return db.store("categories","name",[category.name])

@app.put("/api/category/{id}")
async def update_category(id: int, category: StoreCategoryModel):
    db.update("categories", "name", category.name, "id", str(id))
    return {"ok": True}

@app.delete("/api/category/{id}")
async def delete_category(id:int):
    db.delete("categories",id)

@app.post("/api/join")
async def add_file_to_category(content: FileCategory):
    db.store("file_category", "file_id, category_id", [content.file_id, content.category_id])
    return {"ok": True}

@app.put("/api/change")
async def update_file(file: StoreFileModel):
    db.update("files", "description", file.description, "id", str(id))
    return {"ok": True}

@app.get("/api/file/{id}/categories")
async def get_file_categories(id:int):
    return db.get_from("categories", "*", "file_id", id)

@app.get("/api/category/{id}/files")
async def get_file_categories(id:int):
    return db.get_from("files", "*", "category_id", id)

"""from gestures import gesture_loop
import threading
from queue import Queue
queue = Queue()
@app.on_event("startup")
def start_gestures():
    thread = threading.Thread(target=gesture_loop,args=(queue,))
    thread.daemon = True
    thread.start()

import asyncio
@app.websocket("/ws")
async def connect(websocket: WebSocket):
    await websocket.accept()
    while True:
        gesture = await asyncio.to_thread(queue.get)
        await websocket.send_text(str(gesture))"""

#frontend na adresie /
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
