from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.speciality import Speciality
from app.models.department import Department
from app.schemas.speciality import SpecialityCreate, SpecialityUpdate

class SpecialityService:
    async def get_multi(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100, 
        search: Optional[str] = None,
        department_id: Optional[int] = None,
        education_type: Optional[str] = None,
    ) -> tuple[List[Speciality], int]:
        query = select(Speciality)
        
        if search:
            query = query.where(Speciality.name.ilike(f"%{search}%"))
        
        if department_id:
            query = query.where(Speciality.department_id == department_id)
            
        if education_type:
            query = query.where(Speciality.education_type == education_type)
            
        # Count total
        # For simplicity and perf in small datasets, separate query or window func
        # Using func.count() over subquery is common
        from sqlalchemy import func
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query) or 0

        # Apply pagination
        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all(), total

    async def get(self, db: AsyncSession, id: int) -> Optional[Speciality]:
        result = await db.execute(select(Speciality).where(Speciality.id == id))
        return result.scalars().first()
    
    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Speciality]:
        result = await db.execute(select(Speciality).where(Speciality.name == name))
        return result.scalars().first()

    async def create(self, db: AsyncSession, speciality_in: SpecialityCreate) -> Speciality:
        # Check department existence
        department_result = await db.execute(select(Department).where(Department.id == speciality_in.department_id))
        if not department_result.scalars().first():
            raise HTTPException(status_code=400, detail="Department ID not found")

        # Check uniqueness
        if await self.get_by_name(db, speciality_in.name):
             raise HTTPException(status_code=400, detail="Speciality with this name already exists")
             
        speciality = Speciality(
            name=speciality_in.name,
            department_id=speciality_in.department_id,
            education_type=speciality_in.education_type
        )
        db.add(speciality)
        await db.commit()
        await db.refresh(speciality)
        return speciality

    async def update(self, db: AsyncSession, *, db_obj: Speciality, obj_in: SpecialityUpdate) -> Speciality:
        if obj_in.department_id is not None:
             department_result = await db.execute(select(Department).where(Department.id == obj_in.department_id))
             if not department_result.scalars().first():
                raise HTTPException(status_code=400, detail="Department ID not found")

        if obj_in.name and obj_in.name != db_obj.name:
             if await self.get_by_name(db, obj_in.name):
                 raise HTTPException(status_code=400, detail="Speciality with this name already exists")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: int) -> Speciality:
        speciality = await self.get(db, id)
        if not speciality:
            raise HTTPException(status_code=404, detail="Speciality not found")
        
        await db.delete(speciality)
        await db.commit()
        return speciality

speciality_service = SpecialityService()
