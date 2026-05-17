from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi import WebSocket
from pydantic import BaseModel
from DB import DB

app = FastAPI()

db = DB()

@app.get("/api/status")
async def status():
    return {"ok": True}

@app.get("/api/photo/id={x}")
async def get_photo(x:int):
    return db.get(x)

@app.get("/api/photos")
async def get_photos():
    return db.getallfiles()

@app.get("/api/categories")
async def get_photos():
    return db.getallcategories()

@app.get("/api/storephoto/{x}")
async def store(x):
    return db.store(x)

#frontend na adresie /
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
