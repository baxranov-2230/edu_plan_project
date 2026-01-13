from typing import List, Optional
from sqlalchemy import select, func, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.workload import Workload, LoadType
from app.models.group import Group
from app.models.stream import Stream
from app.models.subgroup import Subgroup
from app.schemas.workload import WorkloadCreate, WorkloadUpdate, WorkloadBatchCreate, WorkloadGroupUpdate

class WorkloadService:
    async def get_multi(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100
    ) -> tuple[List[Workload], int]:
        # Eager load relationships to avoid MissingGreenlet and explicit IDs
        # We need to load stream.groups because Stream schema includes it
        query = select(Workload).options(
            selectinload(Workload.curriculum),
            selectinload(Workload.stream).selectinload(Stream.groups), 
            selectinload(Workload.group),
            selectinload(Workload.subgroup)
        )
        
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query) or 0
        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all(), total

    async def get(self, db: AsyncSession, id: int) -> Optional[Workload]:
        query = select(Workload).where(Workload.id == id).options(
            selectinload(Workload.curriculum),
            selectinload(Workload.stream).selectinload(Stream.groups),
            selectinload(Workload.group),
            selectinload(Workload.subgroup)
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def create(self, db: AsyncSession, obj_in: WorkloadCreate) -> Workload:
        db_obj = Workload(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return await self.get(db, db_obj.id)

    async def update(self, db: AsyncSession, *, db_obj: Workload, obj_in: WorkloadUpdate) -> Workload:
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

    async def create_batch(self, db: AsyncSession, obj_in: WorkloadBatchCreate) -> List[Workload]:
        created_workloads = []
        
        for item in obj_in.items:
            # Prepare common data
            common_data = {
                "curriculum_id": obj_in.curriculum_id,
                "load_type": item.load_type,
                "hours": item.hours,
                "name": obj_in.name
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
                for group_id in item.group_ids:
                    # Fetch group to check split
                    group_result = await db.execute(select(Group).where(Group.id == group_id))
                    group = group_result.scalars().first()
                    
                    if group and group.he_lab_split:
                        # Ensure subgroups exist or fetch them
                        subgroups_result = await db.execute(select(Subgroup).where(Subgroup.group_id == group_id))
                        subgroups = subgroups_result.scalars().all()
                        
                        if not subgroups:
                            # Create default subgroups if none exist
                            sg1 = Subgroup(name="1-guruhcha", group_id=group_id)
                            sg2 = Subgroup(name="2-guruhcha", group_id=group_id)
                            db.add(sg1)
                            db.add(sg2)
                            await db.flush() # Get IDs
                            subgroups = [sg1, sg2]
                        elif len(subgroups) == 1:
                             # Should have at least 2? Let's just create one more if only 1
                             sg2 = Subgroup(name="2-guruhcha", group_id=group_id)
                             db.add(sg2)
                             await db.flush()
                             subgroups.append(sg2)

                        # Create workload for each subgroup
                        for sg in subgroups[:2]:
                            workload = Workload(**common_data, group_id=group_id, subgroup_id=sg.id)
                            db.add(workload)
                            created_workloads.append(workload)
                            
                    else:
                        # No split, just group
                        workload = Workload(**common_data, group_id=group_id)
                        db.add(workload)
                        created_workloads.append(workload)

        await db.commit()
        
        # Re-fetch created workloads with eager loading to satisfy schema
        if not created_workloads:
             return []
             
        created_ids = [w.id for w in created_workloads]
        query = select(Workload).where(Workload.id.in_(created_ids)).options(
            selectinload(Workload.curriculum),
            selectinload(Workload.stream).selectinload(Stream.groups),
            selectinload(Workload.group),
            selectinload(Workload.subgroup)
        )
        result = await db.execute(query)
        fetched_workloads = result.scalars().all()
        return fetched_workloads
    
    async def update_by_curriculum(self, db: AsyncSession, obj_in: WorkloadGroupUpdate) -> int:
        """
        Updates name and/or curriculum_id for all workloads matching the validation criteria.
        Returns number of updated rows.
        """
        stmt = update(Workload).where(Workload.curriculum_id == obj_in.curriculum_id)
        
        values = {}
        if obj_in.new_name is not None:
            values["name"] = obj_in.new_name
        
        if obj_in.new_curriculum_id is not None:
             values["curriculum_id"] = obj_in.new_curriculum_id
             
        if not values:
            return 0
            
        stmt = stmt.values(**values)
        result = await db.execute(stmt)
        await db.commit()
        return result.rowcount

    async def delete_by_curriculum(self, db: AsyncSession, curriculum_id: int) -> int:
        """
        Deletes all workloads for a given curriculum_id.
        Returns number of deleted rows.
        """
        from sqlalchemy import delete
        stmt = delete(Workload).where(Workload.curriculum_id == curriculum_id)
        result = await db.execute(stmt)
        await db.commit()
        return result.rowcount

workload_service = WorkloadService()
