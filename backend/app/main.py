from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.student import router as student_router


app = FastAPI(
    title="Student Course Registration System",
    description="API hệ thống quản lý sinh viên đăng ký học phần",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(student_router)


@app.get("/")
def home():
    return {
        "message": "Student Course Registration API is running"
    }