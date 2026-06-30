IF OBJECT_ID('dbo.vw_student_schedule', 'V') IS NOT NULL
    DROP VIEW dbo.vw_student_schedule;
GO
CREATE VIEW vw_student_schedule
AS
SELECT
    s.id AS student_id,
    u.id AS user_id,
    u.full_name,
    c.course_name,
    c.credits,

    cs.id AS section_id,
    cs.classroom,
    cs.schedule_day,
    cs.start_period,
    cs.end_period,
    cs.status AS section_status,

    l.full_name AS lecturer_name,

    sem.semester_name,
    sem.academic_year,
    sem.start_date,
    sem.end_date

FROM CourseRegistration cr

JOIN Student s
    ON cr.student_id = s.id

JOIN [User] u
    ON s.user_id = u.id

JOIN CourseSection cs
    ON cr.section_id = cs.id

JOIN Course c
    ON cs.course_id = c.id

JOIN Semester sem
    ON cs.semester_id = sem.id

LEFT JOIN Lecturer l
    ON cs.lecturer_id = l.id

WHERE cr.status = 'REGISTERED';