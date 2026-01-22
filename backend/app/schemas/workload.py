from typing import Optional, List
from pydantic import BaseModel
from app.models.workload import LoadType
from .subject import Subject
from .group import Group
from .stream import Stream
from .edu_plan import EduPlan


class WorkloadBase(BaseModel):
    subject_id: int
    edu_plan_id: Optional[int] = None
    load_type: LoadType
    hours: int
    name: Optional[str] = None

    stream_id: Optional[int] = None
    group_id: Optional[int] = None


class WorkloadCreate(WorkloadBase):
    pass


class WorkloadUpdate(BaseModel):
    subject_id: Optional[int] = None
    edu_plan_id: Optional[int] = None
    load_type: Optional[LoadType] = None
    hours: Optional[int] = None
    name: Optional[str] = None

    stream_id: Optional[int] = None
    group_id: Optional[int] = None


class BatchWorkloadItem(BaseModel):
    load_type: LoadType
    hours: int
    stream_ids: List[int] = []
    group_ids: List[int] = []


class WorkloadBatchCreate(BaseModel):
    subject_id: int
    edu_plan_id: Optional[int] = None
    name: Optional[str] = None
    items: List[BatchWorkloadItem]


class WorkloadGroupUpdate(BaseModel):
    subject_id: int  # The ID to search for (original)
    new_subject_id: Optional[int] = None  # If changing the subject
    new_name: Optional[str] = None  # If changing the name
    new_edu_plan_id: Optional[int] = None


class Workload(WorkloadBase):
    id: int

    # Nested objects for display
    subject: Optional[Subject] = None
    edu_plan: Optional[EduPlan] = None
    stream: Optional[Stream] = None
    group: Optional[Group] = None

    class Config:
        from_attributes = True


class WorkloadList(BaseModel):
    items: List[Workload]
    total: int
