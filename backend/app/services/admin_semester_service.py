from app.repositories.admin_semester_repository import (
    SemesterRepository
)


class SemesterService:

    @staticmethod
    def get_all(db):
        return SemesterRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db,
        semester_id
    ):

        semester = SemesterRepository.get_by_id(
            db,
            semester_id
        )

        if not semester:
            raise Exception(
                "Semester not found"
            )

        return semester

    @staticmethod
    def create(
        db,
        semester_data
    ):

        try:

            SemesterRepository.create(
                db,
                semester_data.model_dump()
            )

            db.commit()

            return {
                "message":
                "Semester created successfully"
            }

        except Exception as e:

            db.rollback()
            raise e

    @staticmethod
    def update(
        db,
        semester_id,
        semester_data
    ):

        try:

            semester = SemesterRepository.get_by_id(
                db,
                semester_id
            )

            if not semester:
                raise Exception(
                    "Semester not found"
                )

            SemesterRepository.update(
                db,
                semester_id,
                semester_data.model_dump()
            )

            db.commit()

            return {
                "message":
                "Semester updated successfully"
            }

        except Exception as e:

            db.rollback()
            raise e

    @staticmethod
    def open_semester(
        db,
        semester_id
    ):

        try:

            semester = SemesterRepository.get_by_id(
                db,
                semester_id
            )

            if not semester:
                raise Exception(
                    "Semester not found"
                )

            SemesterRepository.open_semester(
                db,
                semester_id
            )

            db.commit()

            return {
                "message":
                "Semester opened successfully"
            }

        except Exception as e:

            db.rollback()
            raise e

    @staticmethod
    def close_semester(
        db,
        semester_id
    ):

        try:

            semester = SemesterRepository.get_by_id(
                db,
                semester_id
            )

            if not semester:
                raise Exception(
                    "Semester not found"
                )

            SemesterRepository.close_semester(
                db,
                semester_id
            )

            db.commit()

            return {
                "message":
                "Semester closed successfully"
            }

        except Exception as e:

            db.rollback()
            raise e