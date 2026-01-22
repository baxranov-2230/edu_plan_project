from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.schemas.role import Role


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    roles: List[str] = ["student"]
    passport_series: Optional[str] = None
    jshshir: Optional[str] = None
    username: Optional[str] = None
    phone_number: Optional[str] = None
    department_id: Optional[int] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: Optional[str] = None
    passport_series: str
    jshshir: str
    phone_number: str


# Properties to receive via API on public registration
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None


# Properties received by API on login
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Properties to return to client
class User(UserBase):
    id: int
    roles: List[Role] = []

    class Config:
        from_attributes = True
