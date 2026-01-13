from typing import Optional
from pydantic import BaseModel, validator

class FacultyBase(BaseModel):
    name: str
    description: Optional[str] = None

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Kiritish maydoni bo'sh bo'lmasligi kerak")
        return v

class FacultyCreate(FacultyBase):
    pass

class FacultyUpdate(FacultyBase):
    pass

class Faculty(FacultyBase):
    id: int

    class Config:
        from_attributes = True
