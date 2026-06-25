from pydantic import BaseModel, Field, model_validator
from datetime import date, datetime

class SemesterCreate(BaseModel):
    semester_name: str = Field(..., max_length=100)
    academic_year: str = Field(..., max_length=20)
    start_date: date
    end_date: date
    registration_open_date: datetime
    registration_close_date: datetime
    cancel_deadline: datetime

    @model_validator(mode='after')
    def validate_dates(self):
        if self.start_date >= self.end_date:
            raise ValueError("Ngày bắt đầu phải trước ngày kết thúc")
        if self.registration_open_date >= self.registration_close_date:
            raise ValueError("Thời gian mở đăng ký phải trước thời gian đóng")
        if self.cancel_deadline.date() > self.end_date:
            raise ValueError("Hạn hủy đăng ký không được vượt quá ngày kết thúc học kỳ")
        return self

class SemesterUpdate(SemesterCreate):
    pass