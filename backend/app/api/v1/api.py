from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, faculties, departments, roles

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(faculties.router, prefix="/faculties", tags=["faculties"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
