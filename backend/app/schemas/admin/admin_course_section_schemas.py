from pydantic import BaseModel, Field, model_validator

class CourseSectionCreate(BaseModel):
    classroom: str = Field(..., min_length=1, max_length=100)
    schedule_day: int = Field(..., ge=2, le=8, description="Thứ trong tuần từ 2 đến 8")
    start_period: int = Field(..., gt=0)
    end_period: int = Field(..., gt=0)
    maximum_students: int = Field(..., gt=0)
    semester_id: int
    course_id: int
    lecturer_id: int

    @model_validator(mode='after')
    def check_periods(self):
        if self.start_period > self.end_period:
            raise ValueError("Tiết bắt đầu không thể lớn hơn tiết kết thúc")
        return self

class CourseSectionUpdate(CourseSectionCreate):
    pass