CREATE VIEW vw_open_course_sections
AS
SELECT
    CS.id,
    C.course_name,
    C.credits,
    L.full_name AS lecturer_name,
    CS.classroom,
    CS.schedule_day,
    CS.start_period,
    CS.end_period,
    CS.maximum_students,
    CS.registered_students,
    dbo.fn_get_remaining_slots(CS.id)
        AS remaining_slots,
    S.semester_name,
    S.academic_year
FROM CourseSection CS
INNER JOIN Course C
    ON CS.course_id = C.id
INNER JOIN Lecturer L
    ON CS.lecturer_id = L.id
INNER JOIN Semester S
    ON CS.semester_id = S.id
WHERE
    CS.status = 'ACTIVE'
    AND S.status = 'OPEN';
GO