from fastapi import APIRouter, UploadFile, File, Form
from pathlib import Path
from typing import List
from PyPDF2 import PdfMerger
from fastapi.responses import StreamingResponse
import json
import sys
import os
import io
import zipfile


sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from document_rules import document_rules

router = APIRouter()

@router.get("/api/document-rules/{category}/{permit}")
def get_document_rules(category: str, permit: str):
    print("API RECEIVED: ", category, permit)
    category_rules = document_rules.get(category)
    if not category_rules:
        return {"requiredDocuments": [], "message": "Invalid category"}
    
    documents = category_rules.get(permit, [])
    return {"requiredDocuments": documents}

@router.post("/api/upload-files/")
async def upload_files(
    category: str = Form(...),
    permit: str = Form(...),
    files:List[UploadFile] = File(...)
):
    uploaded_filenames = [file.filename.lower() for file in files if file.filename is not None]
    required_docs = document_rules.get(category, {}).get(permit, [])

    missing_docs = []
    for doc in required_docs:
        doc_keywords = doc.lower().split()[:2]
        if not any(all(keyword in filename for keyword in doc_keywords) for filename in uploaded_filenames):
             missing_docs.append(doc)
    
    return {
        "requiredDocuments": required_docs,
        "uploaded": uploaded_filenames,
        "missing": missing_docs,
        "status": "complete" if not missing_docs else "incomplete"
    }

    pdf_merger = PdfMerger()
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for file in files:
            contents = await file.read()

            if file.filename and file.filename.lower().endswith('.pdf'):
                pdf_merger.append(io.BytesIO(contents))

            zip_file.writestr(file.filename if file.filename is not None else "unnamed_file", contents)

            merged_pdf = io.BytesIO()
            pdf_merger.write(merged_pdf)
            pdf_merger.close()
            merged_pdf.seek(0)
            zip_file.writestr("merged.pdf", merged_pdf.read())
    
    zip_buffer.seek(0)
    return StreamingResponse(zip_buffer, media_type="application/zip", headers={"Content-Disposition": "attachment; filename=application_package.zip"})