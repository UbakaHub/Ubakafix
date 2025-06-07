from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.background import BackgroundTasks
import os, zipfile, uuid, base64

from typing import List

router = APIRouter()
TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/api/create-zip-preview")
async def create_preview_zip(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    previews = []

    try:
        for file in files:
            filename = file.filename or f"file_{uuid.uuid4().hex}"
            file_ext = filename.split('.')[-1].lower()
            file_bytes = await file.read()

            if file_ext in ['jpg', 'jpeg', 'png', 'gif']:
                encoded = base64.b64encode(file_bytes).decode("utf-8")
                content = f"data:image/{file_ext};base64,{encoded}"
                previews.append({
                    "type": "image",
                    "name": filename,
                    "content": content
                })

            elif file_ext in ['pdf']:
                encoded = base64.b64encode(file_bytes).decode("utf-8")
                content = f"data:application/pdf;base64,{encoded}"
                previews.append({
                    "type": "pdf",
                    "name": filename,
                    "content": content
                })

            elif file_ext in ['txt']:
                text = file_bytes.decode("utf-8", errors="replace")
                previews.append({
                    "type": "text",
                    "name": filename,
                    "content": text
                })

            elif file_ext in ['dwg', 'dxf']:
                # Save CADs temporarily, frontend can render with Autodesk Viewer via URL
                temp_path = os.path.join(TEMP_DIR, filename)
                with open(temp_path, "wb") as f:
                    f.write(file_bytes)

                previews.append({
                    "type": "cad",
                    "name": filename,
                    "url": f"/temp/{filename}"
                })

                background_tasks.add_task(os.remove, temp_path)

            else:
                previews.append({
                    "type": "unsupported",
                    "name": filename,
                    "content": "Preview not available"
                })

        return JSONResponse(content={"previews": previews})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")
