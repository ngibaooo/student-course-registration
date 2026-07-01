from app.repositories.admin.admin_registration_repository import (
    RegistrationRepository
)
from fastapi import HTTPException, status


class RegistrationService:

    @staticmethod
    def get_registrations_by_section(
        db,
        section_id
    ):

        try:

            db.begin()

            result = (
                RegistrationRepository
                .get_registrations_by_section(
                    db,
                    section_id
                )
            )

            db.commit()

            return result

        except Exception:

            db.rollback()
            raise

    @staticmethod
    def get_student_history(
        db,
        student_id
    ):

        try:

            db.begin()

            result = (
                RegistrationRepository
                .get_student_history(
                    db,
                    student_id
                )
            )

            db.commit()

            return result

        except Exception:

            db.rollback()
            raise

    @staticmethod
    def statistics_course_sections(
        db
    ):

        try:

            db.begin()

            result = (
                RegistrationRepository
                .statistics_course_sections(
                    db
                )
            )

            db.commit()

            return result

        except Exception:

            db.rollback()
            raise

    @staticmethod
    def statistics_semesters(
        db
    ):

        try:

            db.begin()

            result = (
                RegistrationRepository
                .statistics_semesters(
                    db
                )
            )

            db.commit()

            return result

        except Exception:

            db.rollback()
            raise

# Chuyển LHP cho svien
    @staticmethod
    def transfer_course_section(
        db,
        student_id,
        from_section_id,
        to_section_id
    ):
        try:

            RegistrationRepository.transfer_course_section(
                db,
                student_id,
                from_section_id,
                to_section_id
            )

            db.commit()

            return {
                "message": "Transfer course section successfully"
            }

        except Exception as e:

            db.rollback()
            message = str(e.orig) if hasattr(e, "orig") else str(e)

            raise HTTPException(
                status_code=400,
                detail=message
            )

    @staticmethod
    def get_registration_log_by_student_id(
        db,
        student_id
    ):

        return RegistrationRepository.get_registration_log_by_student_id(
            db,
            student_id
        )

# Demo lỗi
    ## Deadlock
    @staticmethod
    def transfer_course_section_deadlock(
        db,
        student_id,
        from_section_id,
        to_section_id
    ):
        try:

            RegistrationRepository.transfer_course_section_deadlock(
                db,
                student_id,
                from_section_id,
                to_section_id
            )

            db.commit()

            return {
                "message": "Transfer course section successfully"
            }

        except Exception as e:

            db.rollback()

            message = str(e.orig) if hasattr(e, "orig") else str(e)

            raise HTTPException(
                status_code=400,
                detail=message
            )