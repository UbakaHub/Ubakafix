from fastapi import APIRouter, UploadFile, File, Form
from pathlib import Path
from typing import List
import json
import sys
import os


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
    uploaded_filenames = [file.filename.lower() for file in files]
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