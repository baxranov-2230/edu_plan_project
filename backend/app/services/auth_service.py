from datetime import timedelta
from typing import Optional
from typing import Any, Optional

from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import jwt
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.token import Token
from app.services.user_service import user_service

class AuthService:
    async def authenticate(self, db: AsyncSession, form_data: OAuth2PasswordRequestForm) -> Token:
        user = await user_service.get_by_email(db, form_data.username)
        
        if not user or not user_service.verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        from sqlalchemy.future import select
        from sqlalchemy.orm import selectinload
        from app.models.role import Role

        # Get permissions based on role from Database
        stmt = select(Role).options(selectinload(Role.permissions)).where(Role.name == user.role)
        result = await db.execute(stmt)
        role_obj = result.scalar_one_or_none()
        
        permissions = []
        if role_obj:
             permissions = [p.slug for p in role_obj.permissions]
        
        # If superuser, they essentially have all permissions, but for frontend consistency we can
        # either give them a special flag or a wildcard permission. 
        # Middleware/Deps will handle is_superuser check separately.
        # But let's pass the permissions list anyway so frontend can hide/show buttons safely.
        
        additional_claims = {
            "id": user.id,
            "role": user.role,
            "name": user.name,
            "permissions": permissions
        }
        
        return {
            "access_token": jwt.create_access_token(
                subject=str(user.id), 
                expires_delta=access_token_expires,
                additional_claims=additional_claims
            ),
            "token_type": "bearer",
        }

auth_service = AuthService()
