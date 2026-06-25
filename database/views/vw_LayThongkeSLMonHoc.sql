USE StudentRegistrationDB;
GO

-- 1. VIEW: Lấy thống kê occupancy rate và số lượng của môn học, học kỳ
CREATE VIEW vw_CourseSectionStatistics AS
SELECT 
    cs.id, c.course_name, cs.classroom, cs.maximum_students, cs.registered_students,
    CAST(cs.registered_students * 100.0 / cs.maximum_students AS DECIMAL(5,2)) AS occupancy_rate
FROM CourseSection cs
JOIN Course c ON cs.course_id = c.id;
GO

CREATE VIEW vw_SemesterStatistics AS
SELECT 
    sem.id, sem.semester_name,
    COUNT(DISTINCT cs.id) AS total_sections,
    COUNT(cr.student_id) AS total_registrations
FROM Semester sem
LEFT JOIN CourseSection cs ON sem.id = cs.semester_id
LEFT JOIN CourseRegistration cr ON cs.id = cr.section_id
GROUP BY sem.id, sem.semester_name;
GO