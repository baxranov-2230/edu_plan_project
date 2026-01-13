from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router


app = FastAPI(
    title=settings.PROJECT_NAME, 
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
# Hardcoded CORS origins as requested
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://0.0.0.0:5173",
    "http://127.0.0.1:5173",
    "http://0.0.0.0:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
print(f"DEBUG: SECRET_KEY is: {settings.SECRET_KEY}")


@app.get("/health")
def health_check():
    return {"status": "ok", "app_name": settings.PROJECT_NAME}

@app.get("/")
def root():
    return {"message": "Welcome to EduPlan API"}
