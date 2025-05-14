from fastapi import APIRouter
import json
import sys
import os
from pathlib import Path

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from document_rules import document_rules

router = APIRouter()

@router.get("/api/document-rules/{category}/{permit}")
def get_document_rules(category: str, permit: str):
    category_rules = document_rules.get(category)
    if not category_rules:
        return {"requiredDocuments": [], "message": "Invalid category"}
    
    documents = category_rules.get(permit, [])
    return {"requiredDocuments": documents}
