from typing import Optional, List
from pydantic import BaseModel

class SubgroupBase(BaseModel):
    name: str
    group_id: int
    student_count: int = 0

class SubgroupCreate(SubgroupBase):
    pass

class SubgroupUpdate(BaseModel):
    name: Optional[str] = None
    group_id: Optional[int] = None
    student_count: Optional[int] = None

class Subgroup(SubgroupBase):
    id: int

    class Config:
        from_attributes = True

class SubgroupList(BaseModel):
    items: List[Subgroup]
    total: int
