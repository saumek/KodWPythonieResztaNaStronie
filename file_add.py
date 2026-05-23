import os
import uuid
from fastapi import UploadFile


class FileAdd:
    def __init__(self, upload_dir: str = "frontend/photos"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def _generate_random_filename(self, original_filename: str) -> str:
        extension = os.path.splitext(original_filename)[1]
        random_name = str(uuid.uuid4())
        return f"{random_name}{extension}"

    async def save_file(self, file: UploadFile) -> str:
        random_filename = self._generate_random_filename(file.filename)
        file_path = os.path.join(self.upload_dir, random_filename)

        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        return random_filename