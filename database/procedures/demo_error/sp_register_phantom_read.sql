USE StudentRegistrationDB;
GO

CREATE OR ALTER PROCEDURE sp_register_phantom_read
(
    @StudentId INT,
    @SectionId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

    BEGIN TRANSACTION;

    BEGIN TRY

        DECLARE @Remaining INT;

        PRINT '===== Student ' + CAST(@StudentId AS VARCHAR) + ' =====';
        PRINT 'Reading remaining slots...';

        -- Giữ lock đến khi COMMIT
        SELECT
            @Remaining = maximum_students - registered_students
        FROM CourseSection 
        WHERE id = @SectionId;

        PRINT 'Remaining = ' + CAST(@Remaining AS VARCHAR);

        PRINT 'Waiting 8 seconds...';
        WAITFOR DELAY '00:00:08';

        IF @Remaining <= 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, N'Lớp đã đầy', 1;
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

        PRINT 'Student ' + CAST(@StudentId AS VARCHAR) + ' REGISTER SUCCESS';

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH
END
GO
--EXEC sp_phantom_setup_demo
--DELETE FROM CourseRegistration
--WHERE student_id = 3;
--UPDATE CourseSection
-- SET registered_students =
-- (
--     SELECT COUNT(*)
--     FROM CourseRegistration
--     WHERE section_id = CourseSection.id
--       AND status = 'REGISTERED'
-- );