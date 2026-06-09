from app.repositories.admin_registration_repository import (
    RegistrationRepository
)


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