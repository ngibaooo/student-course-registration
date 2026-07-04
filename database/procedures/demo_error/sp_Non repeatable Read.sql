
-- =================================================================
-- TRANSACTION A: Giao dịch của Admin (Mô phỏng Non-repeatable Read)
-- =================================================================
CREATE PROCEDURE sp_demo_non_repeatable_read_admin
    @section_id INT
AS
BEGIN
    -- Mức cô lập READ COMMITTED (mặc định) cho phép xảy ra Non-repeatable Read

    --SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    
    --Fix LOI
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    
    DECLARE @Read1 INT;
    DECLARE @Read2 INT;

    BEGIN TRAN;
        -- Lần đọc 1: Lấy số lượng sinh viên đã đăng ký
        SELECT @Read1 = registered_students 
        FROM CourseSection 
        WHERE id = @section_id;

        -- Dừng 10 giây để chờ giao dịch khác (Sinh viên đăng ký) nhảy vào cập nhật
        WAITFOR DELAY '00:00:10';

        -- Lần đọc 2: Đọc lại đúng dữ liệu đó trong cùng 1 Transaction
        SELECT @Read2 = registered_students 
        FROM CourseSection 
        WHERE id = @section_id;
    COMMIT TRAN;

    -- Trả về kết quả của 2 lần đọc để so sánh trên API
    SELECT 
        @Read1 AS first_read, 
        @Read2 AS second_read,
        CASE 
            WHEN @Read1 <> @Read2 THEN 'Loi: Non-repeatable Read da xay ra!' 
            ELSE 'An toan: Khong co loi' 
        END AS status_message;
END;
GO

-- =================================================================
-- TRANSACTION B: Giao dịch của Sinh viên (Cập nhật đồng thời)
-- =================================================================
CREATE PROCEDURE sp_demo_non_repeatable_read_student
    @section_id INT,
    @add_count INT = 3 -- Giả lập 3 sinh viên cùng đăng ký
AS
BEGIN
    BEGIN TRAN;
        UPDATE CourseSection
        SET registered_students = registered_students + @add_count
        WHERE id = @section_id;
    COMMIT TRAN;
END;
GO