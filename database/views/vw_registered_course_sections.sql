IF OBJECT_ID('vw_registered_course_sections', 'V') IS NOT NULL
    DROP VIEW vw_registered_course_sections;
GO

CREATE VIEW vw_registered_course_sections
AS
SELECT

    u.id AS user_id,

    s.id AS student_id,

    cs.id AS section_id,

    c.course_name,

    c.credits,

    cs.classroom,

    cs.schedule_day,

    cs.start_period,

    cs.end_period,

    cr.registration_date,

    cr.status

FROM CourseRegistration cr

JOIN Student s
    ON cr.student_id = s.id

JOIN [User] u
    ON s.user_id = u.id

JOIN CourseSection cs
    ON cr.section_id = cs.id

JOIN Course c
    ON cs.course_id = c.id

WHERE cr.status = 'REGISTERED';
GO