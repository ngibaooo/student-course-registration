from fastapi import APIRouter, Depends

from app.schemas.auth_schema import LoginRequest
from app.services.auth_service import login_service, get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(request: LoginRequest):
    return {
        "message": "Đăng nhập thành công",
        "data": login_service(request)
    }


@router.post("/logout")
def logout():
    return {
        "message": "Đăng xuất thành công"
    }


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Lấy thông tin tài khoản thành công",
        "data": current_user
    }