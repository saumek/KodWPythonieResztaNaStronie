from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi import WebSocket
from pydantic import BaseModel
from DB import DB

app = FastAPI()

db = DB()

@app.get("/api/status")
def status():
    return {"ok": True}

@app.get("/api/photo/id={x}")
def get_photo(x:int):
    return db.get(x)

@app.get("/api/photos")
def get_photos():
    return db.getall()

@app.get("/api/storephoto/{x}")
def store(x):
    return db.store(x)
    

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
