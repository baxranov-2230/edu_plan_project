from typing import Optional, List
from pydantic import BaseModel
from .group import Group

class StreamBase(BaseModel):
    name: str
    academic_year: str

class StreamCreate(StreamBase):
    group_ids: Optional[List[int]] = []

class StreamUpdate(BaseModel):
    name: Optional[str] = None
    academic_year: Optional[str] = None
    group_ids: Optional[List[int]] = None

class Stream(StreamBase):
    id: int
    groups: List[Group] = []

    class Config:
        from_attributes = True

class StreamList(BaseModel):
    items: List[Stream]
    total: int
