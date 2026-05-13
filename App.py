import webbrowser
import uvicorn
class App():
    def __init__(self):
        uvicorn.run(
        "api:app",
        host="127.0.0.1",
        port=8000,
        reload=True
        )
        webbrowser.open("http://127.0.0.1:8000")
        