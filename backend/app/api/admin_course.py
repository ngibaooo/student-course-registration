from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db

from app.repositories.admin_course_repository import (
    CourseRepository
)

from app.services.admin_course_service import (
    CourseService
)

from app.schemas.admin_course_schemas import (
    CourseCreate,
    CourseUpdate
)

router = APIRouter(
    prefix="/admin/courses",
    tags=["Admin Course"]
)


@router.get("")
def get_all_courses(
    db: Session = Depends(get_db)
):
    return CourseService.get_all(db)


@router.get("/{id}")
def get_course_by_id(
    course_id: int,
    db: Session = Depends(get_db)
):
    try:
        return CourseService.get_by_id(
            db,
            course_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post("")
def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db)
):
    try:
        return CourseService.create(
            db,
            course
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.put("/{id}")
def update_course(
    course_id: int,
    course: CourseUpdate,
    db: Session = Depends(get_db)
):
    try:
        return CourseService.update(
            db,
            course_id,
            course
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.patch("/{id}/disable")
def disable_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    try:
        return CourseService.disable(
            db,
            course_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("/search/")
def search_course(
    keyword: str,
    db: Session = Depends(get_db)
):
    return CourseService.search(
        db,
        keyword
    )