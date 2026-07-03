DROP PROCEDURE sp_transfer_course_section
GO

CREATE PROCEDURE sp_transfer_course_section
(
    @StudentId INT,
    @FromSectionId INT,
    @ToSectionId INT
)
AS
BEGIN

    BEGIN TRY

        BEGIN TRANSACTION;
        DECLARE @FirstSectionId INT;
        DECLARE @SecondSectionId INT;

        IF @FromSectionId < @ToSectionId
        BEGIN
            SET @FirstSectionId = @FromSectionId;
            SET @SecondSectionId = @ToSectionId;
        END
        ELSE
        BEGIN
            SET @FirstSectionId = @ToSectionId;
            SET @SecondSectionId = @FromSectionId;
        END;

        SELECT id
        FROM CourseSection WITH (UPDLOCK, HOLDLOCK)
        WHERE id = @FirstSectionId;

        WAITFOR DELAY '00:00:10';

        SELECT id
        FROM CourseSection WITH (UPDLOCK, HOLDLOCK)
        WHERE id = @SecondSectionId;
        -- Validate Student
        -- IF dbo.fn_is_valid_student(@StudentId)=0
        -- BEGIN
        --     THROW 50001,
        --     N'Sinh viên không tồn tại',
        --     1;
        -- END

        -- -- Validate Section
        -- IF dbo.fn_is_valid_course_section(@FromSectionId)=0
        -- BEGIN
        --     THROW 50002,
        --     N'Lớp học phần nguồn không tồn tại',
        --     1;
        -- END

        -- IF dbo.fn_is_valid_course_section(@ToSectionId)=0
        -- BEGIN
        --     THROW 50003,
        --     N'Lớp học phần đích không tồn tại',
        --     1;
        -- END

        -- -- Không được chuyển sang chính nó

        -- IF @FromSectionId=@ToSectionId
        -- BEGIN
        --     THROW 50004,
        --     N'Hai lớp học phần giống nhau',
        --     1;
        -- END

        -- -- Student đang học lớp nguồn
        -- IF NOT EXISTS
        -- (
        --     SELECT 1
        --     FROM CourseRegistration
        --     WHERE student_id=@StudentId
        --     AND section_id=@FromSectionId
        --     AND status='REGISTERED'
        -- )
        -- BEGIN
        --     THROW 50005,
        --     N'Sinh viên không đăng ký lớp học phần nguồn',
        --     1;
        -- END

        -- -- Lớp mới ACTIVE
        -- IF dbo.fn_is_active_course_section(@ToSectionId)=0
        -- BEGIN
        --     THROW 50006,
        --     N'Lớp học phần đích không hoạt động',
        --     1;
        -- END

        -- -- Lớp mới còn chỗ
        -- IF dbo.fn_get_remaining_slots(@ToSectionId)<=0
        -- BEGIN
        --     THROW 50007,
        --     N'Lớp học phần đích đã đầy',
        --     1;
        -- END

        -- -- Hai lớp cùng môn
        -- IF
        -- (
        --     SELECT course_id
        --     FROM CourseSection
        --     WHERE id=@FromSectionId
        -- )
        -- <>
        -- (
        --     SELECT course_id
        --     FROM CourseSection
        --     WHERE id=@ToSectionId
        -- )
        -- BEGIN
        --     THROW 50008,
        --     N'Chỉ được chuyển giữa các lớp của cùng một môn học',
        --     1;
        -- END

        
        -- -- Không trùng lịch
        -- IF dbo.fn_is_schedule_conflict
        -- (
        --     @StudentId,
        --     @ToSectionId
        -- )=1
        -- BEGIN
        --     THROW 50009,
        --     N'Lớp học phần mới bị trùng lịch',
        --     1;
        -- END

        -- Update Registration

        UPDATE CourseRegistration
        SET section_id=@ToSectionId
        WHERE student_id=@StudentId
        AND section_id=@FromSectionId;

        -- Update số lượng

        UPDATE CourseSection
        SET registered_students=registered_students-1
        WHERE id=@FromSectionId;

        UPDATE CourseSection
        SET registered_students=registered_students+1
        WHERE id=@ToSectionId;

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
        COMMIT TRANSACTION;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        THROW;

    END CATCH

END
GO