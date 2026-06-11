CREATE PROCEDURE sp_register_course_section
(
    @StudentId INT,
    @SectionId INT
)
AS
BEGIN

    BEGIN TRANSACTION;

    -- Validate 1: Sinh viên phải tồn tại
    IF NOT EXISTS
    (
        SELECT 1
        FROM Student
        WHERE id = @StudentId
    )
    BEGIN
        PRINT N'Sinh viên không tồn tại';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Validate 2: Tài khoản sinh viên phải ACTIVE
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
        PRINT N'Tài khoản sinh viên đang bị khóa';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate 3: Lớp học phần phải tồn tại
    IF NOT EXISTS
    (
        SELECT 1
        FROM CourseSection
        WHERE id = @SectionId
    )
    BEGIN
        PRINT N'Lớp học phần không tồn tại';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate 4: Lớp học phần phải ACTIVE
    IF EXISTS
    (
        SELECT 1
        FROM CourseSection
        WHERE id = @SectionId
          AND status <> 'ACTIVE'
    )
    BEGIN
        PRINT N'Lớp học phần đang không hoạt động';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate 5: Học kỳ phải OPEN
    IF NOT EXISTS
    (
        SELECT 1
        FROM CourseSection CS
        INNER JOIN Semester S
            ON CS.semester_id = S.id
        WHERE CS.id = @SectionId
          AND S.status = 'OPEN'
    )
    BEGIN
        PRINT N'Học kỳ hiện tại không mở đăng ký';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate 6: Còn trong thời gian đăng ký
    IF NOT EXISTS
    (
        SELECT 1
        FROM CourseSection CS
        INNER JOIN Semester S
            ON CS.semester_id = S.id
        WHERE CS.id = @SectionId
          AND GETDATE()
              BETWEEN S.registration_open_date
                  AND S.registration_close_date
    )
    BEGIN
        PRINT N'Ngoài thời gian đăng ký học phần';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate 7: Lớp chưa đầy
    IF EXISTS
    (
        SELECT 1
        FROM CourseSection
        WHERE id = @SectionId
          AND registered_students >= maximum_students
    )
    BEGIN
        PRINT N'Lớp học phần đã đủ số lượng sinh viên';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate 8: Chưa đăng ký lớp học phần này
    IF EXISTS
    (
        SELECT 1
        FROM CourseRegistration
        WHERE student_id = @StudentId
          AND section_id = @SectionId
          AND status = 'REGISTERED'
    )
    BEGIN
        PRINT N'Sinh viên đã đăng ký lớp học phần này';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate 9: Chưa đăng ký cùng môn học
    IF EXISTS
    (
        SELECT 1
        FROM CourseRegistration CR
        INNER JOIN CourseSection CS1
            ON CR.section_id = CS1.id

        INNER JOIN CourseSection CS2
            ON CS2.id = @SectionId

        WHERE CR.student_id = @StudentId
          AND CR.status = 'REGISTERED'
          AND CS1.course_id = CS2.course_id
          AND CS1.semester_id = CS2.semester_id
    )
    BEGIN
        PRINT N'Sinh viên đã đăng ký môn học này trong học kỳ';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Validate 10: Không trùng lịch học
    IF EXISTS
    (
        SELECT 1
        FROM CourseRegistration CR

        INNER JOIN CourseSection CS_Registered
            ON CR.section_id = CS_Registered.id

        INNER JOIN CourseSection CS_New
            ON CS_New.id = @SectionId

        WHERE CR.student_id = @StudentId
          AND CR.status = 'REGISTERED'
          AND CS_Registered.semester_id = CS_New.semester_id
          AND CS_Registered.schedule_day = CS_New.schedule_day
          AND CS_New.start_period <= CS_Registered.end_period
          AND CS_New.end_period >= CS_Registered.start_period
    )
    BEGIN
        PRINT N'Lớp học phần bị trùng lịch học';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    
    -- Đăng kí thành công
    INSERT INTO CourseRegistration
    (
        student_id,
        section_id,
        registration_date,
        status
    )
    VALUES
    (
        @StudentId,
        @SectionId,
        GETDATE(),
        'REGISTERED'
    );

    
    -- Cập nhật sĩ số lớp
    UPDATE CourseSection
    SET registered_students = registered_students + 1
    WHERE id = @SectionId;

    COMMIT TRANSACTION;

    PRINT N'Đăng ký học phần thành công';

END
GO
