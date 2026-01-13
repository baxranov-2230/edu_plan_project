from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.group import Group, GroupCreate, GroupUpdate, GroupList
from app.services.group_service import group_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=GroupList)
async def read_groups(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    search: str | None = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    skip = (page - 1) * size
    items, total = await group_service.get_multi(db, skip=skip, limit=size, search=search)
    return {"items": items, "total": total, "page": page, "size": size}

@router.post("/", response_model=Group)
async def create_group(
    *,
    db: AsyncSession = Depends(deps.get_db),
    group_in: GroupCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await group_service.create(db, obj_in=group_in)

@router.put("/{id}", response_model=Group)
async def update_group(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    group_in: GroupUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    group = await group_service.get(db, id=id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return await group_service.update(db, db_obj=group, obj_in=group_in)

@router.get("/{id}", response_model=Group)
async def read_group(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    group = await group_service.get(db, id=id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

@router.delete("/{id}", response_model=Group)
async def delete_group(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await group_service.delete(db, id=id)
