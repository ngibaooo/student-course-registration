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
                TK.TenDangNhap,
                TK.MatKhau,
                TK.VaiTro,
                TK.TrangThai,
                TK.MaSV,
                SV.HoTen
            FROM TaiKhoan TK
            LEFT JOIN SinhVien SV ON TK.MaSV = SV.MaSV
            WHERE TK.TenDangNhap = ?
        """

        cursor.execute(query, username)
        row = cursor.fetchone()

        return row_to_dict(cursor, row)

    finally:
        conn.close()