from app.repositories.student.registration_repository import RegistrationRepository
from fastapi import HTTPException

class RegistrationService:

    @staticmethod
    def register_course_section(
        db,
        student_id,
        section_id
    ):
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

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )
    @staticmethod
    def cancel_course_section(
        db,
        student_id,
        section_id
    ):

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