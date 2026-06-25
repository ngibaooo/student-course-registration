-- 3. PROCEDURE: Tạo mới Student và User cùng lúc (Dùng Transaction để đảm bảo toàn vẹn dữ liệu)
CREATE PROCEDURE sp_CreateStudent
    @full_name NVARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @date_of_birth DATE,
    @gender VARCHAR(10),
    @phone VARCHAR(20),
    @address NVARCHAR(255),
    @enrollment_year INT,
    @department_id INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DECLARE @user_id INT;

        INSERT INTO [User] (full_name, email, password, role, status)
        VALUES (@full_name, @email, @password, 'STUDENT', 'ACTIVE');
        SET @user_id = SCOPE_IDENTITY();

        INSERT INTO Student (date_of_birth, gender, phone, address, enrollment_year, department_id, user_id)
        VALUES (@date_of_birth, @gender, @phone, @address, @enrollment_year, @department_id, @user_id);
        
        -- Trả về ID của student vừa tạo
        SELECT SCOPE_IDENTITY() AS new_student_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO