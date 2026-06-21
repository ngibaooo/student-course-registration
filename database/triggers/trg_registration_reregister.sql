CREATE TRIGGER trg_registration_reregister
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
        'REGISTER',
        GETDATE(),
        i.student_id,
        i.section_id
    FROM inserted i
    INNER JOIN deleted d
        ON i.student_id = d.student_id
       AND i.section_id = d.section_id
    WHERE d.status = 'CANCELED'
      AND i.status = 'REGISTERED';

END
GO