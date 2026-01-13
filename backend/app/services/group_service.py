from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.group import Group
from app.schemas.group import GroupCreate, GroupUpdate

class GroupService:
    async def get_multi(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100, 
        search: Optional[str] = None
    ) -> tuple[List[Group], int]:
        query = select(Group)
        if search:
            query = query.where(Group.name.ilike(f"%{search}%"))
        
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query) or 0
        
        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all(), total

    async def get(self, db: AsyncSession, id: int) -> Optional[Group]:
        result = await db.execute(select(Group).where(Group.id == id))
        return result.scalars().first()

    async def create(self, db: AsyncSession, obj_in: GroupCreate) -> Group:
        db_obj = Group(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: Group, obj_in: GroupUpdate) -> Group:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: int) -> Group:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

group_service = GroupService()
