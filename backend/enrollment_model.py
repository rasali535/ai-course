from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from backend.sql_database import Base
import uuid

class EnrollmentModel(Base):
    """SQLAlchemy model for course enrollments and progress tracking"""
    __tablename__ = "enrollments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    
    # Progress Data
    # Structure: { "module_id": { "lesson_id": true/false }, "overall_percent": 0-100 }
    progress_data = Column(JSONB, default={})
    
    is_completed = Column(Boolean, default=False)
    is_paid = Column(Boolean, default=False) # For certificate collection
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
