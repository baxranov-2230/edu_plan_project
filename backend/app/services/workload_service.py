from typing import List, Optional
from sqlalchemy import select, func, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.workload import Workload, LoadType
from app.models.group import Group
from app.models.stream import Stream
from app.schemas.workload import (
    WorkloadCreate,
    WorkloadUpdate,
    WorkloadBatchCreate,
    WorkloadGroupUpdate,
)


class WorkloadService:
    """
    Yuklama (Workload) servisi.
    Yuklamalarni yaratish, taqsimlash va boshqarish.
    Eng murakkab logika shu yerda joylashgan (Batch create, Split logic).
    """

    async def get_multi(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        edu_plan_id: Optional[int] = None,
    ) -> tuple[List[Workload], int]:
        """
        Yuklamalarni olish.
        Barcha bog'liq ma'lumotlarni (fan, o'qituvchi, guruh) yuklaydi.
        """
        # Eager load relationships to avoid MissingGreenlet and explicit IDs
        # We need to load stream.groups because Stream schema includes it
        query = select(Workload).options(
            selectinload(Workload.subject),
            selectinload(Workload.edu_plan),
            selectinload(Workload.group),
            selectinload(Workload.stream).selectinload(Stream.groups),
        ).order_by(Workload.id.desc())

        if edu_plan_id:
            query = query.where(Workload.edu_plan_id == edu_plan_id)

        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query) or 0
        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all(), total

    async def get(self, db: AsyncSession, id: int) -> Optional[Workload]:
        query = (
            select(Workload)
            .where(Workload.id == id)
            .options(
                selectinload(Workload.subject),
                selectinload(Workload.edu_plan),
                selectinload(Workload.stream).selectinload(Stream.groups),
                selectinload(Workload.group),
            )
        )
        result = await db.execute(query)
        return result.scalars().first()

    # ... (create, update, delete generic methods are fine unless they used curriculum, which they don't seem to explicitly)

    async def create(self, db: AsyncSession, obj_in: WorkloadCreate) -> Workload:
        db_obj = Workload(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return await self.get(db, db_obj.id)

    async def update(
        self, db: AsyncSession, *, db_obj: Workload, obj_in: WorkloadUpdate
    ) -> Workload:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return await self.get(db, db_obj.id)

    async def delete(self, db: AsyncSession, *, id: int) -> Workload:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

    async def create_batch(
        self, db: AsyncSession, obj_in: WorkloadBatchCreate
    ) -> List[Workload]:
        """
        Yuklamalarni ommaviy yaratish (Batch Create).
        Dars turiga qarab (Ma'ruza, Amaliyot, Lab) yuklamalarni oqim yoki guruhlarga bo'lib chiqadi.
        Laboratoriya uchun guruhni guruhchalarga (podguruh) bo'lishni ham qo'llab-quvvatlaydi.
        """
        created_workloads = []

        for item in obj_in.items:
            # Prepare common data
            common_data = {
                "subject_id": obj_in.subject_id,
                "edu_plan_id": obj_in.edu_plan_id,
                "load_type": item.load_type,
                "hours": item.hours,
                "name": obj_in.name,
            }

            if item.load_type == LoadType.LECTURE:
                # Create for each stream
                for stream_id in item.stream_ids:
                    workload = Workload(**common_data, stream_id=stream_id)
                    db.add(workload)
                    created_workloads.append(workload)

            elif item.load_type == LoadType.PRACTICE:
                # Create for each group
                for group_id in item.group_ids:
                    workload = Workload(**common_data, group_id=group_id)
                    db.add(workload)
                    created_workloads.append(workload)

            elif item.load_type == LoadType.LAB:
                # Create for each group, checking for split
                # Fetch all groups at once to check for split flag
                if item.group_ids:
                    group_results = await db.execute(
                        select(Group).where(Group.id.in_(item.group_ids))
                    )
                    groups_map = {
                        group.id: group for group in group_results.scalars().all()
                    }
                else:
                    groups_map = {}

                for group_id in item.group_ids:
                    group = groups_map.get(group_id)

                    final_hours = item.hours
                    if group and group.has_lab_subgroups:
                        # Double the hours if group has lab subgroups
                        final_hours = item.hours * 2

                    # Create single workload
                    workload = Workload(**common_data, group_id=group_id)
                    workload.hours = final_hours  # Override hours
                    db.add(workload)
                    created_workloads.append(workload)

        await db.commit()

        # Re-fetch created workloads with eager loading to satisfy schema
        if not created_workloads:
            return []

        created_ids = [w.id for w in created_workloads]
        query = (
            select(Workload)
            .where(Workload.id.in_(created_ids))
            .options(
                selectinload(Workload.subject),
                selectinload(Workload.edu_plan),
                selectinload(Workload.stream).selectinload(Stream.groups),
                selectinload(Workload.group),
            )
        )
        result = await db.execute(query)
        fetched_workloads = result.scalars().all()
        return fetched_workloads

    async def update_by_subject(
        self, db: AsyncSession, obj_in: WorkloadGroupUpdate
    ) -> int:
        """
        Updates name and/or subject_id for all workloads matching the validation criteria.
        Returns number of updated rows.
        """
        stmt = update(Workload).where(Workload.subject_id == obj_in.subject_id)

        values = {}
        if obj_in.new_name is not None:
            values["name"] = obj_in.new_name

        if obj_in.new_subject_id is not None:
            values["subject_id"] = obj_in.new_subject_id

        if obj_in.new_edu_plan_id is not None:
            values["edu_plan_id"] = obj_in.new_edu_plan_id

        if not values:
            return 0

        stmt = stmt.values(**values)
        result = await db.execute(stmt)
        await db.commit()
        return result.rowcount

    async def delete_by_subject(self, db: AsyncSession, subject_id: int) -> int:
        """
        Deletes all workloads for a given subject_id.
        Returns number of deleted rows.
        """
        from sqlalchemy import delete

        stmt = delete(Workload).where(Workload.subject_id == subject_id)
        result = await db.execute(stmt)
        await db.commit()
        return result.rowcount


workload_service = WorkloadService()
