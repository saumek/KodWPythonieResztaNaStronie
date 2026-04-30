from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

class zdjecie(BaseModel):
    photo : str 
    path : str 

app = FastAPI()

@app.get("/api/status")
def status():
    return {"ok": True}

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
