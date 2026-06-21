from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.repositories.admin.admin_semester_repository import (
    SemesterRepository
)
from app.services.admin.admin_semester_service import (
    SemesterService
)

from app.schemas.admin.admin_semester_schemas import (
    SemesterCreate,
    SemesterUpdate
)

router = APIRouter(
    prefix="/admin/semesters",
    tags=["Admin Semester"]
)


@router.get("")
def get_all_semesters(
    db: Session = Depends(get_db)
):
    return SemesterService.get_all(db)


@router.get("/{id}")
def get_semester_by_id(
    semester_id: int,
    db: Session = Depends(get_db)
):
    try:
        return SemesterService.get_by_id(
            db,
            semester_id
        )

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.post("")
def create_semester(
    semester: SemesterCreate,
    db: Session = Depends(get_db)
):
    try:

        return SemesterService.create(
            db,
            semester
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.put("/{id}")
def update_semester(
    semester_id: int,
    semester: SemesterUpdate,
    db: Session = Depends(get_db)
):
    try:

        return SemesterService.update(
            db,
            semester_id,
            semester
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.patch("/{id}/open")
def open_semester(
    semester_id: int,
    db: Session = Depends(get_db)
):
    try:

        return SemesterService.open_semester(
            db,
            semester_id
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.patch("/{id}/close")
def close_semester(
    semester_id: int,
    db: Session = Depends(get_db)
):
    try:

        return SemesterService.close_semester(
            db,
            semester_id
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )