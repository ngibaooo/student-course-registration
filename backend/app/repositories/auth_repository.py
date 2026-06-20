from sqlalchemy import text

from app.database.connection import SessionLocal


def row_to_dict(row):
    if row is None:
        return None

    return dict(row._mapping)


def get_account_by_username(username: str):
    db = SessionLocal()

    try:
        query = text("""
            SELECT
                id,
                full_name,
                email,
                password,
                role,
                status
            FROM [User]
            WHERE email = :email
        """)

        result = db.execute(
            query,
            {"email": username}
        )

        row = result.fetchone()

        return row_to_dict(row)

    finally:
        db.close()