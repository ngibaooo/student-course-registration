from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.connection import get_db

from app.repositories.admin.admin_student_repository import (
    StudentRepository
)

from app.services.admin.admin_student_service import (
    StudentService
)

from app.schemas.admin.admin_student_schemas import (
    StudentCreate,
    StudentUpdate
)

router = APIRouter(
    prefix="/admin/students",
    tags=["Admin Students"]
)

@router.get("/search")
def search_student(
    keyword: str,
    db: Session = Depends(get_db)
):
    return StudentRepository.search_by_name(
        db,
        keyword
    )

@router.get("")
def get_all_students(
    db: Session = Depends(get_db)
):
    return StudentRepository.get_all_students(db)

@router.get("/{id}")
def get_student(
    id: int,
    db: Session = Depends(get_db)
):

    student = StudentRepository.get_by_id(
        db,
        id
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return student

@router.post("")
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    try:

        return StudentService.create_student(
            db,
            student
        )
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.put("/{id}")
def update_student(
    id: int,
    student: StudentUpdate,
    db: Session = Depends(get_db)
):
    try:
        return StudentService.update_student(
            db,
            id,
            student
        )
    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.patch("/{id}/lock")
def lock_student(
    id: int,
    db: Session = Depends(get_db)
):
    try:
        return StudentService.lock_student(
            db,
            id
        )
    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.patch("/{id}/unlock")
def unlock_student(
    id: int,
    db: Session = Depends(get_db)
):
    try:

        return StudentService.unlock_student(
            db,
            id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )