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

            cursor.execute("""
            CREATE TABLE IF NOT EXISTS file_category (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                FOREIGN KEY (file_id)
                REFERENCES files(id),
                FOREIGN KEY (category_id)
                REFERENCES categories(id)
            )
            """)

            cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_name TEXT NOT NULL
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
        
    def getallfiles(self):
        with sqlite3.connect(self.dbname) as connection:

            cursor = connection.cursor()

            cursor.execute(f"""
            SELECT * FROM files; 
            """)
            return cursor.fetchall()
    def getallcategories(self):
        with sqlite3.connect(self.dbname) as connection:

            cursor = connection.cursor()

            cursor.execute(f"""
            SELECT * FROM categories; 
            """)
            return cursor.fetchall()