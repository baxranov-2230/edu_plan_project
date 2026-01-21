from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.core.rbac import Permissions
from app.schemas.workload import (
    Workload,
    WorkloadCreate,
    WorkloadUpdate,
    WorkloadList,
    WorkloadBatchCreate,
    WorkloadGroupUpdate,
)
from app.services.workload_service import workload_service
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=WorkloadList)
async def read_workloads(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    edu_plan_id: Optional[int] = Query(None, description="Filter by EduPlan ID"),
    current_user: User = Depends(deps.PermissionChecker(Permissions.WORKLOAD_READ)),
) -> Any:
    """
    Yuklamalar ro'yxatini olish.
    """
    skip = (page - 1) * size
    items, total = await workload_service.get_multi(
        db, skip=skip, limit=size, edu_plan_id=edu_plan_id
    )
    return {"items": items, "total": total, "page": page, "size": size}


@router.post("/", response_model=Workload)
async def create_workload(
    *,
    db: AsyncSession = Depends(deps.get_db),
    workload_in: WorkloadCreate,
    current_user: User = Depends(deps.PermissionChecker(Permissions.WORKLOAD_CREATE)),
) -> Any:
    """
    Yangi yuklama yaratish.
    """
    return await workload_service.create(db, obj_in=workload_in)


@router.post("/batch", response_model=List[Workload])
async def create_batch_workload(
    *,
    db: AsyncSession = Depends(deps.get_db),
    batch_in: WorkloadBatchCreate,
    current_user: User = Depends(deps.PermissionChecker(Permissions.WORKLOAD_CREATE)),
) -> Any:
    """
    Yuklamalarni ommaviy yaratish (Batch).
    """
    return await workload_service.create_batch(db, obj_in=batch_in)


@router.put("/group_update", response_model=dict)
async def update_workload_group(
    *,
    db: AsyncSession = Depends(deps.get_db),
    group_update: WorkloadGroupUpdate,
    current_user: User = Depends(deps.PermissionChecker(Permissions.WORKLOAD_UPDATE)),
) -> Any:
    """
    Fan bo'yicha bir nechta yuklamalarni yangilash (Global Tahrirlash).
    """
    count = await workload_service.update_by_subject(db, obj_in=group_update)
    return {"updated_count": count}


@router.delete("/group", response_model=dict)
async def delete_workload_group(
    *,
    db: AsyncSession = Depends(deps.get_db),
    subject_id: int,
    current_user: User = Depends(deps.PermissionChecker(Permissions.WORKLOAD_DELETE)),
) -> Any:
    """
    Fan bo'yicha bir nechta yuklamalarni o'chirish.
    """
    count = await workload_service.delete_by_subject(db, subject_id=subject_id)
    return {"deleted_count": count}


@router.get("/{id}", response_model=Workload)
async def read_workload(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.PermissionChecker(Permissions.WORKLOAD_READ)),
) -> Any:
    """
    Yuklamani ID orqali olish.
    """
    workload = await workload_service.get(db, id=id)
    if not workload:
        raise HTTPException(status_code=404, detail="Workload not found")
    return workload


@router.put("/{id}", response_model=Workload)
async def update_workload(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    workload_in: WorkloadUpdate,
    current_user: User = Depends(deps.PermissionChecker(Permissions.WORKLOAD_UPDATE)),
) -> Any:
    """
    Yuklamani yangilash.
    """
    workload = await workload_service.get(db, id=id)
    if not workload:
        raise HTTPException(status_code=404, detail="Workload not found")
    workload = await workload_service.update(db, db_obj=workload, obj_in=workload_in)
    return workload


@router.delete("/{id}", response_model=Workload)
async def delete_workload(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.PermissionChecker(Permissions.WORKLOAD_DELETE)),
) -> Any:
    """
    Yuklamani o'chirish.
    """
    return await workload_service.delete(db, id=id)
