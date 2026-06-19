from sqlalchemy import Column, Integer, String, Text, DateTime, func, JSON
from backend.sql_database import Base


class CourseModel(Base):
    """SQLAlchemy model for courses table"""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Integer, default=0) # Price in BWP/USD
    image = Column(Text, nullable=True) # Cover image URL
    duration = Column(Text, default="12h") # e.g. "12h", "6 weeks"
    parent_id = Column(String(36), nullable=True) # References parent course UUID
    modules = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
