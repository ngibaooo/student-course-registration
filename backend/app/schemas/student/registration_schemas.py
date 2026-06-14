from pydantic import BaseModel

class RegisterCourseSectionRequest(BaseModel):
    section_id: int


class CancelCourseSectionRequest(BaseModel):
    section_id: int