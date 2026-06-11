-- CREATE FUNCTION fn_is_schedule_conflict
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

--         INNER JOIN CourseSection CS_Registered
--             ON CR.section_id = CS_Registered.id

--         INNER JOIN CourseSection CS_New
--             ON CS_New.id = @SectionId

--         WHERE CR.student_id = @StudentId
--           AND CR.status = 'REGISTERED'
--           AND CS_Registered.semester_id = CS_New.semester_id
--           AND CS_Registered.schedule_day = CS_New.schedule_day
--           AND CS_New.start_period <= CS_Registered.end_period
--           AND CS_New.end_period >= CS_Registered.start_period
--     )
--     BEGIN
--         SET @Result = 1;
--     END

--     RETURN @Result;

-- END
-- GO