from fastapi import FastAPI
from app.api.admin.admin_registration import (router as admin_registration_router)
from app.api.admin.admin_student import router as admin_student_router
from app.api.admin.admin_course import router as admin_course_router
from app.api.admin.admin_semester import router as admin_semester_router
from app.api.admin.admin_course_section import (router as admin_course_section_router)
from app.api.student.registration_api import router as registration_router
app = FastAPI()

app.include_router(admin_student_router)
app.include_router(admin_course_router)
app.include_router(admin_semester_router)
app.include_router(admin_course_section_router)
app.include_router(admin_registration_router)
app.include_router(registration_router)