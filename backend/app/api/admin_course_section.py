from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.repositories.admin_course_section_repository import (
    CourseSectionRepository
)
from app.services.admin_course_section_service import (
    CourseSectionService
)

from app.schemas.admin_course_section_schemas import (
    CourseSectionCreate,
    CourseSectionUpdate
)

router = APIRouter(
    prefix="/admin/course-sections",
    tags=["Admin Course Sections"]
)


@router.get("")
def get_all_sections(
    db: Session = Depends(get_db)
):
    return CourseSectionService.get_all(db)


@router.get("/search")
def search_section(
    keyword: str,
    db: Session = Depends(get_db)
):
    return CourseSectionService.search(
        db,
        keyword
    )


@router.get("/{id}")
def get_section_by_id(
    section_id: int,
    db: Session = Depends(get_db)
):
    return CourseSectionService.get_by_id(
        db,
        section_id
    )


@router.post("")
def create_section(
    section: CourseSectionCreate,
    db: Session = Depends(get_db)
):
    return CourseSectionService.create(
        db,
        section
    )


@router.put("/{id}")
def update_section(
    section_id: int,
    section: CourseSectionUpdate,
    db: Session = Depends(get_db)
):
    return CourseSectionService.update(
        db,
        section_id,
        section
    )


@router.patch("/{id}/disable")
def disable_section(
    section_id: int,
    db: Session = Depends(get_db)
):
    return CourseSectionService.disable(
        db,
        section_id
    )