from passlib.context import CryptContext

from app.repositories.admin.admin_student_repository import (
    StudentRepository
)
from app.services.auth_service import hash_password

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class StudentService:

    @staticmethod
    def create_student(db, student):
        try:
            
            hashed_pwd = hash_password(student.password)

            new_student_id = StudentRepository.create_student(
                db=db, 
                data=student, 
                hashed_password=hashed_pwd
            )

            db.commit()

            return {
                "message": "Student created successfully",
                "student_id": new_student_id
            }
        except Exception as e:
            db.rollback()
            raise Exception(
                f"Create student failed: {str(e)}"
            )

    @staticmethod
    def update_student(
        db,
        student_id,
        student
    ):
        try:
            existed=StudentRepository.get_by_id(
                db,
                student_id
            )

            if not existed:
                raise ValueError(
                    "Student not found"
                )
            
            StudentRepository.update_user(
                db,
                student_id,
                student
            )

            StudentRepository.update_student(
                db,
                student_id,
                student
            )

            db.commit()

            return {
                "message": "Student updated successfully"
            }
        except Exception as e:
            db.rollback()
            raise e

    @staticmethod
    def lock_student(
        db,
        student_id
    ):
        try:
            existed = StudentRepository.get_by_id(
                db,
                student_id
            )
            if not existed:
                raise ValueError(
                    "Student not found"
                )

            StudentRepository.lock_student(
                db,
                student_id
            )

            db.commit()

            return {
                "message": "Student locked successfully"
            }
        except Exception as e:

            db.rollback()
            raise e

    @staticmethod
    def unlock_student(
        db,
        student_id
    ):
        try:

            existed = StudentRepository.get_by_id(
                db,
                student_id
            )
            if not existed:
                raise ValueError(
                    "Student not found"
                )
            
            StudentRepository.unlock_student(
                db,
                student_id
            )

            db.commit()

            return {
                "message": "Student unlocked successfully"
            }
        except Exception as e:

            db.rollback()
            raise e