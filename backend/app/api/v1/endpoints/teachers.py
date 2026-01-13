from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.teacher import Teacher, TeacherCreate, TeacherUpdate, TeacherList
from app.services.teacher_service import teacher_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=TeacherList)
async def read_teachers(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    skip = (page - 1) * size
    items, total = await teacher_service.get_multi(db, skip=skip, limit=size)
    return {"items": items, "total": total, "page": page, "size": size}

@router.post("/", response_model=Teacher)
async def create_teacher(
    *,
    db: AsyncSession = Depends(deps.get_db),
    teacher_in: TeacherCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await teacher_service.create(db, obj_in=teacher_in)

@router.get("/{id}", response_model=Teacher)
async def read_teacher(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    teacher = await teacher_service.get(db, id=id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher
