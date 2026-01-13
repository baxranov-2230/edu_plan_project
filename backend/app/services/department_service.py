from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.department import Department
from app.models.faculty import Faculty
from app.schemas.department import DepartmentCreate, DepartmentUpdate

class DepartmentService:
    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Department]:
        result = await db.execute(select(Department).offset(skip).limit(limit))
        return result.scalars().all()

    async def get(self, db: AsyncSession, id: int) -> Optional[Department]:
        result = await db.execute(select(Department).where(Department.id == id))
        return result.scalars().first()
    
    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Department]:
        result = await db.execute(select(Department).where(Department.name == name))
        return result.scalars().first()

    async def create(self, db: AsyncSession, department_in: DepartmentCreate) -> Department:
        # Check faculty existence
        faculty_result = await db.execute(select(Faculty).where(Faculty.id == department_in.faculty_id))
        if not faculty_result.scalars().first():
            raise HTTPException(status_code=400, detail="Faculty ID not found")

        # Check uniqueness
        if await self.get_by_name(db, department_in.name):
             raise HTTPException(status_code=400, detail="Department with this name already exists")
             
        department = Department(
            name=department_in.name,
            description=department_in.description,
            faculty_id=department_in.faculty_id
        )
        db.add(department)
        await db.commit()
        await db.refresh(department)
        return department

    async def update(self, db: AsyncSession, *, db_obj: Department, obj_in: DepartmentUpdate) -> Department:
        if obj_in.faculty_id is not None:
             faculty_result = await db.execute(select(Faculty).where(Faculty.id == obj_in.faculty_id))
             if not faculty_result.scalars().first():
                raise HTTPException(status_code=400, detail="Faculty ID not found")

        if obj_in.name and obj_in.name != db_obj.name:
             if await self.get_by_name(db, obj_in.name):
                 raise HTTPException(status_code=400, detail="Department with this name already exists")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: int) -> Department:
        department = await self.get(db, id)
        if not department:
            raise HTTPException(status_code=404, detail="Department not found")
        
        await db.delete(department)
        await db.commit()
        return department

department_service = DepartmentService()
