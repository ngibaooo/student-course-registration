from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.services.admin_registration_service import (
    RegistrationService
)

router = APIRouter(
    tags=["Admin Registration"]
)

@router.get("/admin/course-sections/{id}/registrations")
def get_registrations_by_section(
    id: int,
    db: Session = Depends(get_db)
):
    try:
        return RegistrationService.get_registrations_by_section(
            db,
            id
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/admin/students/{id}/registrations")
def get_student_registration_history(
    id: int,
    db: Session = Depends(get_db)
):
    try:
        return RegistrationService.get_student_history(
            db,
            id
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/admin/statistics/course-sections")
def statistics_course_sections(
    db: Session = Depends(get_db)
):
    try:
        return RegistrationService.statistics_course_sections(
            db
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/admin/statistics/semesters")
def statistics_semesters(
    db: Session = Depends(get_db)
):
    try:
        return RegistrationService.statistics_semesters(
            db
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )