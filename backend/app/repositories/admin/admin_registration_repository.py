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
    
    # @staticmethod
    # def get_student_history(
    #     db,
    #     student_id
    # ):

    #     query = text("""
    #         SELECT
    #             c.course_name,
    #             sem.semester_name,
    #             cs.classroom,
    #             cr.registration_date,
    #             cr.status
    #         FROM CourseRegistration cr

    #         JOIN CourseSection cs
    #             ON cr.section_id = cs.id

    #         JOIN Course c
    #             ON cs.course_id = c.id

    #         JOIN Semester sem
    #             ON cs.semester_id = sem.id

    #         WHERE cr.student_id = :student_id

    #         ORDER BY cr.registration_date DESC
    #     """)

    #     return db.execute(
    #         query,
    #         {"student_id": student_id}
    #     ).mappings().all()
    @staticmethod
    def get_student_history(
        db,
        student_id
    ):

        query = text("""
            SELECT
                cr.section_id,

                cs.course_id,

                c.course_name,

                sem.semester_name,

                cs.classroom,

                cs.schedule_day,

                cs.start_period,

                cs.end_period,

                l.full_name AS lecturer_name,

                cr.registration_date,

                cr.status

            FROM CourseRegistration cr

            JOIN CourseSection cs
                ON cr.section_id = cs.id

            JOIN Course c
                ON cs.course_id = c.id

            JOIN Semester sem
                ON cs.semester_id = sem.id

            LEFT JOIN Lecturer l
                ON cs.lecturer_id = l.id

            WHERE cr.student_id = :student_id
            AND cr.status = 'REGISTERED'

            ORDER BY
                c.course_name
        """)

        return db.execute(
            query,
            {
                "student_id": student_id
            }
        ).mappings().all()
        
    @staticmethod
    def statistics_course_sections(db):
        # Gọi thẳng View đã tạo trong DB
        query = text("""
            SELECT * FROM vw_CourseSectionStatistics 
            ORDER BY course_name
        """)
        return db.execute(query).mappings().all()
        
    @staticmethod
    def statistics_semesters(db):
        # Gọi thẳng View đã tạo trong DB
        query = text("""
            SELECT * FROM vw_SemesterStatistics 
            ORDER BY id
        """)
        return db.execute(query).mappings().all()

    from sqlalchemy import text

# Chuyển lớp học phần cho svien
    @staticmethod
    def transfer_course_section(
        db,
        student_id: int,
        from_section_id: int,
        to_section_id: int
    ):
        query = text("""
            EXEC sp_transfer_course_section
                @StudentId = :student_id,
                @FromSectionId = :from_section_id,
                @ToSectionId = :to_section_id
        """)

        db.execute(
            query,
            {
                "student_id": student_id,
                "from_section_id": from_section_id,
                "to_section_id": to_section_id
            }
        )

# DEMO LỖI
    ## Deadlock
    @staticmethod
    def transfer_course_section_deadlock(
        db,
        student_id: int,
        from_section_id: int,
        to_section_id: int
    ):
        query = text("""
            EXEC sp_transfer_course_section_deadlock
                @StudentId = :student_id,
                @FromSectionId = :from_section_id,
                @ToSectionId = :to_section_id
        """)

        db.execute(
            query,
            {
                "student_id": student_id,
                "from_section_id": from_section_id,
                "to_section_id": to_section_id
            }
        )