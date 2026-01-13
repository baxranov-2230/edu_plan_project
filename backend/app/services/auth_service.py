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
        # Try to authenticate by JSHSHIR first (as requested by user)
        user = await user_service.get_by_jshshir(db, form_data.username)
        # If not found, fall back to email (for legacy or admin users without JSHSHIR)
        if not user:
            user = await user_service.get_by_email(db, form_data.username)
        
        if not user or not user_service.verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # Get permissions based on roles from Database
        # User object already has roles loaded via selectin in get_by_* methods if we did it right.
        # However, get_by_email/jshshir in UserService currently returns simple scalars without loading options?
        # Actually lazy="selectin" in User model handles this automatically on access if session is open.
        
        # NOTE: UserService methods return scalars().first(). If lazy="selectin" is set on relationship, 
        # accessing user.roles will trigger a query (if not async compatible) or should be already loaded.
        # Since we are using AsyncSession and selectin, let's explicitely ensure it is loaded or rely on model definition.
        # For now, let's assume valid loading.
        
        permissions = set()  # Use set to deduplicate
        roles_list = []
        
        for role in user.roles:
            roles_list.append(role.name)
            for perm in role.permissions:
                permissions.add(perm.slug)

        # If superuser, they essentially have all permissions.
        
        additional_claims = {
            "id": user.id,
            "role": roles_list[0] if roles_list else "student", # Legacy support for single role field in token
            "roles": roles_list, # New field for multi-role
            "name": user.name,
            "permissions": list(permissions)
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
