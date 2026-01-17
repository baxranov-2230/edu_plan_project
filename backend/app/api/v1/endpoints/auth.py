from typing import Any
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.session import get_db
from app.schemas.user import User as UserSchema, UserRegister
from app.schemas.token import Token
from app.services.auth_service import auth_service
from app.services.user_service import user_service
from app.models.user import User
from fastapi import HTTPException
from sqlalchemy import select


router = APIRouter()


@router.post("/access-token", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 orqali kirish (Login).
    Token olish uchun ishlatiladi.
    """
    return await auth_service.authenticate(db, form_data)


@router.post("/register", response_model=UserSchema)
async def register(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserRegister,
) -> Any:
    """
    Yangi foydalanuvchini ro'yxatdan o'tkazish.
    Tizimga kirish talab qilinmaydi.
    """
    # Check if user exists
    user = await user_service.get_by_email(db, user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )

    return await user_service.register_user(db, user_in)
