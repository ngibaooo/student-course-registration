USE StudentRegistrationDB;
GO

IF OBJECT_ID('dbo.vw_student_profile', 'V') IS NOT NULL
    DROP VIEW dbo.vw_student_profile;
GO

CREATE VIEW dbo.vw_student_profile
AS
SELECT
    u.id AS user_id,
    s.id AS student_id,
    u.full_name,
    u.email,

    s.date_of_birth,
    s.gender,
    s.phone,
    s.address,
    s.enrollment_year,

    d.id AS department_id,
    d.department_name

FROM Student s
INNER JOIN [User] u
    ON s.user_id = u.id
LEFT JOIN Department d
    ON s.department_id = d.id;
GO