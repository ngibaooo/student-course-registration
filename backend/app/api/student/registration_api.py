from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.student.registration_schemas import RegisterCourseSectionRequest, CancelCourseSectionRequest
from app.services.student.registration_service import RegistrationService
from app.services.auth_service import require_student

router = APIRouter(
    prefix="/registrations",
    tags=["Registration"]
)

@router.post("")
def register_course(
    request: RegisterCourseSectionRequest,
    current_user: dict = Depends(require_student),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]

    return RegistrationService.register_course_section(
        db,
        user_id,
        request.section_id
    )
@router.delete("")
def cancel_course(
    request: CancelCourseSectionRequest,
    current_user: dict = Depends(require_student),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]

    return RegistrationService.cancel_course_section(
        db,
        user_id,
        request.section_id
    )


# DEMO LỖI
## Lost Update
@router.post("/demo-lost-update")
def register_course_demo(
    request: RegisterCourseSectionRequest,
    current_user: dict = Depends(require_student),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]

    return RegistrationService.register_course_section_lost_update(
        db,
        user_id,
        request.section_id
    )
# DEMO LỖI
## Phantom Read
@router.post("/demo-phantom")
def register_course_demo_phantom(
    request: RegisterCourseSectionRequest,
    current_user: dict = Depends(require_student),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]

    return RegistrationService.register_course_section_phantom(
        db,
        user_id,
        request.section_id
    )