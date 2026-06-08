from fastapi import APIRouter, Depends, Query

from app.services.auth_service import require_student
from app.services.student_service import (
    get_profile_service,
    get_open_courses_service,
    get_course_detail_service,
    search_courses_service,
    get_registered_courses_service,
    get_student_schedule_service
)


router = APIRouter(
    prefix="/api/student",
    tags=["Student Module"]
)


@router.get("/profile")
def get_profile(current_user: dict = Depends(require_student)):
    ma_sv = current_user.get("student_id")

    return {
        "message": "Lấy thông tin cá nhân thành công",
        "data": get_profile_service(ma_sv)
    }


@router.get("/open-courses")
def get_open_courses_api(current_user: dict = Depends(require_student)):
    return {
        "message": "Lấy danh sách học phần mở thành công",
        "data": get_open_courses_service()
    }


@router.get("/open-courses/{ma_lhp}")
def get_course_detail_api(
    ma_lhp: str,
    current_user: dict = Depends(require_student)
):
    return {
        "message": "Lấy chi tiết lớp học phần thành công",
        "data": get_course_detail_service(ma_lhp)
    }


@router.get("/search-courses")
def search_courses_api(
    keyword: str = Query(default=""),
    current_user: dict = Depends(require_student)
):
    return {
        "message": "Tìm kiếm học phần thành công",
        "data": search_courses_service(keyword)
    }


@router.get("/registered-courses")
def get_registered_courses_api(
    current_user: dict = Depends(require_student)
):
    ma_sv = current_user.get("student_id")

    return {
        "message": "Lấy danh sách học phần đã đăng ký thành công",
        "data": get_registered_courses_service(ma_sv)
    }


@router.get("/schedule")
def get_schedule_api(
    current_user: dict = Depends(require_student)
):
    ma_sv = current_user.get("student_id")

    return {
        "message": "Lấy lịch học cá nhân thành công",
        "data": get_student_schedule_service(ma_sv)
    }