from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class ModuleItem(BaseModel):
    """Individual module within a course"""
    id: int
    title: str
    type: str  # e.g., "text", "video", "quiz"
    content: Optional[str] = None


class CourseBase(BaseModel):
    """Base course model for creation"""
    title: str
    description: Optional[str] = None
    price: Optional[int] = 0
    modules: List[Dict[str, Any]] = []


class CourseCreate(CourseBase):
    """Model for creating a new course"""
    pass


class CourseUpdate(BaseModel):
    """Model for updating an existing course"""
    title: Optional[str] = None
    description: Optional[str] = None
    modules: Optional[List[Dict[str, Any]]] = None


class Course(CourseBase):
    """Complete course model with database fields"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class EnrollmentBase(BaseModel):
    user_id: str
    course_id: int


class EnrollmentCreate(EnrollmentBase):
    pass


class EnrollmentUpdate(BaseModel):
    progress_data: Dict[str, Any]
    is_completed: Optional[bool] = None


class Enrollment(EnrollmentBase):
    id: str
    progress_data: Dict[str, Any] = {}
    is_completed: bool
    is_paid: bool = False
    enrolled_at: datetime
    last_accessed: datetime

    class Config:
        from_attributes = True
