from app.database.connection import get_connection


def row_to_dict(cursor, row):
    if row is None:
        return None

    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, row))


def get_account_by_username(username: str):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
            SELECT
                id,
                full_name,
                email,
                password,
                role,
                status
            FROM [User]
            WHERE email = ?
        """

        cursor.execute(query, username)
        row = cursor.fetchone()

        return row_to_dict(cursor, row)

    finally:
        conn.close()