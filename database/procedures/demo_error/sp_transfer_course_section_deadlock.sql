CREATE PROCEDURE sp_transfer_course_section_deadlock
(
    @StudentId INT,
    @FromSectionId INT,
    @ToSectionId INT
)
AS
BEGIN

    BEGIN TRAN

        UPDATE CourseSection
        SET registered_students=registered_students-1
        WHERE id=@FromSectionId

        WAITFOR DELAY '00:00:10'

        UPDATE CourseSection
        SET registered_students=registered_students+1
        WHERE id=@ToSectionId

        -- Update Registration

        UPDATE CourseRegistration
        SET section_id=@ToSectionId
        WHERE student_id=@StudentId
        AND section_id=@FromSectionId;

        -- Registration Log
        INSERT INTO RegistrationLog
        (
            student_id,
            section_id,
            from_section_id,
            action_type,
            action_date
        )
        VALUES
        (
            @StudentId,
            @ToSectionId,
            @FromSectionId,
            'TRANSFER',
            GETDATE()
        );

    COMMIT

END
GO