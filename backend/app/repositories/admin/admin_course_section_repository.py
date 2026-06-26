from sqlalchemy import text


class CourseSectionRepository:

    @staticmethod
    def get_all(db):

        query = text("""
            SELECT
                cs.id,
                cs.classroom,
                cs.schedule_day,
                cs.start_period,
                cs.end_period,
                cs.maximum_students,
                cs.registered_students,
                cs.status,

                cs.semester_id,

                cs.course_id,
                c.course_name,

                cs.lecturer_id,
                l.full_name AS lecturer_name

            FROM CourseSection cs

            JOIN Course c
                ON cs.course_id = c.id

            JOIN Lecturer l
                ON cs.lecturer_id = l.id

            ORDER BY cs.id
        """)
       

        return db.execute(
            query
        ).mappings().all()

    @staticmethod
    def get_by_id(
        db,
        section_id
    ):
        query = text("""
            SELECT

                cs.id,
                cs.classroom,
                cs.schedule_day,
                cs.start_period,
                cs.end_period,
                cs.maximum_students,
                cs.registered_students,
                cs.status,

                cs.semester_id,

                cs.course_id,
                c.course_name,

                cs.lecturer_id,
                l.full_name AS lecturer_name


            FROM CourseSection cs

            JOIN Course c
                ON cs.course_id = c.id

            JOIN Lecturer l
                ON cs.lecturer_id = l.id

            WHERE cs.id=:id
        """)

        return db.execute(
            query,
            {"id": section_id}
        ).mappings().first()

    @staticmethod
    def create(
        db,
        data
    ):

        query = text("""
            INSERT INTO CourseSection
            (
                classroom,
                schedule_day,
                start_period,
                end_period,
                maximum_students,
                registered_students,
                status,
                semester_id,
                course_id,
                lecturer_id
            )
            VALUES
            (
                :classroom,
                :schedule_day,
                :start_period,
                :end_period,
                :maximum_students,
                0,
                'ACTIVE',
                :semester_id,
                :course_id,
                :lecturer_id
            )
        """)

        db.execute(
            query,
            data
        )

    @staticmethod
    def update(
        db,
        section_id,
        data
    ):

        query = text("""
            UPDATE CourseSection
            SET
                classroom=:classroom,
                schedule_day=:schedule_day,
                start_period=:start_period,
                end_period=:end_period,
                maximum_students=:maximum_students,
                semester_id=:semester_id,
                course_id=:course_id,
                lecturer_id=:lecturer_id
            WHERE id=:id
        """)

        db.execute(
            query,
            {
                "id": section_id,
                **data
            }
        )

    @staticmethod
    def disable(
        db,
        section_id
    ):

        query = text("""
            UPDATE CourseSection
            SET status='INACTIVE'
            WHERE id=:id
        """)

        db.execute(
            query,
            {"id": section_id}
        )

    @staticmethod
    def enable(
        db,
        section_id
    ):

        query = text("""
            UPDATE CourseSection
            SET status='ACTIVE'
            WHERE id=:id
        """)

        db.execute(
            query,
            {"id": section_id}
        )

    @staticmethod
    def search(
        db,
        keyword
    ):

        query = text("""
            SELECT

                cs.id,

                c.course_name,

                cs.classroom,
                cs.schedule_day,
                cs.start_period,
                cs.end_period,

                l.full_name AS lecturer_name,

                cs.status


            FROM CourseSection cs


            JOIN Course c
                ON cs.course_id = c.id


            JOIN Lecturer l
                ON cs.lecturer_id = l.id


            WHERE 
                c.course_name LIKE :keyword
                OR l.full_name LIKE :keyword

        """)

        return db.execute(
            query,
            {"keyword": f"%{keyword}%"}
        ).mappings().all()

#Thêm dropdow theo yêu cầu
    @staticmethod
    def get_course_dropdown(db):

        query = text("""
            SELECT
                id,
                course_name
            FROM Course
            WHERE status='ACTIVE'
            ORDER BY course_name
        """)

        return db.execute(
            query
        ).mappings().all()



    @staticmethod
    def get_lecturer_dropdown(db):

        query = text("""
            SELECT
                id,
                full_name
            FROM Lecturer
            ORDER BY full_name
        """)

        return db.execute(
            query
        ).mappings().all()



    @staticmethod
    def get_semester_dropdown(db):

        query = text("""
            SELECT
                id,
                semester_name,
                academic_year
            FROM Semester
            WHERE status='OPEN'
            ORDER BY id DESC
        """)

        return db.execute(
            query
        ).mappings().all()



    # DEMO Loi Non-repeatable Read
    @staticmethod
    def demo_admin_read(db, section_id: int):
        # Gọi Procedure của Admin
        query = text("""
            EXEC sp_demo_non_repeatable_read_admin @section_id = :section_id
        """)
        return db.execute(
            query,
            {"section_id": section_id}
        ).mappings().first()

    @staticmethod
    def demo_student_update(db, section_id: int, add_count: int):
        # Gọi Procedure mô phỏng sinh viên cập nhật
        query = text("""
            EXEC sp_demo_non_repeatable_read_student 
                @section_id = :section_id, 
                @add_count = :add_count
        """)
        db.execute(
            query,
            {
                "section_id": section_id,
                "add_count": add_count
            }
        )