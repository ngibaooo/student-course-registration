CREATE TRIGGER trg_registration_insert
ON CourseRegistration
AFTER INSERT
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
        student_id,
        section_id
    FROM inserted;

END
GO