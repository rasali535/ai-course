from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.sql_database import get_db
from backend.sql_models import SQLUser
from backend.models import User, TokenData
from backend.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

import os
import requests

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://gcxpgwywpesalfbkeakm.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "sb_publishable_MPtdrG6UHTiT82o78y2GJQ_oML-dacm")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    email = None
    sub = None
    
    # Try local JWT decoding first (HS256)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        sub = payload.get("sub")
    except JWTError:
        # Fallback to verifying token with Supabase Auth API (supports ES256/ECC P-256 automatically)
        try:
            headers = {
                "Authorization": f"Bearer {token}",
                "apikey": SUPABASE_ANON_KEY
            }
            resp = requests.get(f"{SUPABASE_URL}/auth/v1/user", headers=headers, timeout=5)
            if resp.status_code == 200:
                user_data = resp.json()
                email = user_data.get("email")
                sub = user_data.get("id")
            else:
                raise credentials_exception
        except Exception:
            raise credentials_exception
            
    if not email and not sub:
        raise credentials_exception
        
    user = None
    if email:
        result = await db.execute(select(SQLUser).where(SQLUser.email == email))
        user = result.scalar_one_or_none()
    elif sub and "@" in sub:
        result = await db.execute(select(SQLUser).where(SQLUser.email == sub))
        user = result.scalar_one_or_none()
    elif sub:
        result = await db.execute(select(SQLUser).where(SQLUser.id == sub))
        user = result.scalar_one_or_none()
        
    if user is None:
        raise credentials_exception
        
    return User.model_validate(user)

async def get_active_user(current_user: User = Depends(get_current_user)):
    from datetime import datetime, timezone
    
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    # Check trial
    if current_user.trial_ends_at:
        now = datetime.now(timezone.utc)
        if now > current_user.trial_ends_at:
            # If trial is over, check subscription
            if current_user.subscription_status != 'active':
                raise HTTPException(
                    status_code=403, 
                    detail="Your 7-day trial has expired. Please subscribe to continue."
                )
    
    return current_user
