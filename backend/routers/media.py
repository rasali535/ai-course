from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import FileResponse
import shutil
import os
import uuid
import logging
from backend.deps import get_current_user
from backend.models import User

# Configuration
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
# In production, this would be a GCS/S3 bucket URL
MEDIA_BASE_URL = "/static/uploads"  

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/media", tags=["media"])
logger = logging.getLogger(__name__)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a media file (video, image, document).
    Returns the URL to access the file.
    """
    try:
        # Validate file ext/type here (optional)
        
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file to disk (Stream directly for larger files in real app)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the public URL
        # Usage: In frontend, <video src={url} />
        file_url = f"{MEDIA_BASE_URL}/{unique_filename}"
        
        return {
            "filename": file.filename,
            "url": file_url,
            "type": file.content_type,
            "size": os.path.getsize(file_path)
        }
        
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail="File upload failed")

@router.get("/files/{filename}")
async def get_file(filename: str):
    """
    Serve a file directly (Local dev only)
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")
