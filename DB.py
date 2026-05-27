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
                description TEXT,
                created_at TEXT NOT NULL
            )
            """)

            connection.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE
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

    def custom_sql(self,sql:str,param:tuple):
        """
            wykonuje dowolny sql z parametrami ( tam gdzie w sql wpiszemy ? tam wstawiony bedzie parametr)\n
            przyklay uzycia: \n
            **bd.custom_sql("SELECT * FROM files WHERE id = ? and filename = ?",[parametr1,parametr2])**\n
            **bd.custom_sql("SELECT * FROM files WHERE id = ?",[parametr])**
        """
        if isinstance(param,list):
            param=tuple(param)
        with self.connCm as connection:
            cursor = connection.cursor()

            cursor.execute(sql,param)

            return cursor.fetchall()
        
    def store(self,tablename:str,columns:str,values: list | tuple) -> int:
        """
        dodaje nowy rekord do bazy danych\n
        przyklad uzycia:\n
        **db.store("files","filename , description",["nazwa","opisjakis"])**
        """
        sql = f"INSERT INTO {str(tablename)} ({str(columns)}) VALUES ("
        for _ in range(len(values)-1):
            sql+="?,"
        sql+="?)"
        return self.custom_sql(sql,values)
    
    def get(self,tablename:str,columns:str = "*"):
        """
        zwraca wszystkie rekordy o danych kolumnach z danej tabeli\n
        przyklad uzycia: \n
        **db.get("files") <- zwraca wszystkie rekordy z tabeli files**\n
        **db.get("files","filename") <- zwraca tylko nazwy plikow z tabeli files**
        """
        return self.custom_sql(f"SELECT {str(columns)} FROM {str(tablename)}",())
    
    def get_by_id(self, tablename:str, columns:str, id:int|str):
        """
        zwraca rekord o danych kolumnach z danej tabeli o danym id\n
        przyklad uzycia: \n
        **db.get_by_id("files","*",1) <- wzraza caly rekord z tabeli files o id=1**\n
        **db.get_by_id("files","description",1) <- wzraza tylko opis rekordu z tabeli files o id=1**
        """
        return self.custom_sql(f"SELECT {str(columns)} FROM {str(tablename)} WHERE id=?",(str(id),))
    
    def update(self, tablename:str, columns:str, values:str, conditions:str, condition_values:str):
        """
        aktualizuje rekordy w danej tabeli\n
        przykład użycia\n
        **db.update("categories", "name = ?", "nowa_nazwa", "id = ?", "1")**\n
        **db.update("files", "filename = ?", "description = ?", "nowy_plik.txt, nowy_opis", "id = ?", "1")**
        """
        return self.custom_sql(f"UPDATE {str(tablename)} SET {str(columns)} = ? WHERE {str(conditions)} = ?", (str(values), str(condition_values)))
    
    def delete(self, tablename:str, columns:list[str], values:list[str]):
        """
        usuwa rekordy w danej tabeli\n
        przykład użycia\n
        **db.delete("file_category", ['cat_id','file_id'], [1,2])**
        """
        condition = ''
        for i,val in enumerate(columns):
            condition+=f"{str(val)} = ?"
            if i<(len(columns)-1):
                condition+=" AND "
        return self.custom_sql(f"DELETE FROM {str(tablename)} WHERE {str(condition)}",values)

    def delete_by_id(self, tablename:str, id:int|str):
        """
        usuwa rekordy w danej tabeli\n
        przykład użycia\n
        **db.delete("categories", id=1)**
        """
        return self.custom_sql(f"DELETE FROM {str(tablename)} WHERE id = ?",(str(id),))
    
    def get_from(self, tablename:str, columns:str, relation_column:str, relation_value):
        """
        Zwraca rekordy z danej tabeli po id\n
        przykład użycia: \n
        **db.get_from("categories", "*", "file_id", "1")** <- kategorie zdjecia
        **db.ger_from("files", "*", "category_id", "1")** <- zdjęcia kategorii
        """
        join_column = "category_id" if tablename == "categories" else "file_id"
        return self.custom_sql(
            f"SELECT {tablename}.* FROM {tablename} " 
            f"INNER JOIN file_category ON {tablename}.id = file_category.{join_column} " 
            f"WHERE file_category.{relation_column} = ?", (str(relation_value),)
        )