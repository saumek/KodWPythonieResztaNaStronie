import sqlite3

class Connection():
    #klasa polaczenia z baza danych to wlasny context menager ktory wlacza foreign_keys(domyslnie wlaczone) i zamyka polaczenie automatycnzie bo skonczeniu dzialania
    def __init__(self,dbname):
        self.dbname = dbname

    def __enter__(self):
        self.connection = sqlite3.connect(self.dbname)
        self.connection.execute("PRAGMA foreign_keys = ON")
        return self.connection
    
    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            self.connection.commit()
        else:
            self.connection.rollback()
        self.connection.close()

class DB():
    #klasa bazy danych mamy tutaj wiele funkcji ktore wykonuja dzialania na bazie danych
    def __init__(self):
        self.connCm = Connection("baza.db")
        with self.connCm as connection:

            connection.execute("""
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY,
                filename TEXT NOT NULL,
                description TEXT
            )
            """)

            connection.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY,
                category_name TEXT NOT NULL UNIQUE
            )
            """)

            connection.execute("""
            CREATE TABLE IF NOT EXISTS file_category (
                file_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,

                PRIMARY KEY (file_id, category_id),

                FOREIGN KEY (file_id)
                    REFERENCES files(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (category_id)
                    REFERENCES categories(id)
                    ON DELETE CASCADE
            )
            """)

    def store(self,nazwa:str) -> int:
        #dodaje nowy rekord do bazy danych i zwraca id tego zdjecia
        with self.connCm as connection:
            cursor = connection.cursor()

            cursor.execute("""
            INSERT INTO files (filename) VALUES (?); 
            """,(nazwa,))
            
            return cursor.lastrowid
    
    def get(self, file_id:int):
        #zwraca plik o danym id
        with self.connCm as connection:
            cursor = connection.cursor()

            cursor.execute("""
            SELECT * FROM files WHERE id=?; 
            """,(file_id,))

            return cursor.fetchall()
    
    def getallfiles(self):
        #zwraca wszystkie pliki
        with self.connCm as connection:
            cursor = connection.cursor()

            cursor.execute("""
            SELECT * FROM files; 
            """)

            return cursor.fetchall()
    
    def getallcategories(self):
        #zwraca wszystkie kategorie
        with self.connCm as connection:
            cursor = connection.cursor()

            cursor.execute(f"""
            SELECT * FROM categories; 
            """)

            return cursor.fetchall()