from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.rbac import Permissions
from app.schemas.department import Department, DepartmentCreate, DepartmentUpdate
from app.services.department_service import department_service

router = APIRouter()

@router.get("/", response_model=List[Department])
async def read_departments(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve departments.
    """
    departments = await department_service.get_multi(db, skip=skip, limit=limit)
    return departments

@router.post("/", response_model=Department)
async def create_department(
    *,
    db: AsyncSession = Depends(deps.get_db),
    department_in: DepartmentCreate,
    current_user = Depends(deps.PermissionChecker(Permissions.DEPARTMENT_CREATE)),
) -> Any:
    """
    Create new department.
    """
    department = await department_service.create(db, department_in)
    return department

@router.get("/{id}", response_model=Department)
async def read_department(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user = Depends(deps.get_current_user),
) -> Any:
    """
    Get department by ID.
    """
    department = await department_service.get(db, id)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department

@router.put("/{id}", response_model=Department)
async def update_department(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    department_in: DepartmentUpdate,
    current_user = Depends(deps.PermissionChecker(Permissions.DEPARTMENT_UPDATE)),
) -> Any:
    """
    Update department.
    """
    department = await department_service.get(db, id)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    department = await department_service.update(db, db_obj=department, obj_in=department_in)
    return department

@router.delete("/{id}", response_model=Department)
async def delete_department(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user = Depends(deps.PermissionChecker(Permissions.DEPARTMENT_DELETE)),
) -> Any:
    """
    Delete department.
    """
    department = await department_service.delete(db, id=id)
    return department
