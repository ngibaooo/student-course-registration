CREATE TRIGGER trg_registration_cancel
ON CourseRegistration
AFTER UPDATE
AS
BEGIN

    INSERT INTO RegistrationLog
    (
        action_type,
        action_date,
        student_id,
        section_id
    )
    SELECT
        'CANCEL',
        GETDATE(),
        i.student_id,
        i.section_id
    FROM inserted i
    INNER JOIN deleted d
        ON i.student_id = d.student_id
       AND i.section_id = d.section_id
    WHERE d.status = 'REGISTERED'
      AND i.status = 'CANCELED';

END
GO