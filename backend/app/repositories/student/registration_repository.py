from sqlalchemy import text


class RegistrationRepository:

    @staticmethod
    def register_course_section(
        db,
        student_id: int,
        section_id: int
    ):
        query = text("""
            EXEC sp_register_course_section
                @StudentId = :student_id,
                @SectionId = :section_id
        """)

        db.execute(
            query,
            {
                "student_id": student_id,
                "section_id": section_id
            }
        )
    @staticmethod
    def cancel_course_section(
        db,
        student_id: int,
        section_id: int
    ):
        query = text("""
            EXEC sp_cancel_course_section
                @StudentId = :student_id,
                @SectionId = :section_id
        """)

        db.execute(
            query,
            {
                "student_id": student_id,
                "section_id": section_id
            }
        )