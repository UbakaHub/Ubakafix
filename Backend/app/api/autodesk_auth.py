import os
import httpx
import base64
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

CLIENT_ID = os.getenv("AUTODESK_CLIENT_ID")
CLIENT_SECRET = os.getenv("AUTODESK_CLIENT_SECRET")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

@router.get("/api/autodesk-token", response_model=TokenResponse)
async def get_autodesk_token():
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://developer.api.autodesk.com/authentication/v1/authenticate",
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "grant_type": "client_credentials",
                "scope": "viewables:read data:read data:create bucket:create bucket:read"
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        return res.json()

@router.post("/api/autodesk-bucket")
async def create_bucket():
    client_id = os.getenv("AUTODESK_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=500, detail="AUTODESK_CLIENT_ID environment variable is not set")
    bucket_key = f"{client_id.lower()}-ubakafix-bucket"
    
    token_response = await get_autodesk_token()
    token = token_response["access_token"]

    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        data = {
            "bucketKey": bucket_key,
            "policyKey": "transient"
        }

        response = await client.post("https://developer.api.autodesk.com/oss/v2/buckets", headers=headers, json=data)
        return response.json()

@router.post("/api/autodesk-upload")
async def upload_to_autodesk(file: UploadFile = File(...)):
    token_response = await get_autodesk_token()
    token = token_response["access_token"]
    client_id = os.getenv("AUTODESK_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=500, detail="AUTODESK_CLIENT_ID environment variable is not set")
    bucket_key = f"{client_id.lower()}-ubakafix-bucket"
    object_name = file.filename
    contents = await file.read()

    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/octet-stream"
        }

        url = f"https://developer.api.autodesk.com/oss/v2/buckets/{bucket_key}/objects/{object_name}"

        response = await client.put(url, headers=headers, content=contents)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Upload failed: {response.text}")
        
        return response.json()  # This contains the URN you’ll use for viewer

@router.post("/api/autodesk-translate")
async def translate_object(data: dict):
    urn = data["urn"]
    token_response = await get_autodesk_token()
    token = token_response["access_token"]

    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        payload = {
            "input": {
                "urn": base64.b64encode(urn.encode()).decode()
            },
            "output": {
                "formats": [{"type": "svf", "views": ["2d", "3d"]}]
            }
        }

        response = await client.post(
            "https://developer.api.autodesk.com/modelderivative/v2/designdata/job",
            headers=headers,
            json=payload
        )

        return response.json()
