CREATE FUNCTION fn_is_active_student(@StudentId INT)
RETURNS BIT
AS
BEGIN
    DECLARE @Result BIT = 1;

    IF EXISTS
    (
        SELECT 1
        FROM Student S
        INNER JOIN [User] U
            ON S.user_id = U.id
        WHERE S.id = @StudentId
        AND U.status <> 'ACTIVE'
    )
    BEGIN
        SET @Result = 0;
    END

    RETURN @Result;

END
GO