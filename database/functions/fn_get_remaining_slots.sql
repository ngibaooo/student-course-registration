CREATE FUNCTION fn_get_remaining_slots
(
    @SectionId INT
)
RETURNS INT
AS
BEGIN

    DECLARE @Remaining INT;

    SELECT
        @Remaining =
            maximum_students - registered_students
    FROM CourseSection
    WHERE id = @SectionId;

    RETURN ISNULL(@Remaining,0);

END
GO