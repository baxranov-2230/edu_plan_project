from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.subject import Subject, SubjectCreate, SubjectUpdate, SubjectList
from app.services.subject_service import subject_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=SubjectList)
async def read_subjects(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    search: str | None = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    skip = (page - 1) * size
    items, total = await subject_service.get_multi(db, skip=skip, limit=size, search=search)
    return {"items": items, "total": total, "page": page, "size": size}

@router.post("/", response_model=Subject)
async def create_subject(
    *,
    db: AsyncSession = Depends(deps.get_db),
    subject_in: SubjectCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await subject_service.create(db, obj_in=subject_in)

@router.put("/{id}", response_model=Subject)
async def update_subject(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    subject_in: SubjectUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    subject = await subject_service.get(db, id=id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return await subject_service.update(db, db_obj=subject, obj_in=subject_in)

@router.get("/{id}", response_model=Subject)
async def read_subject(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    subject = await subject_service.get(db, id=id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.delete("/{id}", response_model=Subject)
async def delete_subject(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await subject_service.delete(db, id=id)
