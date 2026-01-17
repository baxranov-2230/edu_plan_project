from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.user import User
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate
from app.db.session import get_db
from app.services.user_service import user_service
from app.core.rbac import Permissions

router = APIRouter()


@router.post("/", response_model=UserSchema)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
    current_user: User = Depends(deps.PermissionChecker(Permissions.USER_CREATE)),
) -> Any:
    """
    Yangi foydalanuvchi yaratish.
    """
    user = await user_service.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = await user_service.create_user(db, user_in=user_in)
    return user


@router.patch("/{user_id}", response_model=UserSchema)
async def update_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(deps.PermissionChecker(Permissions.USER_UPDATE)),
) -> Any:
    """
    Foydalanuvchi ma'lumotlarini yangilash.
    """
    from sqlalchemy import select
    from app.models.user import User as UserModel

    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )

    user = await user_service.update_user(db, db_user=user, user_in=user_in)
    return user


@router.delete("/{user_id}", response_model=UserSchema)
async def delete_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    current_user: User = Depends(deps.PermissionChecker(Permissions.USER_DELETE)),
) -> Any:
    """
    Foydalanuvchini o'chirish.
    """
    from sqlalchemy import select
    from app.models.user import User as UserModel

    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )

    user = await user_service.delete_user(db, db_user=user)
    return user


@router.get("/", response_model=List[UserSchema])
async def read_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.PermissionChecker(Permissions.USER_READ)),
) -> Any:
    """
    Foydalanuvchilar ro'yxatini olish.
    """
    users = await user_service.get_multi(db, skip=skip, limit=limit)
    return users


@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Joriy foydalanuvchini olish.
    """
    return current_user
