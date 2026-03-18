from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.sql_database import get_db
from backend.sql_models import SQLResource
from backend.models import Resource, ResourceCreate, User
from backend.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Resource])
async def get_resources(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SQLResource))
    # scalars() returns Python objects (SQLResource instances)
    # Pydantic's from_attributes=True on Resource model will convert them
    resources = result.scalars().all()
    return resources

@router.post("/", response_model=Resource)
async def create_resource(
    resource: ResourceCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Only allow creation if user is admin? For now no check, as before.
    
    new_resource = SQLResource(
        title=resource.title,
        type=resource.type,
        description=resource.description,
        image=resource.image
    )
    
    db.add(new_resource)
    await db.commit()
    await db.refresh(new_resource)
    
    return Resource.model_validate(new_resource)
