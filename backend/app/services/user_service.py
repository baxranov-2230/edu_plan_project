from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate, UserRegister

class UserService:
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def create_user(self, db: AsyncSession, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            hashed_password=security.get_password_hash(user_in.password),
            name=user_in.name,
            role=user_in.role,
            is_superuser=user_in.is_superuser,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    async def register_user(self, db: AsyncSession, user_in: UserRegister) -> User:
        db_user = User(
            email=user_in.email,
            hashed_password=security.get_password_hash(user_in.password),
            name=user_in.name,
            role="student",
            is_superuser=False,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    
    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> list[User]:
        result = await db.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return security.verify_password(plain_password, hashed_password)

user_service = UserService()
