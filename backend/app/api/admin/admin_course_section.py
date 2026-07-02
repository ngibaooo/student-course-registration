from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.repositories.admin.admin_course_section_repository import (
    CourseSectionRepository
)
from app.services.admin.admin_course_section_service import (
    CourseSectionService
)

from app.schemas.admin.admin_course_section_schemas import (
    CourseSectionCreate,
    CourseSectionUpdate
)
from app.services.auth_service import require_admin

router = APIRouter(
    prefix="/admin/course-sections",
    tags=["Admin Course Sections"],
    dependencies=[Depends(require_admin)]
)

demo_router = APIRouter(
    tags=["Demo Non-repeatable Read"]
)

@router.get("/search")
def search_section(
    keyword: str,
    db: Session = Depends(get_db)
):
    if keyword.isdigit():
        try:
            courseSection=CourseSectionService.get_by_id(db,int(keyword))
            if courseSection:
                return [courseSection]
            return []
        except Exception:
            return []
    
    return CourseSectionService.search(
        db,
        keyword
    )

@router.get("")
def get_all_sections(
    db: Session = Depends(get_db)
):
    return CourseSectionService.get_all(db)

@router.get("/dropdown/course")
def get_course_dropdown(
    db: Session = Depends(get_db)
):
    return CourseSectionService.get_course_dropdown(db)



@router.get("/dropdown/lecturer")
def get_lecturer_dropdown(
    db: Session = Depends(get_db)
):
    return CourseSectionService.get_lecturer_dropdown(db)



@router.get("/dropdown/semester")
def get_semester_dropdown(
    db: Session = Depends(get_db)
):
    return CourseSectionService.get_semester_dropdown(db)

@router.get("/{section_id}")
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


@router.put("/{section_id}")
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


@router.patch("/{section_id}/disable")
def disable_section(
    section_id: int,
    db: Session = Depends(get_db)
):
    return CourseSectionService.disable(
        db,
        section_id
    )

@router.patch("/{section_id}/enable")
def enable_section(
    section_id: int,
    db: Session = Depends(get_db)
):
    return CourseSectionService.enable(
        db,
        section_id
    )
@router.get("/{course_id}/courses")
def get_course_sections_by_course(
    course_id: int,
    db: Session = Depends(get_db)
):

    try:

        return CourseSectionService.get_course_sections_by_course(
            db,
            course_id
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/{section_id}/students")
def get_students_by_section(
    section_id: int,
    db: Session = Depends(get_db)
):

    try:

        return CourseSectionService.get_students_by_section(
            db,
            section_id
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
#DEMO LOI
@demo_router.get("/demo/non-repeatable-read/admin/{section_id}")
def demo_admin_read(
    section_id: int,
    db: Session = Depends(get_db)
):
    try:
        return CourseSectionService.demo_admin_read(db, section_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@demo_router.post("/demo/non-repeatable-read/student/{section_id}")
def demo_student_update(
    section_id: int,
    add_count: int = 3,
    db: Session = Depends(get_db)
):
    try:
        return CourseSectionService.demo_student_update(db, section_id, add_count)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

