from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

@app.get("/api/status")
def status():
    return {"ok": True}