from typing import List, Optional
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.role import Role, Permission
from app.schemas.role import RoleCreate, RoleUpdate

class RoleService:
    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Role]:
        result = await db.execute(select(Role).options(selectinload(Role.permissions)).offset(skip).limit(limit))
        return result.scalars().all()

    async def get(self, db: AsyncSession, id: int) -> Optional[Role]:
        result = await db.execute(select(Role).options(selectinload(Role.permissions)).where(Role.id == id))
        return result.scalar_one_or_none()

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Role]:
        result = await db.execute(select(Role).where(Role.name == name))
        return result.scalar_one_or_none()
    
    async def create(self, db: AsyncSession, role_in: RoleCreate) -> Role:
        existing_role = await self.get_by_name(db, role_in.name)
        if existing_role:
             raise HTTPException(status_code=400, detail="Role with this name already exists")

        db_role = Role(name=role_in.name, description=role_in.description)
        
        # Fetch permissions
        if role_in.permissions:
            stmt = select(Permission).where(Permission.id.in_(role_in.permissions))
            result = await db.execute(stmt)
            perms = result.scalars().all()
            db_role.permissions = perms
            
        db.add(db_role)
        await db.commit()
        await db.refresh(db_role)
        # Eager load for response
        return await self.get(db, db_role.id)

    async def update(self, db: AsyncSession, role: Role, role_in: RoleUpdate) -> Role:
        role.name = role_in.name
        role.description = role_in.description
        
        # Update permissions
        # Note: This REPLACES existing permissions with the new list
        if role_in.permissions is not None:
            # We must be careful if passing empty list vs None
            # Schema says default is empty list, so we assume full replacement
            stmt = select(Permission).where(Permission.id.in_(role_in.permissions))
            result = await db.execute(stmt)
            perms = result.scalars().all()
            role.permissions = perms
            
        db.add(role)
        await db.commit()
        await db.refresh(role)
        return await self.get(db, role.id)

    async def delete(self, db: AsyncSession, id: int) -> Role:
        role = await self.get(db, id)
        if not role:
             raise HTTPException(status_code=404, detail="Role not found")
        await db.delete(role)
        await db.commit()
        return role
    
    async def get_all_permissions(self, db: AsyncSession) -> List[Permission]:
        result = await db.execute(select(Permission))
        return result.scalars().all()

role_service = RoleService()
