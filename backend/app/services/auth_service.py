import os
import jwt

from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext

from app.schemas.auth_schema import LoginRequest
from app.repositories.auth_repository import get_account_by_username


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "student_course_secret_key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(input_password: str, stored_password: str):
    """
    Nếu mật khẩu trong database đã mã hóa bcrypt thì kiểm tra bcrypt.
    Nếu database đang lưu mật khẩu thường thì so sánh trực tiếp.
    """

    if stored_password.startswith("$2b$") or stored_password.startswith("$2a$"):
        return pwd_context.verify(input_password, stored_password)

    return input_password == stored_password


def create_access_token(data: dict):
    payload = data.copy()

    expire_time = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload.update({"exp": expire_time})

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return token


def login_service(request: LoginRequest):
    account = get_account_by_username(request.username)

    if account is None:
        raise HTTPException(
            status_code=401,
            detail="Sai thông tin đăng nhập hoặc tài khoản không tồn tại"
        )

    if str(account["status"]).upper() != "ACTIVE":
        raise HTTPException(
            status_code=403,
            detail="Tài khoản hiện đang bị khóa! Hãy liên hệ với phòng công tác sinh viên"
        )

    if not verify_password(
        request.password,
        account["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Sai thông tin đăng nhập hoặc tài khoản không tồn tại"
        )

    token_data = {
        "user_id": account["id"],
        "username": account["email"],
        "role": account["role"]
    }

    access_token = create_access_token(token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": account["id"],
        "username": account["email"],
        "role": account["role"],
        "full_name": account["full_name"]
    }


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token đã hết hạn"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token không hợp lệ"
        )


def require_student(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "STUDENT":
        raise HTTPException(
            status_code=403,
            detail="Bạn không có quyền truy cập chức năng sinh viên"
        )

    return current_user


def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Bạn không có quyền truy cập chức năng admin"
        )

    return current_user