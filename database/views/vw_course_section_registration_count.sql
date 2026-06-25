IF OBJECT_ID('vw_course_section_registration_count', 'V') IS NOT NULL
    DROP VIEW vw_course_section_registration_count;
GO

CREATE VIEW vw_course_section_registration_count
AS
SELECT

    cs.id AS section_id,

    c.course_name,

    cs.maximum_students,

    cs.registered_students,

    (cs.maximum_students - cs.registered_students) AS available_slots

FROM CourseSection cs

JOIN Course c
    ON cs.course_id = c.id;
GO