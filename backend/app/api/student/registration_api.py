from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.student.registration_schemas import RegisterCourseSectionRequest, CancelCourseSectionRequest
from app.services.student.registration_service import RegistrationService
# from app.services.auth_service import require_student #tên hàm này phụ thuộc bên auth_service của nhánh student
                                                      #(đợi nhánh đó xong sẽ update theo đúng tên hàm)

router = APIRouter(
    prefix="/registrations",
    tags=["Registration"]
)
#Fake JWT để test api trong lúc đợi phần auth
def fake_student():
    return {
        "student_id": 1,
        "role": "STUDENT"
    }

@router.post("")
def register_course(
    request: RegisterCourseSectionRequest,
    # current_user = Depends(require_student),
    current_user = Depends(fake_student),
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
    request: CancelCourseSectionRequest,
    # current_user = Depends(require_student),
    current_user = Depends(fake_student),
    db: Session = Depends(get_db)
):
    student_id = current_user["student_id"]

    return RegistrationService.cancel_course_section(
        db,
        student_id,
        request.section_id
    )