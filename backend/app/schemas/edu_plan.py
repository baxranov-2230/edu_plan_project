from pydantic import BaseModel
from typing import Optional, List
from app.schemas.speciality import Speciality

class EduPlanBase(BaseModel):
    name: str
    speciality_id: int
    is_active: bool = True

class EduPlanCreate(EduPlanBase):
    pass

class EduPlanUpdate(BaseModel):
    name: Optional[str] = None
    speciality_id: Optional[int] = None
    is_active: Optional[bool] = None

class EduPlan(EduPlanBase):
    id: int
    speciality: Optional[Speciality] = None

    class Config:
        from_attributes = True
