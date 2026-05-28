import os
import uuid
from fastapi import UploadFile


class FileAdd:
    #tworzy folder jeśli jeszcze nie istnieje
    def __init__(self, upload_dir: str = "frontend/photos", deleted_dir: str = "frontend/deleted_photos"):
        self.upload_dir = upload_dir
        self.deleted_dir = deleted_dir
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.deleted_dir, exist_ok=True)

    def _generate_random_filename(self, original_filename: str) -> str:
    #oddziela rozszerzenie od oryginalnej nazwy, generuje losowy ciąg znaków i łączy go z rozszerzeniem tworząc nową nazwę
        extension = os.path.splitext(original_filename)[1]
        random_name = str(uuid.uuid4())
        return f"{random_name}{extension}"

    async def save_file(self, file: UploadFile) -> str:
        # generuje losową nazwe i łączy ją z nazwą folderu (daje nam to pełną ścieżke zapisu)
        random_filename = self._generate_random_filename(file.filename)
        file_path = os.path.join(self.upload_dir, random_filename)

        #odczytuje plik i zapisuje na dysku w trybie binarnym
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        #zwraca nową nazwę
        return random_filename

    def delete_file(self, filename: str) -> None:
        #ścieżka do miejsca, w którym znajduje sie plik
        file_path = os.path.join(self.upload_dir, filename)
        #ścieżka do miejsca, gdzie plik ma zostać przeniesiony
        deleted_path = os.path.join(self.deleted_dir, filename)

        #sprawdza czy plik istnieje i zmienia jego ścieżke
        if os.path.exists(file_path):
            os.rename(file_path, deleted_path)
