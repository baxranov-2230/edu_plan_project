from typing import List, Optional
from pydantic import BaseModel

# Permission Schemas
class PermissionBase(BaseModel):
    slug: str
    description: Optional[str] = None

class PermissionCreate(PermissionBase):
    pass

class Permission(PermissionBase):
    id: int

    class Config:
        from_attributes = True

# Role Schemas
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    permissions: List[int] = [] # List of Permission IDs

class RoleUpdate(RoleBase):
    permissions: List[int] = []

class Role(RoleBase):
    id: int
    permissions: List[Permission] = []

    class Config:
        from_attributes = True

class RoleWithPermissions(Role):
    pass
