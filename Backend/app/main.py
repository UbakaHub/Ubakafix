from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes import router
from app.api import zip_service
from app.api import autodesk_auth
from contextlib import asynccontextmanager
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import os

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_upload_size: int):
        super().__init__(app)
        self.max_upload_size = max_upload_size

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_upload_size:
            return Response("File too large", status_code=413)
        return await call_next(request)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic (optional)
    print("Starting UbakaFix backend...")
    yield
    # Shutdown logic
    print("Cleaning up temporary files...")
    for filename in os.listdir(TEMP_DIR):
        file_path = os.path.join(TEMP_DIR, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")


app = FastAPI(lifespan=lifespan)

app.add_middleware(LimitUploadSizeMiddleware, max_upload_size=100 * 1024 * 1024)  # 100 MB limit
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/temp", StaticFiles(directory=TEMP_DIR), name="temp_uploads")

app.include_router(router)
app.include_router(zip_service.router)
app.include_router(autodesk_auth.router)
