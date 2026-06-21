from pydantic import BaseModel
from datetime import date, datetime


class SemesterCreate(BaseModel):
    semester_name: str
    academic_year: str

    start_date: date
    end_date: date

    registration_open_date: datetime
    registration_close_date: datetime

    cancel_deadline: datetime


class SemesterUpdate(BaseModel):
    semester_name: str
    academic_year: str

    start_date: date
    end_date: date

    registration_open_date: datetime
    registration_close_date: datetime

    cancel_deadline: datetime


class SemesterResponse(BaseModel):
    id: int
    semester_name: str
    academic_year: str

    start_date: date
    end_date: date

    registration_open_date: datetime
    registration_close_date: datetime

    cancel_deadline: datetime

    status: str