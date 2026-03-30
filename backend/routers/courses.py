from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from backend.sql_database import get_db
from backend.schemas import Course, CourseCreate, CourseUpdate
from backend import crud

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("/", response_model=List[Course])
async def read_courses(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Retrieve all courses with pagination.
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100)
    """
    courses = await crud.get_courses(db, skip=skip, limit=limit)
    return courses


@router.get("/{course_id}", response_model=Course)
async def read_course(course_id: int, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a single course by ID.
    
    - **course_id**: The ID of the course to retrieve
    """
    course = await crud.get_course(db, course_id=course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("/", response_model=Course, status_code=201)
async def create_course(course: CourseCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new course.
    
    - **title**: Course title (required)
    - **description**: Course description (optional)
    - **modules**: List of course modules in JSONB format (optional)
    """
    return await crud.create_course(db=db, course=course)


@router.put("/{course_id}", response_model=Course)
async def update_course(course_id: int, course: CourseUpdate, db: AsyncSession = Depends(get_db)):
    """
    Update an existing course.
    
    - **course_id**: The ID of the course to update
    - **title**: New course title (optional)
    - **description**: New course description (optional)
    - **modules**: New course modules (optional)
    """
    updated_course = await crud.update_course(db=db, course_id=course_id, course=course)
    if updated_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return updated_course


@router.delete("/{course_id}", status_code=204)
async def delete_course(course_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a course by ID.
    
    - **course_id**: The ID of the course to delete
    """
    success = await crud.delete_course(db=db, course_id=course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return None
