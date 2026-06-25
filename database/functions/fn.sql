-- 2. FUNCTION: Kiểm tra trạng thái học kỳ (hỗ trợ cho validate trước khi insert section)
CREATE FUNCTION fn_GetSemesterStatus (@semester_id INT)
RETURNS VARCHAR(20)
AS
BEGIN
    DECLARE @status VARCHAR(20);
    SELECT @status = status FROM Semester WHERE id = @semester_id;
    RETURN @status;
END;
GO