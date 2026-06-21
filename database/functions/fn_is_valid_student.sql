CREATE FUNCTION fn_is_valid_student (@StudentId INT)
RETURNS BIT
AS
BEGIN

    DECLARE @Result BIT = 0;

    IF EXISTS
    (
        SELECT 1
        FROM Student
        WHERE id = @StudentId
    )
    BEGIN
        SET @Result = 1;
    END

    RETURN @Result;

END
GO