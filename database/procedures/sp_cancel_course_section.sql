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
        PRINT N'Sinh viên không tồn tại';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate student active
    IF dbo.fn_is_active_student(@StudentId) = 0
    BEGIN
        PRINT N'Tài khoản sinh viên đang bị khóa';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate section
    IF dbo.fn_is_valid_course_section(@SectionId) = 0
    BEGIN
        PRINT N'Lớp học phần không tồn tại';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate registered
    IF dbo.fn_is_registered_course_section(@StudentId, @SectionId) = 0
    BEGIN
        PRINT N'Sinh viên chưa đăng ký học phần này';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate status
    IF dbo.fn_is_canceled_registration(@StudentId, @SectionId) = 1
    BEGIN
        PRINT N'Học phần đã được hủy trước đó';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate cancel deadline
    IF dbo.fn_can_cancel_registration(@SectionId) = 0
    BEGIN
        PRINT N'Đã quá thời hạn hủy học phần';
        ROLLBACK TRANSACTION;
        RETURN;
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

    PRINT N'Hủy học phần thành công';

END
GO