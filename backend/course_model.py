from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from backend.sql_database import Base


class CourseModel(Base):
    """SQLAlchemy model for courses table"""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Integer, default=0) # Price in BWP/USD
    modules = Column(JSONB, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
