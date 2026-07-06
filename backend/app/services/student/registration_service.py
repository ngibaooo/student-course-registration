from app.repositories.student.registration_repository import RegistrationRepository
from app.repositories.student_repository import (
    get_student_id_by_user_id
)
from fastapi import HTTPException

class RegistrationService:

    @staticmethod
    def register_course_section(
        db,
        # student_id,
        user_id,
        section_id
    ):
        student_id = get_student_id_by_user_id(user_id)

        if student_id is None:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy sinh viên"
            )
        try:
            RegistrationRepository.register_course_section(
                db,
                student_id,
                section_id
    )
            db.commit()
            return {
                "message": "Course registration successful"
    }
        except Exception as e:

            db.rollback()

            message = "Đăng ký thất bại"

            if "Lớp đã đầy" in str(e):
                message = "Lớp học phần đã đầy"

            raise HTTPException(
                status_code=400,
                detail=message
    )
    @staticmethod
    def cancel_course_section(
        db,
        user_id,
        section_id
    ):
        student_id = get_student_id_by_user_id(user_id)

        if student_id is None:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy sinh viên"
            )
        try: 
            RegistrationRepository.cancel_course_section(
                db,
                student_id,
                section_id
            )

            db.commit()

            return {
                "message": "Course canceled successfully"
            }
            
        except Exception as e:

            db.rollback()

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )


# DEMO LỖI
## Lost Update
    @staticmethod
    def register_course_section_lost_update(
        db,
        # student_id,
        user_id,
        section_id
    ):
        student_id = get_student_id_by_user_id(user_id)

        if student_id is None:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy sinh viên"
            )
        try:

            RegistrationRepository.register_course_section_lost_update(
                db,
                student_id,
                section_id
            )

            db.commit()

            return {
                "message": "Course registration successful"
            }
        except Exception as e:

            db.rollback()

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )
    @staticmethod
    def register_course_section_phantom(
        db,
        user_id,
        section_id
    ):
        student_id = get_student_id_by_user_id(user_id)

        if student_id is None:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy sinh viên"
            )

        try:

            RegistrationRepository.register_course_section_phantom(
                db,
                student_id,
                section_id
            )

            db.commit()

            return {
                "message": "Course registration successful"
            }

        except Exception as e:

            db.rollback()

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )