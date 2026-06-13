CREATE FUNCTION fn_is_registered_course_section
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
    )
        SET @Result = 1;

    RETURN @Result;

END
GO