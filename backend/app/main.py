from fastapi import FastAPI
from app.api.admin_registration import (router as admin_registration_router)
from app.api.admin_student import router as admin_student_router
from app.api.admin_course import router as admin_course_router
from app.api.admin_semester import router as admin_semester_router
from app.api.admin_course_section import (router as admin_course_section_router)
app = FastAPI()

app.include_router(admin_student_router)
app.include_router(admin_course_router)
app.include_router(admin_semester_router)
app.include_router(admin_course_section_router)
app.include_router(admin_registration_router)