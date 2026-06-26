from app.repositories.admin.admin_course_section_repository import (
    CourseSectionRepository
)
from fastapi import HTTPException, status

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
    def enable(
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

            CourseSectionRepository.enable(
                db,
                section_id
            )

            db.commit()

            return {
                "message":
                "Course section enable successfully"
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
    
#DEMO LOI
    @staticmethod
    def demo_admin_read(db, section_id: int):
        try:
            db.begin()
            result = CourseSectionRepository.demo_admin_read(db, section_id)
            db.commit()
            return result
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def demo_student_update(db, section_id: int, add_count: int):
        try:
            db.begin()
            CourseSectionRepository.demo_student_update(db, section_id, add_count)
            db.commit()
            return {"message": f"Successfully added {add_count} students to section {section_id}"}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))