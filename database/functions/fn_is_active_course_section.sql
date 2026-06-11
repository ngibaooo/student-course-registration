CREATE FUNCTION fn_is_active_course_section(@SectionId INT)
RETURNS BIT
AS
BEGIN 
    DECLARE @Result BIT = 1;

    IF EXISTS
    (
        SELECT 1
        FROM CourseSection
        WHERE id = @SectionId
        AND status <> 'ACTIVE'
    )
    BEGIN
        SET @Result = 0;
    END

    RETURN @Result;

END
GO