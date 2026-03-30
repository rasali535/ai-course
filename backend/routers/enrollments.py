from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.sql_database import get_db
from backend.enrollment_model import EnrollmentModel
from backend.models import User
from backend.schemas import Enrollment, EnrollmentCreate, EnrollmentUpdate
from backend.deps import get_current_user
import logging

router = APIRouter(prefix="/api/enrollments", tags=["enrollments"])
logger = logging.getLogger(__name__)

# --- CRUD Functions (Inline for now, could be moved to crud.py) ---

async def get_user_enrollments(db: AsyncSession, user_id: str) -> List[EnrollmentModel]:
    result = await db.execute(select(EnrollmentModel).where(EnrollmentModel.user_id == user_id))
    return result.scalars().all()

async def get_enrollment(db: AsyncSession, enrollment_id: str) -> Optional[EnrollmentModel]:
    result = await db.execute(select(EnrollmentModel).where(EnrollmentModel.id == enrollment_id))
    return result.scalar_one_or_none()

async def get_enrollment_by_course(db: AsyncSession, user_id: str, course_id: int) -> Optional[EnrollmentModel]:
    result = await db.execute(select(EnrollmentModel).where(EnrollmentModel.user_id == user_id, EnrollmentModel.course_id == course_id))
    return result.scalar_one_or_none()

# --- Endpoints ---

@router.post("/", response_model=Enrollment, status_code=status.HTTP_201_CREATED)
async def enroll_student(
    enrollment: EnrollmentCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Enroll the current user in a course.
    """
    # Verify the user ID matches the token (optional security check)
    if enrollment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot enroll another user")

    # Check if already enrolled
    existing = await get_enrollment_by_course(db, enrollment.user_id, enrollment.course_id)
    if existing:
        raise HTTPException(status_code=400, detail="User already enrolled in this course")

    new_enrollment = EnrollmentModel(
        user_id=enrollment.user_id,
        course_id=enrollment.course_id,
        progress_data={}
    )
    db.add(new_enrollment)
    await db.commit()
    await db.refresh(new_enrollment)
    return new_enrollment

@router.get("/", response_model=List[Enrollment])
async def read_my_enrollments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all enrollments for the current user.
    """
    return await get_user_enrollments(db, current_user.id)

@router.get("/check", response_model=Optional[Enrollment])
async def check_enrollment(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Check if the current user is enrolled in a specific course.
    """
    enrollment = await get_enrollment_by_course(db, current_user.id, course_id)
    return enrollment

@router.get("/{enrollment_id}", response_model=Enrollment)
async def read_enrollment(
    enrollment_id: str, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollment = await get_enrollment(db, enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    if enrollment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this enrollment")
        
    return enrollment

@router.patch("/{enrollment_id}", response_model=Enrollment)
async def update_progress(
    enrollment_id: str, 
    update_data: EnrollmentUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update progress data for a specific enrollment.
    """
    enrollment = await get_enrollment(db, enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
        
    if enrollment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this enrollment")
    
    # Update fields
    # Note: For JSONB, we usually need to replace the entire dict or use specialized update queries
    # Here we typically expect the client to send the FULL updated progress object or merged payload
    enrollment.progress_data = update_data.progress_data
    
    if update_data.is_completed is not None:
        enrollment.is_completed = update_data.is_completed
        
    await db.commit()
    await db.refresh(enrollment)
    return enrollment

@router.post("/pay-certificate", response_model=Enrollment)
async def pay_certificate(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark an enrollment as paid for certificate collection.
    """
    enrollment = await get_enrollment_by_course(db, current_user.id, course_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
        
    enrollment.is_paid = True
    await db.commit()
    await db.refresh(enrollment)
    return enrollment
