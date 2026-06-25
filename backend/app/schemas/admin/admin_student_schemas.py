from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional

class StudentCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, pattern="^(MALE|FEMALE|OTHER)$")
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=255)
    enrollment_year: int = Field(..., gt=1900)
    department_id: int

class StudentUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, pattern="^(MALE|FEMALE|OTHER)$")
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=255)
    department_id: Optional[int] = None