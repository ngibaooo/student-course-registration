CREATE PROCEDURE sp_cancel_course_section
(
    @StudentId INT,
    @SectionId INT
)
AS
BEGIN

    BEGIN TRANSACTION;

    -- Validate student
    IF dbo.fn_is_valid_student(@StudentId) = 0
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 51001,
              N'Sinh viên không tồn tại',
              1;
    END

    -- Validate student active
    IF dbo.fn_is_active_student(@StudentId) = 0
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 51002,
              N'Tài khoản sinh viên đang bị khóa',
              1;
    END

    -- Validate section
    IF dbo.fn_is_valid_course_section(@SectionId) = 0
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 51003,
              N'Lớp học phần không tồn tại',
              1;
    END

    -- Validate registered
    IF dbo.fn_is_registered_course_section(@StudentId, @SectionId) = 0
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 51004,
              N'Sinh viên chưa đăng ký học phần này',
              1;
    END

    -- Validate status
    IF dbo.fn_is_canceled_registration(@StudentId, @SectionId) = 1
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 51005,
              N'Học phần đã được hủy trước đó',
              1;
    END

    -- Validate cancel deadline
    IF dbo.fn_can_cancel_registration(@SectionId) = 0
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 51006,
              N'Đã quá thời hạn hủy học phần',
              1;
    END

    -- Cancel registration
    UPDATE CourseRegistration
    SET status = 'CANCELED'
    WHERE student_id = @StudentId
      AND section_id = @SectionId;

    -- Update slot
    UPDATE CourseSection
    SET registered_students = registered_students - 1
    WHERE id = @SectionId;

    COMMIT TRANSACTION;

END
GO