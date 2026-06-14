from sqlalchemy import text


class CourseRepository:

    @staticmethod
    def get_all(db):
        query = text("""
            SELECT
                id,
                course_name,
                credits,
                description,
                status
            FROM Course
            ORDER BY id
        """)
        return db.execute(query).mappings().all()

    @staticmethod
    def get_by_id(db, course_id):
        query = text("""
            SELECT
                id,
                course_name,
                credits,
                description,
                status
            FROM Course
            WHERE id = :id
        """)
        return db.execute(
            query,
            {"id": course_id}
        ).mappings().first()

    @staticmethod
    def create(db, data):
        query = text("""
            INSERT INTO Course
            (
                course_name,
                credits,
                description,
                status
            )
            VALUES
            (
                :course_name,
                :credits,
                :description,
                'ACTIVE'
            )
        """)

        db.execute(query, data)

    @staticmethod
    def update(db, course_id, data):
        query = text("""
            UPDATE Course
            SET
                course_name = :course_name,
                credits = :credits,
                description = :description
            WHERE id = :id
        """)

        db.execute(
            query,
            {
                "id": course_id,
                **data
            }
        )

    @staticmethod
    def disable(db, course_id):
        query = text("""
            UPDATE Course
            SET status='INACTIVE'
            WHERE id=:id
        """)

        db.execute(
            query,
            {"id": course_id}
        )

    @staticmethod
    def search(db, keyword):
        query = text("""
            SELECT
                id,
                course_name,
                credits,
                description,
                status
            FROM Course
            WHERE course_name LIKE :keyword
        """)

        return db.execute(
            query,
            {"keyword": f"%{keyword}%"}
        ).mappings().all()