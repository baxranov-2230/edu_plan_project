from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.user import User
from app.schemas.user import User as UserSchema, UserCreate
from app.db.session import get_db
from app.services.user_service import user_service

router = APIRouter()

@router.post("/", response_model=UserSchema)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    # Check if user exists
    user = await user_service.get_by_email(db, user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    user = await user_service.create_user(db, user_in)
    return user

from app.core.rbac import Permissions

@router.get("/", response_model=List[UserSchema])
async def read_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.PermissionChecker(Permissions.USER_READ)),
) -> Any:
    """
    Retrieve users.
    """
    users = await user_service.get_multi(db, skip=skip, limit=limit)
    return users

@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
