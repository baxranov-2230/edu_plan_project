from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.schemas.speciality import (
    Speciality,
    SpecialityCreate,
    SpecialityUpdate,
    SpecialityList,
)
from app.services.speciality_service import speciality_service
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=SpecialityList)
async def read_specialities(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    search: str | None = None,
    department_id: int | None = None,
    education_type: str | None = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Yo'nalishlar ro'yxatini olish.
    """
    if page < 1:
        page = 1
    skip = (page - 1) * size
    items, total = await speciality_service.get_multi(
        db,
        skip=skip,
        limit=size,
        search=search,
        department_id=department_id,
        education_type=education_type,
    )
    return {"items": items, "total": total, "page": page, "size": size}


@router.post("/", response_model=Speciality)
async def create_speciality(
    *,
    db: AsyncSession = Depends(deps.get_db),
    speciality_in: SpecialityCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Yangi yo'nalish yaratish.
    """
    return await speciality_service.create(db, speciality_in=speciality_in)


@router.put("/{id}", response_model=Speciality)
async def update_speciality(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    speciality_in: SpecialityUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Yo'nalish ma'lumotlarini yangilash.
    """
    speciality = await speciality_service.get(db, id=id)
    if not speciality:
        raise HTTPException(status_code=404, detail="Speciality not found")
    return await speciality_service.update(db, db_obj=speciality, obj_in=speciality_in)


@router.get("/{id}", response_model=Speciality)
async def read_speciality(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Yo'nalishni ID orqali olish.
    """
    speciality = await speciality_service.get(db, id=id)
    if not speciality:
        raise HTTPException(status_code=404, detail="Speciality not found")
    return speciality


@router.delete("/{id}", response_model=Speciality)
async def delete_speciality(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Yo'nalishni o'chirish.
    """
    return await speciality_service.delete(db, id=id)
