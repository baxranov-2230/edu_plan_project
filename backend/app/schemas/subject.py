from typing import Optional, List
from pydantic import BaseModel
from enum import Enum

class SemesterType(str, Enum):
    KUZGI = "kuzgi"
    BAHORGI = "bahorgi"

class SubjectBase(BaseModel):
    name: str
    department_id: int
    credits: int = 0
    semesters: List[str] = []

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    department_id: Optional[int] = None
    credits: Optional[int] = None
    semesters: Optional[List[str]] = None

class Subject(SubjectBase):
    id: int

    class Config:
        from_attributes = True

class SubjectList(BaseModel):
    items: List[Subject]
    total: int
