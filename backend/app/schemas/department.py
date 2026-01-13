from typing import Optional
from pydantic import BaseModel, validator

class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    faculty_id: int

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Kiritish maydoni bo'sh bo'lmasligi kerak")
        return v

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    faculty_id: Optional[int] = None

class Department(DepartmentBase):
    id: int

    class Config:
        from_attributes = True
