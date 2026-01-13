from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.stream import Stream, StreamCreate, StreamUpdate, StreamList
from app.services.stream_service import stream_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=StreamList)
async def read_streams(
    db: AsyncSession = Depends(deps.get_db),
    page: int = 1,
    size: int = 20,
    search: str | None = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    skip = (page - 1) * size
    items, total = await stream_service.get_multi(db, skip=skip, limit=size, search=search)
    return {"items": items, "total": total, "page": page, "size": size}

@router.post("/", response_model=Stream)
async def create_stream(
    *,
    db: AsyncSession = Depends(deps.get_db),
    stream_in: StreamCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await stream_service.create(db, obj_in=stream_in)

@router.put("/{id}", response_model=Stream)
async def update_stream(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    stream_in: StreamUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    stream = await stream_service.get(db, id=id)
    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")
    return await stream_service.update(db, db_obj=stream, obj_in=stream_in)

@router.get("/{id}", response_model=Stream)
async def read_stream(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    stream = await stream_service.get(db, id=id)
    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")
    return stream

@router.delete("/{id}", response_model=Stream)
async def delete_stream(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    return await stream_service.delete(db, id=id)
