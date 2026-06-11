-- CREATE FUNCTION fn_is_course_already_registered
-- (
--     @StudentId INT,
--     @SectionId INT
-- )
-- RETURNS BIT
-- AS
-- BEGIN

--     DECLARE @Result BIT = 0;

--     IF EXISTS
--     (
--         SELECT 1
--         FROM CourseRegistration CR
--         INNER JOIN CourseSection CS1
--             ON CR.section_id = CS1.id
--         INNER JOIN CourseSection CS2
--             ON CS2.id = @SectionId
--         WHERE CR.student_id = @StudentId
--           AND CR.status = 'REGISTERED'
--           AND CS1.course_id = CS2.course_id
--           AND CS1.semester_id = CS2.semester_id
--     )
--     BEGIN
--         SET @Result = 1;
--     END

--     RETURN @Result;

-- END
-- GO