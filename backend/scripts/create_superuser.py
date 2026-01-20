import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.db.session import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.db import base  # Register all models for SQLAlchemy
from app.models.user import User
from app.models.role import Role
from app.models.department import Department
from app.models.faculty import Faculty
from app.models.speciality import Speciality
from app.core.security import get_password_hash

"""
Ushbu skript Super Admin foydalanuvchisini yaratish uchun ishlatiladi.
Agar foydalanuvchi mavjud bo'lsa, xabar beradi.
"""


async def create_superuser():
    """
    Super Admin yaratish funksiyasi:
    'admin' rolini tekshiradi va yangi foydalanuvchiga biriktiradi.
    """
    async with SessionLocal() as db:
        print("Creating superuser...")
        email = "admin@example.com"
        password = "admin"

        # Check if user exists
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if user:
            print(f"User {email} already exists.")
            return

        # Get admin role
        stmt = select(Role).where(Role.name == "admin")
        result = await db.execute(stmt)
        admin_role = result.scalar_one_or_none()

        if not admin_role:
            print("Error: 'admin' role not found. Please run initial_seed.py first.")
            return

        # Create user
        new_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            is_active=True,
            is_superuser=True,
            name="Admin User",
            roles=[admin_role],  # SQL Alchemy should handle the relationship
        )

        db.add(new_user)
        await db.commit()
        print(f"Superuser created: {email} / {password}")


if __name__ == "__main__":
    asyncio.run(create_superuser())
