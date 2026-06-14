from pydantic import BaseModel


class CourseSectionCreate(BaseModel):
    classroom: str
    schedule_day: int
    start_period: int
    end_period: int
    maximum_students: int

    semester_id: int
    course_id: int
    lecturer_id: int


class CourseSectionUpdate(BaseModel):
    classroom: str
    schedule_day: int
    start_period: int
    end_period: int
    maximum_students: int

    semester_id: int
    course_id: int
    lecturer_id: int