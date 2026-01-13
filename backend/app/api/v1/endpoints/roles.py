from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.schemas.role import Role, RoleCreate, RoleUpdate, Permission
from app.services.role_service import role_service
from app.core.rbac import Permissions

router = APIRouter()

@router.get("/", response_model=List[Role])
async def read_roles(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.PermissionChecker(Permissions.ROLE_READ)),
) -> Any:
    """
    Retrieve roles.
    """
    return await role_service.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=Role)
async def create_role(
    *,
    db: AsyncSession = Depends(deps.get_db),
    role_in: RoleCreate,
    current_user = Depends(deps.PermissionChecker(Permissions.ROLE_CREATE)),
) -> Any:
    """
    Create new role.
    """
    return await role_service.create(db, role_in=role_in)

@router.put("/{id}", response_model=Role)
async def update_role(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    role_in: RoleUpdate,
    current_user = Depends(deps.PermissionChecker(Permissions.ROLE_UPDATE)),
) -> Any:
    """
    Update a role.
    """
    role = await role_service.get(db, id=id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return await role_service.update(db, role=role, role_in=role_in)

@router.delete("/{id}", response_model=Role)
async def delete_role(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user = Depends(deps.PermissionChecker(Permissions.ROLE_DELETE)),
) -> Any:
    """
    Delete a role.
    """
    return await role_service.delete(db, id=id)

@router.get("/permissions", response_model=List[Permission])
async def read_permissions(
    db: AsyncSession = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve all system permissions.
    """
    return await role_service.get_all_permissions(db)
