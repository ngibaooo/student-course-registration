CREATE PROCEDURE sp_register_course_section_lost_update
(
    @StudentId INT,
    @SectionId INT
)
AS
BEGIN

    DECLARE @CurrentStudents INT;

    SELECT
        @CurrentStudents = registered_students
    FROM CourseSection
    WHERE id = @SectionId;

    WAITFOR DELAY '00:00:10';

    INSERT INTO CourseRegistration
    (
        student_id,
        section_id,
        registration_date,
        status
    )
    VALUES
    (
        @StudentId,
        @SectionId,
        GETDATE(),
        'REGISTERED'
    );

    UPDATE CourseSection
    SET registered_students = @CurrentStudents + 1
    WHERE id = @SectionId;

END