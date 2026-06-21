from pydantic import BaseModel
from typing import Optional

class CourseCreate(BaseModel):
    course_name: str
    credits: int
    description: Optional[str] = None


class CourseUpdate(BaseModel):
    course_name: str
    credits: int
    description: Optional[str] = None


class CourseResponse(BaseModel):
    id: int
    course_name: str
    credits: int
    description: Optional[str]
    status: str