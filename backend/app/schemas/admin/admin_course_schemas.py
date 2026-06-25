from pydantic import BaseModel, Field
from typing import Optional

class CourseCreate(BaseModel):
    course_name: str = Field(..., min_length=2, max_length=100)
    credits: int = Field(..., gt=0, le=10, description="Tín chỉ phải lớn hơn 0")
    description: Optional[str] = Field(None, max_length=500)

class CourseUpdate(BaseModel):
    course_name: str = Field(..., min_length=2, max_length=100)
    credits: int = Field(..., gt=0, le=10)
    description: Optional[str] = Field(None, max_length=500)

class CourseResponse(BaseModel):
    id: int
    course_name: str
    credits: int
    description: Optional[str]
    status: str