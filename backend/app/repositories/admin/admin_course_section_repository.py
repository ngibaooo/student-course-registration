from sqlalchemy import text


class CourseSectionRepository:

    @staticmethod
    def get_all(db):

        query = text("""
            SELECT
                id,
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
            FROM CourseSection
            ORDER BY id
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
            SELECT *
            FROM CourseSection
            WHERE id=:id
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
                cs.status
            FROM CourseSection cs
            JOIN Course c
                ON cs.course_id = c.id
            WHERE c.course_name LIKE :keyword
        """)

        return db.execute(
            query,
            {"keyword": f"%{keyword}%"}
        ).mappings().all()