from app.repositories.admin.admin_course_repository import CourseRepository


class CourseService:

    @staticmethod
    def get_all(db):
        return CourseRepository.get_all(db)

    @staticmethod
    def get_by_id(db, course_id):

        course = CourseRepository.get_by_id(
            db,
            course_id
        )

        if not course:
            raise Exception("Course not found")

        return course

    @staticmethod
    def create(db, course_data):

        try:

            CourseRepository.create(
                db,
                course_data.model_dump()
            )

            db.commit()

            return {
                "message": "Course created successfully"
            }

        except Exception as e:

            db.rollback()

            raise e

    @staticmethod
    def update(
        db,
        course_id,
        course_data
    ):

        try:

            course = CourseRepository.get_by_id(
                db,
                course_id
            )

            if not course:
                raise Exception(
                    "Course not found"
                )

            CourseRepository.update(
                db,
                course_id,
                course_data.model_dump()
            )

            db.commit()

            return {
                "message": "Course updated successfully"
            }

        except Exception as e:

            db.rollback()

            raise e

    @staticmethod
    def disable(
        db,
        course_id
    ):

        try:

            course = CourseRepository.get_by_id(
                db,
                course_id
            )

            if not course:
                raise Exception(
                    "Course not found"
                )

            CourseRepository.disable(
                db,
                course_id
            )
            CourseRepository.disable_course_sections(
                db,
                course_id
            )

            db.commit()

            return {
                "message":
                "Course disabled successfully"
            }

        except Exception as e:

            db.rollback()
            raise e
        
    @staticmethod
    def enable(
        db,
        course_id
    ):

        try:

            course = CourseRepository.get_by_id(
                db,
                course_id
            )

            if not course:
                raise Exception(
                    "Course not found"
                )

            CourseRepository.enable(
                db,
                course_id
            )
            CourseRepository.enable_course_sections(
                db,
                course_id
            )

            db.commit()

            return {
                "message":
                "Course enable successfully"
            }

        except Exception as e:

            db.rollback()
            raise e

    @staticmethod
    def search(
        db,
        keyword
    ):
        return CourseRepository.search(
            db,
            keyword
        )