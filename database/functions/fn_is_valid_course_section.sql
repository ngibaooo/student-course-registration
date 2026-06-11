CREATE FUNCTION fn_is_valid_course_section(@SectionId INT)
RETURNS BIT
AS
BEGIN 
    DECLARE @Result BIT = 0;

    IF EXISTS
    (
        SELECT 1
        FROM CourseSection
        WHERE id = @SectionId
    )
    BEGIN
        SET @Result = 1;
    END

    RETURN @Result;

END
GO