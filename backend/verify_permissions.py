import asyncio
from app.db.session import SessionLocal
from app.models.role import Role
from sqlalchemy import select
from sqlalchemy.orm import selectinload

async def check_perms():
    async with SessionLocal() as db:
        result = await db.execute(select(Role).options(selectinload(Role.permissions)))
        roles = result.scalars().all()
        for r in roles:
            print(f"Role: {r.name}")
            for p in r.permissions:
                print(f"  - {p.slug}")

if __name__ == "__main__":
    asyncio.run(check_perms())
