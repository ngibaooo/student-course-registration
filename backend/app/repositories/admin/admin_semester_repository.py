from sqlalchemy import text


class SemesterRepository:

    @staticmethod
    def get_all(db):

        query = text("""
            SELECT
                id,
                semester_name,
                academic_year,
                start_date,
                end_date,
                registration_open_date,
                registration_close_date,
                cancel_deadline,
                status
            FROM Semester
            ORDER BY id
        """)

        return db.execute(
            query
        ).mappings().all()

    @staticmethod
    def get_by_id(
        db,
        semester_id
    ):

        query = text("""
            SELECT
                id,
                semester_name,
                academic_year,
                start_date,
                end_date,
                registration_open_date,
                registration_close_date,
                cancel_deadline,
                status
            FROM Semester
            WHERE id=:id
        """)

        return db.execute(
            query,
            {"id": semester_id}
        ).mappings().first()

    @staticmethod
    def create(
        db,
        data
    ):

        query = text("""
            INSERT INTO Semester
            (
                semester_name,
                academic_year,
                start_date,
                end_date,
                registration_open_date,
                registration_close_date,
                cancel_deadline,
                status
            )
            VALUES
            (
                :semester_name,
                :academic_year,
                :start_date,
                :end_date,
                :registration_open_date,
                :registration_close_date,
                :cancel_deadline,
                'CLOSED'
            )
        """)

        db.execute(
            query,
            data
        )

    @staticmethod
    def update(
        db,
        semester_id,
        data
    ):

        query = text("""
            UPDATE Semester
            SET
                semester_name = :semester_name,
                academic_year = :academic_year,
                start_date = :start_date,
                end_date = :end_date,
                registration_open_date = :registration_open_date,
                registration_close_date = :registration_close_date,
                cancel_deadline = :cancel_deadline
            WHERE id = :id
        """)

        db.execute(
            query,
            {
                "id": semester_id,
                **data
            }
        )

    @staticmethod
    def open_semester(
        db,
        semester_id
    ):

        query = text("""
            UPDATE Semester
            SET status='OPEN'
            WHERE id=:id
        """)

        db.execute(
            query,
            {"id": semester_id}
        )

    @staticmethod
    def close_semester(
        db,
        semester_id
    ):

        query = text("""
            UPDATE Semester
            SET status='CLOSED'
            WHERE id=:id
        """)

        db.execute(
            query,
            {"id": semester_id}
        )