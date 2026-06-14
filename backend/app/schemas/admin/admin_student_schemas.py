from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional


class StudentCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    department_id: int


class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    department_id: Optional[int] = None


class StudentResponse(BaseModel):
    id: int
    full_name: str
    email: str
    status: str

    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    department_id: int