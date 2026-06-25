from fastapi import HTTPException

from app.repositories.student_repository import (
    get_student_profile,
    get_open_courses,
    get_course_detail,
    search_courses,
    get_registered_courses,
    get_student_schedule,
    get_semesters,
    get_open_courses_by_semester,
    get_registered_courses_by_semester
)


def get_profile_service(user_id: int):
    if user_id is None:
        raise HTTPException(
            status_code=400,
            detail="Token không có user_id"
        )

    student = get_student_profile(user_id)

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy thông tin sinh viên"
        )

    return student


def get_open_courses_service():
    return get_open_courses()


def get_course_detail_service(section_id: int):
    course = get_course_detail(section_id)

    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy lớp học phần"
        )

    return course


def search_courses_service(keyword: str):
    if keyword is None or keyword.strip() == "":
        return get_open_courses()

    return search_courses(keyword.strip())


def get_registered_courses_service(user_id: int):
    return get_registered_courses(user_id)


def get_student_schedule_service(user_id: int):
    return get_student_schedule(user_id)

def get_semesters_service():
    return get_semesters()

def get_open_courses_by_semester_service(
    semester_id: int
):
    return get_open_courses_by_semester(
        semester_id
    )

def get_registered_courses_by_semester_service(
    user_id: int,
    semester_id: int
):
    return get_registered_courses_by_semester(
        user_id,
        semester_id
    )