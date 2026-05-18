from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi import WebSocket
from pydantic import BaseModel
from DB import DB
##################################
# schemat bazy danych
# mamy tabele: 
# files - tutaj sa wszysztkie zdjecia i filmy czy cos. Kolumny - (id, filename, description)
# categories - tutaj sa wszystkie kategorie. Kolumny - (id, name)
# file_category - to tabela posredniczaca ktora lacza pliki z kategoriami. Kolumny - (file_id, category_id)
# nie ustawiajcie 'id' recznie ono samo sie ustawia


app = FastAPI()

db = DB()

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
async def store_file(x):
    return db.store("files","filename",x)

@app.get("/api/categories")
async def get_categories():
    return db.get("categories")

@app.post("/api/storecategory")
async def set_category(name):
    return db.store("categories","name",name)

#frontend na adresie /
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
