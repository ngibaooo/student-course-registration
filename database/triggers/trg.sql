-- 4. TRIGGER: Tự động ghi log và cập nhật số lượng sinh viên đăng ký vào CourseSection
CREATE TRIGGER trg_CourseRegistration_Audit
ON CourseRegistration
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Xử lý khi Đăng ký mới (INSERT)
    IF EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted)
    BEGIN
        INSERT INTO RegistrationLog (action_type, action_date, student_id, section_id)
        SELECT 'REGISTER', GETDATE(), student_id, section_id FROM inserted;

        UPDATE cs
        SET registered_students = registered_students + 1
        FROM CourseSection cs
        JOIN inserted i ON cs.id = i.section_id;
    END

    -- Xử lý khi Hủy đăng ký (UPDATE status = 'CANCELED')
    IF EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
    BEGIN
        IF EXISTS(SELECT 1 FROM inserted i JOIN deleted d ON i.student_id = d.student_id AND i.section_id = d.section_id WHERE i.status = 'CANCELED' AND d.status = 'REGISTERED')
        BEGIN
            INSERT INTO RegistrationLog (action_type, action_date, student_id, section_id)
            SELECT 'CANCEL', GETDATE(), student_id, section_id FROM inserted WHERE status = 'CANCELED';

            UPDATE cs
            SET registered_students = registered_students - 1
            FROM CourseSection cs
            JOIN inserted i ON cs.id = i.section_id WHERE i.status = 'CANCELED';
        END
    END
END;
GO