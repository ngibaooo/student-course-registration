CREATE FUNCTION fn_is_canceled_registration
(
    @StudentId INT,
    @SectionId INT
)
RETURNS BIT
AS
BEGIN

    DECLARE @Result BIT = 0;

    IF EXISTS
    (
        SELECT 1
        FROM CourseRegistration
        WHERE student_id = @StudentId
          AND section_id = @SectionId
          AND status = 'CANCELED'
    )
        SET @Result = 1;

    RETURN @Result;

END
GO