from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.subgroup import Subgroup, SubgroupCreate, SubgroupUpdate, SubgroupList
from app.services.subgroup_service import subgroup_service
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=SubgroupList)
async def read_subgroups(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Guruhchalar ro'yxatini olish.
    """
    skip = (page - 1) * size
    items, total = await subgroup_service.get_multi(db, skip=skip, limit=size)
    return {"items": items, "total": total, "page": page, "size": size}


@router.post("/", response_model=Subgroup)
async def create_subgroup(
    *,
    db: AsyncSession = Depends(deps.get_db),
    subgroup_in: SubgroupCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Yangi guruhcha yaratish.
    """
    return await subgroup_service.create(db, obj_in=subgroup_in)
