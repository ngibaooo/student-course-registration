from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.admin.admin_registration import (router as admin_registration_router)
from app.api.admin.admin_student import router as admin_student_router
from app.api.admin.admin_course import router as admin_course_router
from app.api.admin.admin_semester import router as admin_semester_router
from app.api.admin.admin_course_section import (router as admin_course_section_router,demo_router)
from app.api.student.registration_api import router as registration_router
from app.api.auth import router as auth_router
from app.api.student_api import router as student_router

app = FastAPI(
    title="Student Course Registration API",
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
app.include_router(admin_student_router)
app.include_router(admin_course_router)
app.include_router(admin_semester_router)
app.include_router(admin_course_section_router)
app.include_router(admin_registration_router)
app.include_router(registration_router)

#API DEMO LOI
app.include_router(demo_router)

# @app.get("/")
# def home():
#     return {
#         "message": "Student Course Registration API is running"
#     }
# app = FastAPI()
