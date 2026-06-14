from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.student.registration_schema import RegisterCourseRequest
from app.services.student.registration_service import RegistrationService
from app.services.auth_service import require_student

router = APIRouter(
    prefix="/registrations",
    tags=["Registration"]
)

@router.post("")
def register_course(
    request: RegisterCourseRequest,
    current_user = Depends(require_student),
    db: Session = Depends(get_db)
):
    student_id = current_user["student_id"]

    return RegistrationService.register_course_section(
        db,
        student_id,
        request.section_id
    )
@router.delete("")
def cancel_course(
    request: CancelCourseRequest,
    current_user = Depends(require_student),
    db: Session = Depends(get_db)
):
    student_id = current_user["student_id"]

    return RegistrationService.cancel_course_section(
        db,
        student_id,
        request.section_id
    )