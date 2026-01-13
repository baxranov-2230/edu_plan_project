from typing import Optional, List
from pydantic import BaseModel

class TeacherBase(BaseModel):
    user_id: int
    department_id: int

class TeacherCreate(TeacherBase):
    pass

class TeacherUpdate(BaseModel):
    user_id: Optional[int] = None
    department_id: Optional[int] = None

class Teacher(TeacherBase):
    id: int
    # We might want to include nested User info later

    class Config:
        from_attributes = True

class TeacherList(BaseModel):
    items: List[Teacher]
    total: int
