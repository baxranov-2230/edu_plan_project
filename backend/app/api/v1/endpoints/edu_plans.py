from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.edu_plan import EduPlan, EduPlanCreate, EduPlanUpdate
from app.services.edu_plan_service import edu_plan_service
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[EduPlan])
async def read_edu_plans(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    O'quv rejalari ro'yxatini olish.
    """
    return await edu_plan_service.get_multi(db, skip=skip, limit=limit)


@router.post("/", response_model=EduPlan)
async def create_edu_plan(
    *,
    db: AsyncSession = Depends(deps.get_db),
    edu_plan_in: EduPlanCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Yangi o'quv rejasi yaratish.
    """
    return await edu_plan_service.create(db=db, obj_in=edu_plan_in)


@router.put("/{id}", response_model=EduPlan)
async def update_edu_plan(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    edu_plan_in: EduPlanUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    O'quv rejasini yangilash.
    """
    edu_plan = await edu_plan_service.get(db=db, id=id)
    if not edu_plan:
        raise HTTPException(status_code=404, detail="EduPlan not found")
    return await edu_plan_service.update(db=db, db_obj=edu_plan, obj_in=edu_plan_in)


@router.delete("/{id}", response_model=EduPlan)
async def delete_edu_plan(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    O'quv rejasini o'chirish.
    """
    edu_plan = await edu_plan_service.get(db=db, id=id)
    if not edu_plan:
        raise HTTPException(status_code=404, detail="EduPlan not found")
    return await edu_plan_service.delete(db=db, id=id)
