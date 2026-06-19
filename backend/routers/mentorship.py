from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
import uuid

from backend.sql_database import get_db
from backend.mentorship_model import MentorshipProgram, MentorshipSession
from backend.mentorship_schemas import (
    MentorshipProgramCreate, MentorshipProgramOut,
    MentorshipSessionBook, MentorshipSessionOut
)
from backend.models import User
from backend.deps import get_current_user

router = APIRouter(prefix="/mentorship", tags=["mentorship"])

@router.post("/programs", response_model=MentorshipProgramOut, status_code=201)
async def create_program(
    program: MentorshipProgramCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new Mentorship Program (Instructors/Creators only).
    """
    if current_user.role != "creator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only creators/instructors can define mentorship program offerings."
        )

    new_program = MentorshipProgram(
        instructor_id=str(current_user.id),
        title=program.title,
        description=program.description,
        duration_minutes=program.duration_minutes,
        price=program.price
    )

    db.add(new_program)
    await db.commit()
    await db.refresh(new_program)

    # Fetch with relationship loaded
    stmt = (
        select(MentorshipProgram)
        .where(MentorshipProgram.id == new_program.id)
        .options(selectinload(MentorshipProgram.instructor))
    )
    result = await db.execute(stmt)
    return result.scalar_one()

@router.get("/programs", response_model=List[MentorshipProgramOut])
async def list_programs(db: AsyncSession = Depends(get_db)):
    """
    List all available mentorship programs.
    """
    stmt = select(MentorshipProgram).options(selectinload(MentorshipProgram.instructor))
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/sessions/book", response_model=MentorshipSessionOut, status_code=201)
async def book_session(
    booking: MentorshipSessionBook,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Book a session for a specific mentorship program at a scheduled time.
    """
    # 1. Verify program exists
    program_query = await db.execute(
        select(MentorshipProgram).where(MentorshipProgram.id == booking.program_id)
    )
    program = program_query.scalar_one_or_none()
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentorship program not found."
        )

    # 2. Automatically generate unique meeting link (Jitsi Meet)
    meeting_uuid = str(uuid.uuid4())
    meeting_link = f"https://meet.jit.si/{meeting_uuid}"

    # 3. Create the session
    new_session = MentorshipSession(
        program_id=booking.program_id,
        student_id=str(current_user.id),
        scheduled_time=booking.scheduled_time,
        status="confirmed",
        meeting_link=meeting_link,
        notes=booking.notes
    )

    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)

    # 4. Fetch full session details with relations loaded
    stmt = (
        select(MentorshipSession)
        .where(MentorshipSession.id == new_session.id)
        .options(
            selectinload(MentorshipSession.program).selectinload(MentorshipProgram.instructor),
            selectinload(MentorshipSession.student)
        )
    )
    result = await db.execute(stmt)
    return result.scalar_one()

@router.get("/sessions/my-sessions", response_model=List[MentorshipSessionOut])
async def list_my_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all sessions relevant to the authenticated user (as student or instructor).
    """
    user_id_str = str(current_user.id)
    
    stmt = (
        select(MentorshipSession)
        .outerjoin(MentorshipProgram)
        .where(
            or_(
                MentorshipSession.student_id == user_id_str,
                MentorshipProgram.instructor_id == user_id_str
            )
        )
        .options(
            selectinload(MentorshipSession.program).selectinload(MentorshipProgram.instructor),
            selectinload(MentorshipSession.student)
        )
        .order_by(MentorshipSession.scheduled_time.asc())
    )

    result = await db.execute(stmt)
    return result.scalars().all()
