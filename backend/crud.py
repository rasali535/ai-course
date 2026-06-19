from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.course_model import CourseModel
from backend.schemas import CourseCreate, CourseUpdate


async def get_courses(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[CourseModel]:
    """Get all courses with pagination"""
    result = await db.execute(select(CourseModel).offset(skip).limit(limit))
    return result.scalars().all()


async def get_course(db: AsyncSession, course_id: int) -> Optional[CourseModel]:
    """Get a single course by ID"""
    result = await db.execute(select(CourseModel).where(CourseModel.id == course_id))
    return result.scalar_one_or_none()


async def create_course(db: AsyncSession, course: CourseCreate) -> CourseModel:
    """Create a new course"""
    db_course = CourseModel(
        title=course.title,
        description=course.description,
        price=course.price,
        image=course.image,
        duration=course.duration,
        parent_id=course.parent_id,
        modules=course.modules
    )
    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)
    return db_course


async def update_course(db: AsyncSession, course_id: int, course: CourseUpdate) -> Optional[CourseModel]:
    """Update an existing course"""
    result = await db.execute(select(CourseModel).where(CourseModel.id == course_id))
    db_course = result.scalar_one_or_none()
    
    if db_course is None:
        return None
    
    # Update only provided fields
    if course.title is not None:
        db_course.title = course.title
    if course.description is not None:
        db_course.description = course.description
    if course.price is not None:
        db_course.price = course.price
    if course.image is not None:
        db_course.image = course.image
    if course.duration is not None:
        db_course.duration = course.duration
    if course.parent_id is not None:
        db_course.parent_id = course.parent_id
    if course.modules is not None:
        db_course.modules = course.modules
    
    await db.commit()
    await db.refresh(db_course)
    return db_course


async def delete_course(db: AsyncSession, course_id: int) -> bool:
    """Delete a course by ID"""
    result = await db.execute(select(CourseModel).where(CourseModel.id == course_id))
    db_course = result.scalar_one_or_none()
    
    if db_course is None:
        return False
    
    await db.delete(db_course)
    await db.commit()
    return True
