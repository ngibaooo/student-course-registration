from app.database.connection import get_connection


def rows_to_list(cursor, rows):
    columns = [column[0] for column in cursor.description]
    return [dict(zip(columns, row)) for row in rows]


def row_to_dict(cursor, row):
    if row is None:
        return None

    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, row))


def get_student_profile(user_id: int):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
        SELECT
            s.id,
            u.full_name,
            u.email,
            s.date_of_birth,
            s.gender,
            s.phone,
            s.address,
            d.department_name
        FROM Student s
        JOIN [User] u ON s.user_id = u.id
        LEFT JOIN Department d ON s.department_id = d.id
        WHERE u.id = ?
        """

        cursor.execute(query, user_id)
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
            cs.id,
            c.course_name,
            c.credits,
            l.full_name AS lecturer_name,
            cs.classroom,
            cs.schedule_day,
            cs.start_period,
            cs.end_period,
            cs.maximum_students,
            cs.registered_students,
            (cs.maximum_students - cs.registered_students) AS available_slots
        FROM CourseSection cs
        JOIN Course c ON cs.course_id = c.id
        LEFT JOIN Lecturer l ON cs.lecturer_id = l.id
        WHERE cs.status = 'ACTIVE'
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        return rows_to_list(cursor, rows)

    finally:
        conn.close()


def get_course_detail(section_id: int):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
        SELECT
            cs.*,
            c.course_name,
            c.credits,
            c.description,
            l.full_name AS lecturer_name
        FROM CourseSection cs
        JOIN Course c ON cs.course_id = c.id
        LEFT JOIN Lecturer l ON cs.lecturer_id = l.id
        WHERE cs.id = ?
        """

        cursor.execute(query, section_id)
        row = cursor.fetchone()

        return row_to_dict(cursor, row)

    finally:
        conn.close()


def search_courses(keyword: str):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        keyword = f"%{keyword}%"

        query = """
        SELECT
            cs.id,
            c.course_name,
            c.credits,
            cs.classroom,
            cs.schedule_day,
            cs.start_period,
            cs.end_period
        FROM CourseSection cs
        JOIN Course c ON cs.course_id = c.id
        WHERE c.course_name LIKE ?
        """

        cursor.execute(query, keyword)
        rows = cursor.fetchall()

        return rows_to_list(cursor, rows)

    finally:
        conn.close()


def get_registered_courses(user_id: int):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
         SELECT
            cr.student_id,
            cr.section_id,
            c.course_name,
            c.credits,
            cr.registration_date,
            cr.status
        FROM CourseRegistration cr
        JOIN Student s ON cr.student_id = s.id
        JOIN CourseSection cs ON cr.section_id = cs.id
        JOIN Course c ON cs.course_id = c.id
        WHERE s.user_id = ?
        """

        cursor.execute(query, user_id)
        rows = cursor.fetchall()

        return rows_to_list(cursor, rows)

    finally:
        conn.close()


def get_student_schedule(user_id: int):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        query = """
        SELECT
            c.course_name,
            cs.schedule_day,
            cs.start_period,
            cs.end_period,
            cs.classroom
        FROM CourseRegistration cr
        JOIN Student s ON cr.student_id = s.id
        JOIN CourseSection cs ON cr.section_id = cs.id
        JOIN Course c ON cs.course_id = c.id
        WHERE s.user_id = ?
        ORDER BY cs.schedule_day, cs.start_period
        """

        cursor.execute(query, user_id)
        rows = cursor.fetchall()

        return rows_to_list(cursor, rows)

    finally:
        conn.close()