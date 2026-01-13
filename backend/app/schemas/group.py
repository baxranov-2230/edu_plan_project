from typing import Optional, List
from enum import Enum
from pydantic import BaseModel

class EducationShape(str, Enum):
    KUNDUZGI = "kunduzgi"
    KECHKI = "kechki"
    SIRTQI = "sirtqi"
    MASOFAVIY = "masofaviy"

class GroupBase(BaseModel):
    name: str
    speciality_id: int
    course: int = 1
    student_count: int = 0
    education_shape: EducationShape = EducationShape.KUNDUZGI
    he_lab_split: bool = False

class GroupCreate(GroupBase):
    pass

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    speciality_id: Optional[int] = None
    course: Optional[int] = None
    student_count: Optional[int] = None
    education_shape: Optional[EducationShape] = None
    he_lab_split: Optional[bool] = None

class Group(GroupBase):
    id: int

    class Config:
        from_attributes = True

class GroupList(BaseModel):
    items: List[Group]
    total: int
