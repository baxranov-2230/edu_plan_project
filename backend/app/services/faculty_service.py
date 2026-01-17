from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.faculty import Faculty
from app.schemas.faculty import FacultyCreate, FacultyUpdate


class FacultyService:
    """
    Fakultet servisi.
    Fakultetlar bo'yicha ma'lumotlarni boshqarish.
    """

    async def get_multi(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[Faculty]:
        result = await db.execute(select(Faculty).offset(skip).limit(limit))
        return result.scalars().all()

    async def get(self, db: AsyncSession, id: int) -> Optional[Faculty]:
        result = await db.execute(select(Faculty).where(Faculty.id == id))
        return result.scalars().first()

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Faculty]:
        result = await db.execute(select(Faculty).where(Faculty.name == name))
        return result.scalars().first()

    async def create(self, db: AsyncSession, faculty_in: FacultyCreate) -> Faculty:
        # Check uniqueness
        if await self.get_by_name(db, faculty_in.name):
            raise HTTPException(
                status_code=400, detail="Faculty with this name already exists"
            )

        faculty = Faculty(name=faculty_in.name, description=faculty_in.description)
        db.add(faculty)
        await db.commit()
        await db.refresh(faculty)
        return faculty

    async def update(
        self, db: AsyncSession, *, db_obj: Faculty, obj_in: FacultyUpdate
    ) -> Faculty:
        # If name is being updated, check uniqueness
        if obj_in.name != db_obj.name:
            if await self.get_by_name(db, obj_in.name):
                raise HTTPException(
                    status_code=400, detail="Faculty with this name already exists"
                )

        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)

        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: int) -> Faculty:
        faculty = await self.get(db, id)
        if not faculty:
            raise HTTPException(status_code=404, detail="Faculty not found")

        await db.delete(faculty)
        await db.commit()
        return faculty


faculty_service = FacultyService()
