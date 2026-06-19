from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserProfileBase(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

class MentorshipProgramBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    duration_minutes: int = Field(60, ge=1)
    price: int = Field(0, ge=0)

class MentorshipProgramCreate(MentorshipProgramBase):
    pass

class MentorshipProgramOut(MentorshipProgramBase):
    id: str
    instructor_id: str
    created_at: datetime
    instructor: Optional[UserProfileBase] = None

    class Config:
        from_attributes = True

class MentorshipSessionBook(BaseModel):
    program_id: str
    scheduled_time: datetime
    notes: Optional[str] = None

class MentorshipSessionOut(BaseModel):
    id: str
    program_id: str
    student_id: str
    scheduled_time: datetime
    status: str
    meeting_link: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    program: Optional[MentorshipProgramOut] = None
    student: Optional[UserProfileBase] = None

    class Config:
        from_attributes = True
