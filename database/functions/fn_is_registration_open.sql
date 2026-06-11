-- CREATE FUNCTION fn_is_registration_open
-- (
--     @SectionId INT
-- )
-- RETURNS BIT
-- AS
-- BEGIN

--     DECLARE @Result BIT = 0;

--     IF EXISTS
--     (
--         SELECT 1
--         FROM CourseSection CS
--         INNER JOIN Semester S
--             ON CS.semester_id = S.id
--         WHERE CS.id = @SectionId
--           AND S.status = 'OPEN'
--           AND GETDATE()
--               BETWEEN S.registration_open_date
--                   AND S.registration_close_date
--     )
--     BEGIN
--         SET @Result = 1;
--     END

--     RETURN @Result;

-- END
-- GO