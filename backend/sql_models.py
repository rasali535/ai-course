from sqlalchemy import Column, String, Boolean, DateTime
from backend.sql_database import Base
import uuid
from datetime import datetime, timezone

class SQLUser(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True) # UUID as string
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    plan = Column(String, default="basic")
    role = Column(String, default="learner")
    subscription_status = Column(String, default="active")
    trial_ends_at = Column(DateTime, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class SQLResource(Base):
    __tablename__ = "resources"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    description = Column(String)
    image = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
