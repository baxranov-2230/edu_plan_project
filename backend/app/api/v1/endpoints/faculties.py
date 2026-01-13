from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.rbac import Permissions
from app.api.deps import PermissionChecker
from app.schemas.faculty import Faculty, FacultyCreate, FacultyUpdate
from app.services.faculty_service import faculty_service

router = APIRouter()

@router.get("/", response_model=List[Faculty])
async def read_faculties(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve faculties.
    """
    faculties = await faculty_service.get_multi(db, skip=skip, limit=limit)
    return faculties

@router.post("/", response_model=Faculty)
async def create_faculty(
    *,
    db: AsyncSession = Depends(deps.get_db),
    faculty_in: FacultyCreate,
    current_user = Depends(deps.PermissionChecker(Permissions.FACULTY_CREATE)),
) -> Any:
    """
    Create new faculty.
    """
    # Optional: Check if user is admin
    # if current_user.role != "admin": ...
    faculty = await faculty_service.create(db, faculty_in)
    return faculty

@router.get("/{id}", response_model=Faculty)
async def read_faculty(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user = Depends(deps.get_current_user),
) -> Any:
    """
    Get faculty by ID.
    """
    faculty = await faculty_service.get(db, id)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty

@router.put("/{id}", response_model=Faculty)
async def update_faculty(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    faculty_in: FacultyUpdate,
    current_user = Depends(deps.PermissionChecker(Permissions.FACULTY_UPDATE)),
) -> Any:
    """
    Update faculty.
    """
    faculty = await faculty_service.get(db, id)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    
    faculty = await faculty_service.update(db, db_obj=faculty, obj_in=faculty_in)
    return faculty

@router.delete("/{id}", response_model=Faculty)
async def delete_faculty(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user = Depends(deps.PermissionChecker(Permissions.FACULTY_DELETE)),
) -> Any:
    """
    Delete faculty.
    """
    faculty = await faculty_service.delete(db, id=id)
    return faculty
