from app.database.connection import get_connection


def rows_to_list(cursor, rows):
    columns = [column[0] for column in cursor.description]
    return [dict(zip(columns, row)) for row in rows]


def row_to_dict(cursor, row):
    if row is None:
        return None

    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, row))


def get_student_profile(ma_sv: str):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
            SELECT 
                MaSV,
                HoTen,
                NgaySinh,
                GioiTinh,
                Email,
                SoDienThoai,
                Lop,
                Khoa,
                TrangThai
            FROM SinhVien
            WHERE MaSV = ?
        """

        cursor.execute(query, ma_sv)
        row = cursor.fetchone()

        return row_to_dict(cursor, row)

    finally:
        conn.close()


def get_open_courses():
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
            SELECT 
                LHP.MaLHP,
                MH.MaMon,
                MH.TenMon,
                MH.SoTinChi,
                LHP.HocKy,
                LHP.NamHoc,
                LHP.GiangVien,
                LHP.PhongHoc,
                LHP.Thu,
                LHP.TietBatDau,
                LHP.TietKetThuc,
                LHP.SiSoToiDa,
                LHP.SiSoDaDangKy,
                LHP.TrangThai,
                (LHP.SiSoToiDa - LHP.SiSoDaDangKy) AS SoChoConLai
            FROM LopHocPhan LHP
            JOIN MonHoc MH ON LHP.MaMon = MH.MaMon
            WHERE LHP.TrangThai = N'Đang mở'
            ORDER BY MH.TenMon
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        return rows_to_list(cursor, rows)

    finally:
        conn.close()


def get_course_detail(ma_lhp: str):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
            SELECT 
                LHP.MaLHP,
                MH.MaMon,
                MH.TenMon,
                MH.SoTinChi,
                MH.SoTietLyThuyet,
                MH.SoTietThucHanh,
                LHP.HocKy,
                LHP.NamHoc,
                LHP.GiangVien,
                LHP.PhongHoc,
                LHP.Thu,
                LHP.TietBatDau,
                LHP.TietKetThuc,
                LHP.SiSoToiDa,
                LHP.SiSoDaDangKy,
                LHP.TrangThai,
                (LHP.SiSoToiDa - LHP.SiSoDaDangKy) AS SoChoConLai
            FROM LopHocPhan LHP
            JOIN MonHoc MH ON LHP.MaMon = MH.MaMon
            WHERE LHP.MaLHP = ?
        """

        cursor.execute(query, ma_lhp)
        row = cursor.fetchone()

        return row_to_dict(cursor, row)

    finally:
        conn.close()


def search_courses(keyword: str):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        search_value = f"%{keyword}%"

        query = """
            SELECT 
                LHP.MaLHP,
                MH.MaMon,
                MH.TenMon,
                MH.SoTinChi,
                LHP.HocKy,
                LHP.NamHoc,
                LHP.GiangVien,
                LHP.PhongHoc,
                LHP.Thu,
                LHP.TietBatDau,
                LHP.TietKetThuc,
                LHP.SiSoToiDa,
                LHP.SiSoDaDangKy,
                LHP.TrangThai,
                (LHP.SiSoToiDa - LHP.SiSoDaDangKy) AS SoChoConLai
            FROM LopHocPhan LHP
            JOIN MonHoc MH ON LHP.MaMon = MH.MaMon
            WHERE LHP.TrangThai = N'Đang mở'
              AND (
                    MH.MaMon LIKE ?
                 OR MH.TenMon LIKE ?
                 OR LHP.GiangVien LIKE ?
              )
            ORDER BY MH.TenMon
        """

        cursor.execute(query, search_value, search_value, search_value)
        rows = cursor.fetchall()

        return rows_to_list(cursor, rows)

    finally:
        conn.close()


def get_registered_courses(ma_sv: str):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
            SELECT 
                DK.MaDK,
                DK.NgayDangKy,
                DK.TrangThai AS TrangThaiDangKy,
                LHP.MaLHP,
                MH.MaMon,
                MH.TenMon,
                MH.SoTinChi,
                LHP.HocKy,
                LHP.NamHoc,
                LHP.GiangVien,
                LHP.PhongHoc,
                LHP.Thu,
                LHP.TietBatDau,
                LHP.TietKetThuc
            FROM DangKyHocPhan DK
            JOIN LopHocPhan LHP ON DK.MaLHP = LHP.MaLHP
            JOIN MonHoc MH ON LHP.MaMon = MH.MaMon
            WHERE DK.MaSV = ?
              AND DK.TrangThai <> N'Đã hủy'
            ORDER BY LHP.Thu, LHP.TietBatDau
        """

        cursor.execute(query, ma_sv)
        rows = cursor.fetchall()

        return rows_to_list(cursor, rows)

    finally:
        conn.close()


def get_student_schedule(ma_sv: str):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
            SELECT 
                LHP.Thu,
                LHP.TietBatDau,
                LHP.TietKetThuc,
                LHP.PhongHoc,
                MH.TenMon,
                MH.SoTinChi,
                LHP.GiangVien
            FROM DangKyHocPhan DK
            JOIN LopHocPhan LHP ON DK.MaLHP = LHP.MaLHP
            JOIN MonHoc MH ON LHP.MaMon = MH.MaMon
            WHERE DK.MaSV = ?
              AND DK.TrangThai <> N'Đã hủy'
            ORDER BY LHP.Thu, LHP.TietBatDau
        """

        cursor.execute(query, ma_sv)
        rows = cursor.fetchall()

        return rows_to_list(cursor, rows)

    finally:
        conn.close()