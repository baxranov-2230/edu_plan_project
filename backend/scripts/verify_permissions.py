import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from app.db.session import SessionLocal
from app.models.role import Role
from sqlalchemy import select
from sqlalchemy.orm import selectinload

"""
Ushbu skript bazadagi barcha rollar va ularga biriktirilgan ruxsatnomalarni ko'rish uchun ishlatiladi.
"""


async def check_perms():
    """
    Ruxsatnomalarni tekshirish funksiyasi:
    1. Barcha rollarni ruxsatnomalari bilan birga yuklaydi.
    2. Har bir rol va uning ruxsatnomalarini konsolga chiqaradi.
    """
    async with SessionLocal() as db:
        result = await db.execute(select(Role).options(selectinload(Role.permissions)))
        roles = result.scalars().all()
        for r in roles:
            print(f"Role: {r.name}")
            for p in r.permissions:
                print(f"  - {p.slug}")


if __name__ == "__main__":
    asyncio.run(check_perms())
