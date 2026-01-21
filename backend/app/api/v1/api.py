from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    faculties,
    departments,
    roles,
    specialities,
    groups,
    teachers,
    subjects,
    streams,
    workloads,
    edu_plans,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(faculties.router, prefix="/faculties", tags=["faculties"])
api_router.include_router(
    departments.router, prefix="/departments", tags=["departments"]
)
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(
    specialities.router, prefix="/specialities", tags=["specialities"]
)
api_router.include_router(groups.router, prefix="/groups", tags=["groups"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(streams.router, prefix="/streams", tags=["streams"])
api_router.include_router(workloads.router, prefix="/workloads", tags=["workloads"])
api_router.include_router(edu_plans.router, prefix="/edu-plans", tags=["edu-plans"])
