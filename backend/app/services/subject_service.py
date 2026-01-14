from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate

class SubjectService:
    async def get_multi(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100,
        search: Optional[str] = None
    ) -> tuple[List[Subject], int]:
        query = select(Subject)
        if search:
            query = query.where(Subject.name.ilike(f"%{search}%"))
            
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query) or 0
        
        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all(), total

    async def get(self, db: AsyncSession, id: int) -> Optional[Subject]:
        result = await db.execute(select(Subject).where(Subject.id == id))
        return result.scalars().first()

    async def create(self, db: AsyncSession, obj_in: SubjectCreate) -> Subject:
        db_obj = Subject(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: Subject, obj_in: SubjectUpdate) -> Subject:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: int) -> Subject:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

subject_service = SubjectService()
