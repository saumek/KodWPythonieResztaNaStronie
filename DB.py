import sqlite3

class DB():
    def __init__(self):
        self.dbname = "baza.db"
    
        with sqlite3.connect(self.dbname) as connection:
            cursor = connection.cursor()

            cursor.execute("""
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL
            )
            """)

    def store(self,nazwa:str):
        with sqlite3.connect(self.dbname) as connection:

            cursor = connection.cursor()

            cursor.execute(f"""
            INSERT INTO files (filename) VALUES (?); 
            """,(nazwa,))
            return cursor.fetchall()
        
    def get(self, id:int):
        with sqlite3.connect(self.dbname) as connection:

            cursor = connection.cursor()

            cursor.execute(f"""
            SELECT * FROM files WHERE id=?; 
            """,(id,))
            return cursor.fetchall()
        
    def getall(self):
        with sqlite3.connect(self.dbname) as connection:

            cursor = connection.cursor()

            cursor.execute(f"""
            SELECT * FROM files; 
            """)
            return cursor.fetchall()