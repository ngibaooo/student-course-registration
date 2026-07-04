USE StudentRegistrationDB;
GO

CREATE OR ALTER PROCEDURE sp_register_phantom_read
(
    @StudentId INT,
    @SectionId INT
)
AS
BEGIN
    --SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; --Dùng SERIALIZABLE

    BEGIN TRANSACTION;

    DECLARE @Remaining INT;

    SELECT
        @Remaining = maximum_students - registered_students
    FROM CourseSection
    WHERE id = @SectionId;

    PRINT N'Đợi 8 giây...';

    WAITFOR DELAY '00:00:08';

    IF @Remaining <= 0
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50001,N'Lớp đã đầy',1;
    END

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
    SET registered_students = registered_students + 1
    WHERE id = @SectionId;

    COMMIT TRANSACTION;

END
GO