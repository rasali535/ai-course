from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid
import datetime

from backend.sql_database import get_db
from backend.models import User
from backend.deps import get_current_user
from backend.podcast_model import Podcast, PodcastEpisode, PodcastSubscription
from pydantic import BaseModel

router = APIRouter()

class PodcastCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    category: Optional[str] = None
    is_premium: bool = False
    price: Optional[float] = None

class EpisodeCreate(BaseModel):
    title: str
    description: Optional[str] = None
    audio_url: str
    duration_seconds: Optional[int] = None
    season_number: int = 1
    episode_number: int = 1

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_podcast(podcast_data: PodcastCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != 'creator':
        raise HTTPException(status_code=403, detail="Only creators can create podcasts")
    
    new_podcast = Podcast(
        creator_id=current_user.id,
        title=podcast_data.title,
        description=podcast_data.description,
        cover_image_url=podcast_data.cover_image_url,
        category=podcast_data.category,
        is_premium=podcast_data.is_premium,
        price=podcast_data.price
    )
    db.add(new_podcast)
    await db.commit()
    await db.refresh(new_podcast)
    return new_podcast

@router.post("/{podcast_id}/episodes", status_code=status.HTTP_201_CREATED)
async def create_episode(podcast_id: str, episode_data: EpisodeCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Verify podcast ownership
    result = await db.execute(select(Podcast).where(Podcast.id == podcast_id))
    podcast = result.scalar_one_or_none()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    if podcast.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    new_episode = PodcastEpisode(
        podcast_id=podcast_id,
        title=episode_data.title,
        description=episode_data.description,
        audio_url=episode_data.audio_url,
        duration_seconds=episode_data.duration_seconds,
        season_number=episode_data.season_number,
        episode_number=episode_data.episode_number
    )
    db.add(new_episode)
    await db.commit()
    await db.refresh(new_episode)
    return new_episode

@router.post("/{podcast_id}/subscribe")
async def subscribe_podcast(podcast_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Simple subscription logic for testing premium feeds
    result = await db.execute(select(Podcast).where(Podcast.id == podcast_id))
    podcast = result.scalar_one_or_none()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
        
    # Check if already subscribed
    sub_res = await db.execute(select(PodcastSubscription).where(PodcastSubscription.user_id == current_user.id, PodcastSubscription.podcast_id == podcast_id))
    existing_sub = sub_res.scalar_one_or_none()
    if existing_sub:
        return existing_sub
        
    new_sub = PodcastSubscription(
        user_id=current_user.id,
        podcast_id=podcast_id,
        unique_rss_token=str(uuid.uuid4())
    )
    db.add(new_sub)
    await db.commit()
    await db.refresh(new_sub)
    return new_sub

def generate_rss_xml(podcast: Podcast, episodes: List[PodcastEpisode]) -> str:
    items_xml = ""
    for ep in episodes:
        pub_date = ep.published_at.strftime("%a, %d %b %Y %H:%M:%S GMT") if ep.published_at else ""
        items_xml += f"""
        <item>
            <title>{ep.title}</title>
            <description><![CDATA[{ep.description or ''}]]></description>
            <enclosure url="{ep.audio_url}" type="audio/mpeg" length="0"/>
            <guid isPermaLink="false">{ep.id}</guid>
            <pubDate>{pub_date}</pubDate>
            <itunes:duration>{ep.duration_seconds or 0}</itunes:duration>
            <itunes:season>{ep.season_number}</itunes:season>
            <itunes:episode>{ep.episode_number}</itunes:episode>
        </item>
        """
        
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>{podcast.title}</title>
    <description><![CDATA[{podcast.description or ''}]]></description>
    <language>{podcast.language}</language>
    <itunes:category text="{podcast.category or 'Education'}"/>
    <itunes:image href="{podcast.cover_image_url or ''}"/>
    {items_xml}
  </channel>
</rss>
"""
    return xml.strip()

@router.get("/{podcast_id}/rss")
async def get_public_rss(podcast_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Podcast).where(Podcast.id == podcast_id))
    podcast = result.scalar_one_or_none()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
        
    if podcast.is_premium:
        raise HTTPException(status_code=403, detail="This is a premium podcast. Use your private feed URL.")
        
    ep_res = await db.execute(select(PodcastEpisode).where(PodcastEpisode.podcast_id == podcast_id).order_by(PodcastEpisode.published_at.desc()))
    episodes = ep_res.scalars().all()
    
    xml_data = generate_rss_xml(podcast, episodes)
    return Response(content=xml_data, media_type="application/xml")

@router.get("/private/{unique_rss_token}/rss")
async def get_private_rss(unique_rss_token: str, db: AsyncSession = Depends(get_db)):
    sub_res = await db.execute(select(PodcastSubscription).where(PodcastSubscription.unique_rss_token == unique_rss_token))
    subscription = sub_res.scalar_one_or_none()
    if not subscription:
        raise HTTPException(status_code=401, detail="Invalid RSS token")
        
    result = await db.execute(select(Podcast).where(Podcast.id == subscription.podcast_id))
    podcast = result.scalar_one_or_none()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
        
    ep_res = await db.execute(select(PodcastEpisode).where(PodcastEpisode.podcast_id == podcast.id).order_by(PodcastEpisode.published_at.desc()))
    episodes = ep_res.scalars().all()
    
    xml_data = generate_rss_xml(podcast, episodes)
    return Response(content=xml_data, media_type="application/xml")
