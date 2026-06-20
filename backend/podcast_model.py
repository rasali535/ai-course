import uuid
from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.sql_database import Base

class Podcast(Base):
    __tablename__ = "podcasts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    creator_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    cover_image_url = Column(String)
    language = Column(String, default="en")
    category = Column(String)
    is_premium = Column(Boolean, default=False)
    price = Column(Float, nullable=True)

    episodes = relationship("PodcastEpisode", back_populates="podcast", cascade="all, delete-orphan")
    subscriptions = relationship("PodcastSubscription", back_populates="podcast", cascade="all, delete-orphan")

class PodcastEpisode(Base):
    __tablename__ = "podcast_episodes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    podcast_id = Column(String, ForeignKey("podcasts.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    audio_url = Column(String, nullable=False)
    duration_seconds = Column(Integer)
    published_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    season_number = Column(Integer, default=1)
    episode_number = Column(Integer, default=1)

    podcast = relationship("Podcast", back_populates="episodes")

class PodcastSubscription(Base):
    __tablename__ = "podcast_subscriptions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True, nullable=False)
    podcast_id = Column(String, ForeignKey("podcasts.id", ondelete="CASCADE"), nullable=False)
    unique_rss_token = Column(String, unique=True, index=True, nullable=False)

    podcast = relationship("Podcast", back_populates="subscriptions")
