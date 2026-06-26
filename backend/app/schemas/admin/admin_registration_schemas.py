from pydantic import BaseModel
class TransferCourseSectionRequest(BaseModel):
    student_id: int
    from_section_id: int
    to_section_id: int