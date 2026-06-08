from fastapi import HTTPException

from app.repositories.student_repository import (
    get_student_profile,
    get_open_courses,
    get_course_detail,
    search_courses,
    get_registered_courses,
    get_student_schedule
)


def get_profile_service(ma_sv: str):
    if ma_sv is None:
        raise HTTPException(
            status_code=400,
            detail="Token không có mã sinh viên"
        )

    student = get_student_profile(ma_sv)

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy thông tin sinh viên"
        )

    return student


def get_open_courses_service():
    return get_open_courses()


def get_course_detail_service(ma_lhp: str):
    course = get_course_detail(ma_lhp)

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


def get_registered_courses_service(ma_sv: str):
    return get_registered_courses(ma_sv)


def get_student_schedule_service(ma_sv: str):
    return get_student_schedule(ma_sv)