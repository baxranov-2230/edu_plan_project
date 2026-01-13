from typing import Optional, List
from pydantic import BaseModel, validator
from app.models.speciality import EducationType

class SpecialityBase(BaseModel):
    name: str
    department_id: int
    education_type: EducationType

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Kiritish maydoni bo'sh bo'lmasligi kerak")
        return v

class SpecialityCreate(SpecialityBase):
    pass

class SpecialityUpdate(BaseModel):
    name: Optional[str] = None
    department_id: Optional[int] = None
    education_type: Optional[EducationType] = None

class Speciality(SpecialityBase):
    id: int

    class Config:
        from_attributes = True

class SpecialityList(BaseModel):
    items: List[Speciality]
    total: int
    page: int
    size: int
