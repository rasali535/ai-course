import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from backend.sql_database import Base
from backend.sql_models import SQLUser

class MentorshipProgram(Base):
    __tablename__ = "mentorship_programs"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    instructor_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False, default=60)
    price = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    instructor = relationship("SQLUser", foreign_keys=[instructor_id])

class MentorshipSession(Base):
    __tablename__ = "mentorship_sessions"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    program_id = Column(String(36), ForeignKey("mentorship_programs.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), nullable=False, default="confirmed") # pending, confirmed, completed, canceled
    meeting_link = Column(String(512), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    program = relationship("MentorshipProgram", foreign_keys=[program_id])
    student = relationship("SQLUser", foreign_keys=[student_id])
