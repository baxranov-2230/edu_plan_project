from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.workload import Workload, WorkloadCreate, WorkloadUpdate, WorkloadList, WorkloadBatchCreate, WorkloadGroupUpdate
from app.services.workload_service import workload_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=WorkloadList)
async def read_workloads(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    skip = (page - 1) * size
    items, total = await workload_service.get_multi(db, skip=skip, limit=size)
    return {"items": items, "total": total, "page": page, "size": size}

@router.post("/", response_model=Workload)
async def create_workload(
    *,
    db: AsyncSession = Depends(deps.get_db),
    workload_in: WorkloadCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await workload_service.create(db, obj_in=workload_in)

@router.post("/batch", response_model=List[Workload])
async def create_batch_workload(
    *,
    db: AsyncSession = Depends(deps.get_db),
    batch_in: WorkloadBatchCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create workloads in batch.
    """
    return await workload_service.create_batch(db, obj_in=batch_in)

@router.put("/group_update", response_model=dict)
async def update_workload_group(
    *,
    db: AsyncSession = Depends(deps.get_db),
    group_update: WorkloadGroupUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update multiple workloads grouped by curriculum_id (Global Edit).
    """
    count = await workload_service.update_by_curriculum(db, obj_in=group_update)
    return {"updated_count": count}

@router.delete("/group", response_model=dict)
async def delete_workload_group(
    *,
    db: AsyncSession = Depends(deps.get_db),
    curriculum_id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete multiple workloads grouped by curriculum_id.
    """
    count = await workload_service.delete_by_curriculum(db, curriculum_id=curriculum_id)
    return {"deleted_count": count}


@router.get("/{id}", response_model=Workload)
async def read_workload(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
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
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
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
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await workload_service.delete(db, id=id)
