from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.stream import Stream, StreamGroup
from app.models.group import Group
from app.schemas.stream import StreamCreate, StreamUpdate


class StreamService:
    """
    Oqim (Stream) servisi.
    Oqimlarni boshqarish (yaratish, guruhlarni biriktirish).
    """

    async def get_multi(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
    ) -> tuple[List[Stream], int]:
        """
        Oqimlarni olish.
        Har bir oqim ichidagi guruhlarni ham yuklaydi (eager load).
        """
        query = select(Stream).options(selectinload(Stream.groups))
        if search:
            query = query.where(Stream.name.ilike(f"%{search}%"))

        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query) or 0

        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all(), total

    async def get(self, db: AsyncSession, id: int) -> Optional[Stream]:
        result = await db.execute(
            select(Stream).options(selectinload(Stream.groups)).where(Stream.id == id)
        )
        return result.scalars().first()

    async def create(self, db: AsyncSession, obj_in: StreamCreate) -> Stream:
        db_obj = Stream(name=obj_in.name, academic_year=obj_in.academic_year)

        if obj_in.group_ids:
            # Fetch groups
            groups_result = await db.execute(
                select(Group).where(Group.id.in_(obj_in.group_ids))
            )
            groups = groups_result.scalars().all()
            db_obj.groups = groups

        db.add(db_obj)
        await db.commit()
        # await db.refresh(db_obj) # This expires relationships
        return await self.get(db, db_obj.id)

    async def update(
        self, db: AsyncSession, *, db_obj: Stream, obj_in: StreamUpdate
    ) -> Stream:
        if obj_in.name is not None:
            db_obj.name = obj_in.name
        if obj_in.academic_year is not None:
            db_obj.academic_year = obj_in.academic_year

        if obj_in.group_ids is not None:
            groups_result = await db.execute(
                select(Group).where(Group.id.in_(obj_in.group_ids))
            )
            groups = groups_result.scalars().all()
            db_obj.groups = groups

        db.add(db_obj)
        await db.commit()
        # await db.refresh(db_obj)
        return await self.get(db, db_obj.id)

    async def delete(self, db: AsyncSession, *, id: int) -> Stream:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj


stream_service = StreamService()
