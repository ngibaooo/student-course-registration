CREATE FUNCTION fn_can_cancel_registration
(
    @SectionId INT
)
RETURNS BIT
AS
BEGIN

    DECLARE @Result BIT = 0;

    IF EXISTS
    (
        SELECT 1
        FROM CourseSection CS
        INNER JOIN Semester S
            ON CS.semester_id = S.id
        WHERE CS.id = @SectionId
          AND GETDATE() <= S.cancel_deadline
    )
        SET @Result = 1;

    RETURN @Result;

END
GO