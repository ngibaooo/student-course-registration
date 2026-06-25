from sqlalchemy import text


class StudentRepository:

    @staticmethod
    def get_all_students(db):
        query=text("""
            select 
                a.id,
                b.full_name,
                b.email,
                b.status,
                a.date_of_birth,
                a.gender,
                a.phone,
                a.address,
                a.enrollment_year,
                a.department_id
            from Student a
            join [user] b on a.user_id =b.id
            where b.role='STUDENT'
        """)
        return db.execute(query).mappings().all()
    
    @staticmethod
    def get_by_id(db,student_id):
        query=text("""
            select 
                a.id,
                b.full_name,
                b.email,
                b.status,
                a.date_of_birth,
                a.gender,
                a.phone,
                a.address,
                a.department_id
            from Student a
            join [user] b on a.user_id =b.id
            where a.id=:student_id
        """)
        return db.execute(
            query,
            {"student_id": student_id}
        ).mappings().first()
    
    @staticmethod
    def search_by_name(db,keyword):
        query=text("""
            select 
                a.id,
                b.full_name,
                b.email,
                b.status,
                a.date_of_birth,
                a.gender,
                a.phone,
                a.address,
                a.department_id
            from Student a
            join [user] b on a.user_id =b.id
            where b.full_name LIKE :keyword
        """)
        return db.execute(
            query,
            {"keyword": f"%{keyword}%"}
        ).mappings().all()
        
    @staticmethod
    def create_student(db, data, hashed_password):
        query = text("""
            EXEC sp_CreateStudent 
                @full_name = :full_name, 
                @email = :email, 
                @password = :password,
                @date_of_birth = :date_of_birth, 
                @gender = :gender, 
                @phone = :phone, 
                @address = :address, 
                @enrollment_year = :enrollment_year,
                @department_id = :department_id
        """)
        return db.execute(
            query,
            {
                "full_name": data.full_name,
                "email": data.email,
                "password": hashed_password,
                "date_of_birth": data.date_of_birth,
                "gender": data.gender,
                "phone": data.phone,
                "address": data.address,
                "enrollment_year": data.enrollment_year,
                "department_id": data.department_id
            }
        ).scalar()
    
    @staticmethod
    def update_user(db, student_id, data):
        query = text("""
            UPDATE u
            SET
                full_name = COALESCE(:full_name, u.full_name),
                email = COALESCE(:email, u.email)
            FROM [User] u
            JOIN Student s
                ON s.user_id = u.id
            WHERE s.id = :student_id
        """)
        db.execute(
            query,
            {
                "full_name": data.full_name,
                "email": data.email,
                "student_id": student_id
            }
        )

    @staticmethod
    def update_student(db, student_id, data):

        query = text("""
            UPDATE Student
            SET
                date_of_birth = COALESCE(:date_of_birth,date_of_birth),
                gender = COALESCE(:gender,gender),
                phone = COALESCE(:phone,phone),
                address = COALESCE(:address,address),
                department_id = COALESCE(:department_id,department_id)
            WHERE id = :student_id
        """)

        db.execute(
            query,
            {
                "date_of_birth": data.date_of_birth,
                "gender": data.gender,
                "phone": data.phone,
                "address": data.address,
                "department_id": data.department_id,
                "student_id": student_id
            }
        )

    @staticmethod
    def lock_student(db, student_id):

        query = text("""
            UPDATE [User]
            SET status = 'LOCKED'
            WHERE id =
            (
                SELECT user_id
                FROM Student
                WHERE id = :student_id
            )
        """)

        db.execute(
            query,
            {"student_id": student_id}
        )

    @staticmethod
    def unlock_student(db, student_id):

        query = text("""
            UPDATE [User]
            SET status = 'ACTIVE'
            WHERE id =
            (
                SELECT user_id
                FROM Student
                WHERE id = :student_id
            )
        """)

        db.execute(
            query,
            {"student_id": student_id}
        )
