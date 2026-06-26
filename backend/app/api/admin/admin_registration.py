from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.services.admin.admin_registration_service import (
    RegistrationService
)
from app.schemas.admin.admin_registration_schemas import (
    TransferCourseSectionRequest
)

from app.services.auth_service import require_admin

router = APIRouter(
    tags=["Admin Registration"],
    dependencies=[Depends(require_admin)]
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

@router.put("/admin/registrations/transfer")
def transfer_course_section(
    request: TransferCourseSectionRequest,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):

    return RegistrationService.transfer_course_section(
        db=db,
        student_id=request.student_id,
        from_section_id=request.from_section_id,
        to_section_id=request.to_section_id
    )