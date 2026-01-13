from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.curriculum import Curriculum, CurriculumCreate, CurriculumUpdate, CurriculumList
from app.services.curriculum_service import curriculum_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=CurriculumList)
async def read_curriculums(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    search: str | None = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    skip = (page - 1) * size
    items, total = await curriculum_service.get_multi(db, skip=skip, limit=size, search=search)
    return {"items": items, "total": total, "page": page, "size": size}

@router.post("/", response_model=Curriculum)
async def create_curriculum(
    *,
    db: AsyncSession = Depends(deps.get_db),
    curriculum_in: CurriculumCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await curriculum_service.create(db, obj_in=curriculum_in)

@router.put("/{id}", response_model=Curriculum)
async def update_curriculum(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    curriculum_in: CurriculumUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    curriculum = await curriculum_service.get(db, id=id)
    if not curriculum:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    return await curriculum_service.update(db, db_obj=curriculum, obj_in=curriculum_in)

@router.get("/{id}", response_model=Curriculum)
async def read_curriculum(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    curriculum = await curriculum_service.get(db, id=id)
    if not curriculum:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    return curriculum

@router.delete("/{id}", response_model=Curriculum)
async def delete_curriculum(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await curriculum_service.delete(db, id=id)
