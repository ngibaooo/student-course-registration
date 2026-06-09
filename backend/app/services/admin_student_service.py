from passlib.context import CryptContext

from app.repositories.admin_student_repository import (
    StudentRepository
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class StudentService:

    @staticmethod
    def create_student(db, student):
        try:
            
            hashed_password = pwd_context.hash(
                student.password
            )

            user_id = StudentRepository.create_user(
                db,
                {
                    "full_name": student.full_name,
                    "email": student.email,
                    "password": hashed_password
                }
            )

            StudentRepository.create_student(
                db,
                {
                    "date_of_birth": student.date_of_birth,
                    "gender": student.gender,
                    "phone": student.phone,
                    "address": student.address,
                    "department_id": student.department_id,
                    "user_id": user_id
                }
            )

            db.commit()

            return {
                "message": "Student created successfully"
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