from app.repositories.admin_course_section_repository import (
    CourseSectionRepository
)


class CourseSectionService:

    @staticmethod
    def get_all(db):
        return CourseSectionRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db,
        section_id
    ):

        section = CourseSectionRepository.get_by_id(
            db,
            section_id
        )

        if not section:
            raise Exception(
                "Course section not found"
            )

        return section

    @staticmethod
    def create(
        db,
        section_data
    ):

        try:

            CourseSectionRepository.create(
                db,
                section_data.model_dump()
            )

            db.commit()

            return {
                "message":
                "Course section created successfully"
            }

        except Exception as e:

            db.rollback()
            raise e

    @staticmethod
    def update(
        db,
        section_id,
        section_data
    ):

        try:

            section = CourseSectionRepository.get_by_id(
                db,
                section_id
            )

            if not section:
                raise Exception(
                    "Course section not found"
                )

            CourseSectionRepository.update(
                db,
                section_id,
                section_data.model_dump()
            )

            db.commit()

            return {
                "message":
                "Course section updated successfully"
            }

        except Exception as e:

            db.rollback()
            raise e

    @staticmethod
    def disable(
        db,
        section_id
    ):

        try:

            section = CourseSectionRepository.get_by_id(
                db,
                section_id
            )

            if not section:
                raise Exception(
                    "Course section not found"
                )

            CourseSectionRepository.disable(
                db,
                section_id
            )

            db.commit()

            return {
                "message":
                "Course section disabled successfully"
            }

        except Exception as e:

            db.rollback()
            raise e

    @staticmethod
    def search(
        db,
        keyword
    ):
        return CourseSectionRepository.search(
            db,
            keyword
        )