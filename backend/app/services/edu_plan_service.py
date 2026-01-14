from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.edu_plan import EduPlan
from app.schemas.edu_plan import EduPlanCreate, EduPlanUpdate

class EduPlanService:
    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[EduPlan]:
        result = await db.execute(select(EduPlan).offset(skip).limit(limit))
        return result.scalars().all()
    
    async def get_total_count(self, db: AsyncSession) -> int:
        result = await db.execute(select(func.count(EduPlan.id)))
        return result.scalar()

    async def get(self, db: AsyncSession, id: int) -> Optional[EduPlan]:
        result = await db.execute(select(EduPlan).where(EduPlan.id == id))
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, obj_in: EduPlanCreate) -> EduPlan:
        db_obj = EduPlan(
            name=obj_in.name,
            speciality_id=obj_in.speciality_id,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, db_obj: EduPlan, obj_in: EduPlanUpdate) -> EduPlan:
        if obj_in.name is not None:
            db_obj.name = obj_in.name
        if obj_in.speciality_id is not None:
            db_obj.speciality_id = obj_in.speciality_id
        if obj_in.is_active is not None:
            db_obj.is_active = obj_in.is_active
            
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, id: int) -> Optional[EduPlan]:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

edu_plan_service = EduPlanService()
