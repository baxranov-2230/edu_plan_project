from typing import Optional, List
from pydantic import BaseModel
from enum import Enum

class SemesterType(str, Enum):
    KUZGI = "kuzgi"
    BAHORGI = "bahorgi"

class CurriculumBase(BaseModel):
    name: str
    department_id: int
    credits: int = 0
    semesters: List[SemesterType] = [SemesterType.KUZGI]

class CurriculumCreate(CurriculumBase):
    pass

class CurriculumUpdate(BaseModel):
    name: Optional[str] = None
    department_id: Optional[int] = None
    credits: Optional[int] = None
    semesters: Optional[List[SemesterType]] = None

class Curriculum(CurriculumBase):
    id: int

    class Config:
        from_attributes = True

class CurriculumList(BaseModel):
    items: List[Curriculum]
    total: int
