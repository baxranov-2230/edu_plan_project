import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from app.db.session import SessionLocal
from sqlalchemy import select
from app.models.user import User
from app.models.role import Role
from app.models.department import Department
from app.models.faculty import Faculty
from app.core.security import verify_password
from app.services.user_service import user_service

"""
Ushbu skript tizimga kirish (login) jarayonini tekshirish uchun ishlatiladi.
Super Admin ma'lumotlarini tekshiradi va parolni xeshini yangilaydi.
"""


async def debug_login():
    """
    Login debugging funksiyasi:
    1. 'super_admin@gmail.com' foydalanuvchisini bazadan qidiradi.
    2. Parol to'g'riligini tekshiradi.
    3. Parol xeshini yangilaydi (agar kerak bo'lsa) va bazaga saqlaydi.
    """
    email = "super_admin@gmail.com"
    password = "admin"
    print(f"Checking user: {email}")

    async with SessionLocal() as db:
        user = await user_service.get_by_email(db, email)
        if not user:
            print("User NOT found!")
            return

        print(f"User found: ID={user.id}, Email={user.email}")
        print(f"Hashed Password in DB: {user.hashed_password}")

        is_valid = verify_password(password, user.hashed_password)
        print(f"Password '{password}' valid? {is_valid}")

        # Test hash generation consistency
        from app.core.security import get_password_hash

        new_hash = get_password_hash(password)
        print(f"New hash for '{password}': {new_hash}")
        print(f"Verify new hash: {verify_password(password, new_hash)}")

        # FIX: Update DB with new hash
        print("Updating user password in DB...")
        user.hashed_password = new_hash
        db.add(user)
        await db.commit()
        print("Password updated.")


if __name__ == "__main__":
    asyncio.run(debug_login())
