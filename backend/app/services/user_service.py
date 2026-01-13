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

    async def get_by_jshshir(self, db: AsyncSession, jshshir: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.jshshir == jshshir))
        return result.scalars().first()

    async def create_user(self, db: AsyncSession, user_in: UserCreate) -> User:
        password = user_in.password or user_in.passport_series
        username = user_in.username or user_in.jshshir
        
        # Fetch Role objects
        from app.models.role import Role
        roles_stmt = select(Role).where(Role.name.in_(user_in.roles))
        roles_result = await db.execute(roles_stmt)
        roles = roles_result.scalars().all()

        db_user = User(
            email=user_in.email,
            hashed_password=security.get_password_hash(password),
            name=user_in.name,
            # role=user_in.role, # REMOVED: using roles relationship
            roles=roles,
            is_superuser=user_in.is_superuser,
            passport_series=user_in.passport_series,
            jshshir=user_in.jshshir,
            username=username,
            phone_number=user_in.phone_number,
            department_id=user_in.department_id,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    async def register_user(self, db: AsyncSession, user_in: UserRegister) -> User:
        # Default role for public registration
        from app.models.role import Role
        roles_stmt = select(Role).where(Role.name == "student")
        roles_result = await db.execute(roles_stmt)
        roles = roles_result.scalars().all()

        db_user = User(
            email=user_in.email,
            hashed_password=security.get_password_hash(user_in.password),
            name=user_in.name,
            roles=roles,
            is_superuser=False,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    async def update_user(self, db: AsyncSession, db_user: User, user_in: UserCreate | dict) -> User:
        if isinstance(user_in, dict):
            update_data = user_in
        else:
            update_data = user_in.model_dump(exclude_unset=True)
        
            hashed_password = security.get_password_hash(update_data["password"])
            update_data["hashed_password"] = hashed_password
            del update_data["password"]

        if "roles" in update_data:
            from app.models.role import Role
            role_names = update_data["roles"]
            roles_stmt = select(Role).where(Role.name.in_(role_names))
            roles_result = await db.execute(roles_stmt)
            roles = roles_result.scalars().all()
            db_user.roles = roles
            del update_data["roles"]

        for field, value in update_data.items():
             setattr(db_user, field, value)

        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    
    async def delete_user(self, db: AsyncSession, db_user: User) -> User:
        await db.delete(db_user)
        await db.commit()
        return db_user

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> list[User]:
        result = await db.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return security.verify_password(plain_password, hashed_password)

user_service = UserService()
