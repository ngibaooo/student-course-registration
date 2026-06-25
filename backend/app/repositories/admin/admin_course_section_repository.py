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