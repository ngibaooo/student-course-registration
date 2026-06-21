from sqlalchemy import text


class RegistrationRepository:

    @staticmethod
    def get_registrations_by_section(
        db,
        section_id
    ):

        query = text("""
            SELECT
                s.id AS student_id,
                u.full_name,
                u.email,
                cr.registration_date,
                cr.status
            FROM CourseRegistration cr

            JOIN Student s
                ON cr.student_id = s.id

            JOIN [User] u
                ON s.user_id = u.id

            WHERE cr.section_id = :section_id

            ORDER BY u.full_name
        """)

        return db.execute(
            query,
            {"section_id": section_id}
        ).mappings().all()
    
    @staticmethod
    def get_student_history(
        db,
        student_id
    ):

        query = text("""
            SELECT
                c.course_name,
                sem.semester_name,
                cs.classroom,
                cr.registration_date,
                cr.status
            FROM CourseRegistration cr

            JOIN CourseSection cs
                ON cr.section_id = cs.id

            JOIN Course c
                ON cs.course_id = c.id

            JOIN Semester sem
                ON cs.semester_id = sem.id

            WHERE cr.student_id = :student_id

            ORDER BY cr.registration_date DESC
        """)

        return db.execute(
            query,
            {"student_id": student_id}
        ).mappings().all()
    
    @staticmethod
    def statistics_course_sections(db):

        query = text("""
            SELECT
                cs.id,
                c.course_name,
                cs.classroom,
                cs.maximum_students,
                cs.registered_students,

                CAST(
                    cs.registered_students * 100.0
                    / cs.maximum_students
                    AS DECIMAL(5,2)
                ) AS occupancy_rate

            FROM CourseSection cs

            JOIN Course c
                ON cs.course_id = c.id

            ORDER BY c.course_name
        """)

        return db.execute(
            query
        ).mappings().all()
    
    @staticmethod
    def statistics_semesters(db):

        query = text("""
            SELECT
                sem.id,
                sem.semester_name,

                COUNT(DISTINCT cs.id)
                    AS total_sections,

                COUNT(cr.student_id)
                    AS total_registrations

            FROM Semester sem

            LEFT JOIN CourseSection cs
                ON sem.id = cs.semester_id

            LEFT JOIN CourseRegistration cr
                ON cs.id = cr.section_id

            GROUP BY
                sem.id,
                sem.semester_name

            ORDER BY sem.id
        """)

        return db.execute(
            query
        ).mappings().all()