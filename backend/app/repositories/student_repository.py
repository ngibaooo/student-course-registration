from sqlalchemy import text
from app.database.connection import SessionLocal


def row_to_dict(row):
    if row is None:
        return None

    return dict(row._mapping)


def rows_to_list(rows):
    return [dict(row._mapping) for row in rows]

def get_student_id_by_user_id(user_id: int):

    db = SessionLocal()

    try:

        query = text("""
        SELECT id
        FROM Student
        WHERE user_id = :user_id
        """)

        result = db.execute(
            query,
            {"user_id": user_id}
        )

        row = result.fetchone()

        if row is None:
            return None

        return row.id

    finally:
        db.close()
        
def get_student_profile(user_id: int):
    db = SessionLocal()

    try:
        query = text("""
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
        WHERE u.id = :user_id
        """)

        result = db.execute(query, {"user_id": user_id})

        return row_to_dict(result.fetchone())

    finally:
        db.close()


def get_open_courses():
    db = SessionLocal()

    try:
        query = text("""
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
        """)

        result = db.execute(query)

        return rows_to_list(result.fetchall())

    finally:
        db.close()


def get_course_detail(section_id: int):
    db = SessionLocal()

    try:
        query = text("""
        SELECT
            cs.*,
            c.course_name,
            c.credits,
            c.description,
            l.full_name AS lecturer_name
        FROM CourseSection cs
        JOIN Course c ON cs.course_id = c.id
        LEFT JOIN Lecturer l ON cs.lecturer_id = l.id
        WHERE cs.id = :section_id
        """)

        result = db.execute(
            query,
            {"section_id": section_id}
        )

        return row_to_dict(result.fetchone())

    finally:
        db.close()


# def search_courses(keyword: str):
#     db = SessionLocal()

#     try:
#         query = text("""
#         SELECT
#             cs.id,
#             c.course_name,
#             c.credits,
#             cs.classroom,
#             cs.schedule_day,
#             cs.start_period,
#             cs.end_period
#         FROM CourseSection cs
#         JOIN Course c ON cs.course_id = c.id
#         WHERE c.course_name LIKE :keyword
#         """)

#         result = db.execute(
#             query,
#             {"keyword": f"%{keyword}%"}
#         )

#         return rows_to_list(result.fetchall())

#     finally:
#         db.close()
def search_courses(keyword: str):
    db = SessionLocal()

    try:
        query = text("""
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
        JOIN Course c
            ON cs.course_id = c.id
        LEFT JOIN Lecturer l
            ON cs.lecturer_id = l.id
        WHERE
            cs.status = 'ACTIVE'
            AND c.course_name LIKE :keyword
        """)

        result = db.execute(
            query,
            {"keyword": f"%{keyword}%"}
        )

        return rows_to_list(result.fetchall())

    finally:
        db.close()


def get_registered_courses(user_id: int):
    db = SessionLocal()

    try:
        query = text("""
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
        WHERE s.user_id = :user_id
        AND cr.status = 'REGISTERED'
        """)

        result = db.execute(
            query,
            {"user_id": user_id}
        )

        return rows_to_list(result.fetchall())

    finally:
        db.close()


def get_student_schedule(user_id: int):
    db = SessionLocal()

    try:
        query = text("""
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
        WHERE s.user_id = :user_id
        AND cr.status = 'REGISTERED'
        ORDER BY cs.schedule_day, cs.start_period
        """)

        result = db.execute(
            query,
            {"user_id": user_id}
        )

        return rows_to_list(result.fetchall())

    finally:
        db.close()