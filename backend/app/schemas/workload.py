from typing import Optional, List
from pydantic import BaseModel
from app.models.workload import LoadType
from .curriculum import Curriculum
from .group import Group
from .subgroup import Subgroup
from .stream import Stream

class WorkloadBase(BaseModel):
    curriculum_id: int
    load_type: LoadType
    hours: int
    name: Optional[str] = None
    
    stream_id: Optional[int] = None
    group_id: Optional[int] = None
    subgroup_id: Optional[int] = None

class WorkloadCreate(WorkloadBase):
    pass

class WorkloadUpdate(BaseModel):
    curriculum_id: Optional[int] = None
    load_type: Optional[LoadType] = None
    hours: Optional[int] = None
    name: Optional[str] = None
    
    stream_id: Optional[int] = None
    group_id: Optional[int] = None
    subgroup_id: Optional[int] = None

class BatchWorkloadItem(BaseModel):
    load_type: LoadType
    hours: int
    stream_ids: List[int] = []
    group_ids: List[int] = []

class WorkloadBatchCreate(BaseModel):
    curriculum_id: int
    name: Optional[str] = None
    items: List[BatchWorkloadItem]

class WorkloadGroupUpdate(BaseModel):
    curriculum_id: int # The ID to search for (original)
    new_curriculum_id: Optional[int] = None # If changing the subject
    new_name: Optional[str] = None # If changing the name

class Workload(WorkloadBase):
    id: int
    
    # Nested objects for display
    curriculum: Optional[Curriculum] = None
    stream: Optional[Stream] = None
    group: Optional[Group] = None
    subgroup: Optional[Subgroup] = None

    class Config:
        from_attributes = True

class WorkloadList(BaseModel):
    items: List[Workload]
    total: int
