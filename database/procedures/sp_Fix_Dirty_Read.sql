/*
Cách khắc phục lỗi Dirty Read cho demo CourseRegistration.
Mục tiêu:
- Không cho Session B đọc dữ liệu chưa commit từ Session A.
- Dùng READ COMMITTED và khóa dòng để đảm bảo tính nhất quán.
- Chỉ commit sau khi thao tác cập nhật hoàn tất.
*/

USE StudentRegistrationDB;
GO

-- Bật lại trigger audit nếu trước đó đã tắt trong demo lỗi
ALTER TABLE CourseRegistration ENABLE TRIGGER trg_CourseRegistration_Audit;
GO

-- =========================
-- Session A: thiết lập dữ liệu ban đầu cho demo khắc phục
-- =========================
DECLARE @DepartmentId INT;
DECLARE @UserId INT;
DECLARE @StudentId INT;
DECLARE @LecturerId INT;
DECLARE @CourseId INT;
DECLARE @SemesterId INT;
DECLARE @SectionId INT;

IF NOT EXISTS (SELECT 1 FROM Department WHERE department_name = N'DEMO_DIRTY_READ_DEPT')
BEGIN
    INSERT INTO Department (department_name, address, phone)
    VALUES (N'DEMO_DIRTY_READ_DEPT', N'123 Demo Street', '0901111222');
END
SELECT @DepartmentId = id FROM Department WHERE department_name = N'DEMO_DIRTY_READ_DEPT';

IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'dirtyread_student@example.com')
BEGIN
    INSERT INTO [User] (full_name, email, [password], role, status)
    VALUES (N'Demo Student', 'dirtyread_student@example.com', '123456', 'STUDENT', 'ACTIVE');
END
SELECT @UserId = id FROM [User] WHERE email = 'dirtyread_student@example.com';

IF NOT EXISTS (SELECT 1 FROM Student WHERE user_id = @UserId)
BEGIN
    INSERT INTO Student (date_of_birth, gender, phone, address, enrollment_year, department_id, user_id)
    VALUES ('2000-01-01', 'MALE', '0901234567', N'Ha Noi', 2023, @DepartmentId, @UserId);
END
SELECT @StudentId = id FROM Student WHERE user_id = @UserId;

IF NOT EXISTS (SELECT 1 FROM Lecturer WHERE email = 'dirtyread_lecturer@example.com')
BEGIN
    INSERT INTO Lecturer (full_name, email, phone, department_id)
    VALUES (N'Demo Lecturer', 'dirtyread_lecturer@example.com', '0907654321', @DepartmentId);
END
SELECT @LecturerId = id FROM Lecturer WHERE email = 'dirtyread_lecturer@example.com';

IF NOT EXISTS (SELECT 1 FROM Course WHERE course_name = N'DEMO_DIRTY_READ_COURSE')
BEGIN
    INSERT INTO Course (course_name, credits, description, status)
    VALUES (N'DEMO_DIRTY_READ_COURSE', 3, N'Course for dirty read demo', 'ACTIVE');
END
SELECT @CourseId = id FROM Course WHERE course_name = N'DEMO_DIRTY_READ_COURSE';

IF NOT EXISTS (SELECT 1 FROM Semester WHERE semester_name = N'DEMO_DIRTY_READ_SEM')
BEGIN
    INSERT INTO Semester (semester_name, academic_year, start_date, end_date, registration_open_date, registration_close_date, cancel_deadline, status)
    VALUES (N'DEMO_DIRTY_READ_SEM', '2026-2027', '2026-09-01', '2026-12-31', '2026-07-01', '2026-12-31', '2026-12-31', 'OPEN');
END
SELECT @SemesterId = id FROM Semester WHERE semester_name = N'DEMO_DIRTY_READ_SEM';

IF NOT EXISTS (SELECT 1 FROM CourseSection WHERE classroom = N'P101_DIRTY_READ' AND course_id = @CourseId AND semester_id = @SemesterId)
BEGIN
    INSERT INTO CourseSection (classroom, schedule_day, start_period, end_period, maximum_students, registered_students, status, semester_id, course_id, lecturer_id)
    VALUES (N'P101_DIRTY_READ', 2, 1, 3, 1000, 0, 'ACTIVE', @SemesterId, @CourseId, @LecturerId);
END
ELSE
BEGIN
    UPDATE CourseSection
    SET maximum_students = 1000,
        registered_students = 0,
        status = 'ACTIVE'
    WHERE classroom = N'P101_DIRTY_READ' AND course_id = @CourseId AND semester_id = @SemesterId;
END
SELECT @SectionId = id FROM CourseSection WHERE classroom = N'P101_DIRTY_READ' AND course_id = @CourseId AND semester_id = @SemesterId;

DELETE FROM CourseRegistration
WHERE student_id = @StudentId AND section_id = @SectionId;

UPDATE CourseSection
SET registered_students = 0
WHERE id = @SectionId;

INSERT INTO CourseRegistration (student_id, section_id, status)
VALUES (@StudentId, @SectionId, 'REGISTERED');

SELECT N'Session A - trạng thái ban đầu' AS [Stage], *
FROM CourseRegistration
WHERE student_id = @StudentId AND section_id = @SectionId;
GO

-- =========================
-- Session A: cập nhật trạng thái bằng transaction an toàn
-- =========================
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
GO

BEGIN TRANSACTION;

DECLARE @CurrentStatus VARCHAR(20);

SELECT @CurrentStatus = status
FROM CourseRegistration WITH (UPDLOCK, HOLDLOCK)
WHERE student_id = (SELECT id FROM Student WHERE user_id = (SELECT id FROM [User] WHERE email = 'dirtyread_student@example.com'))
  AND section_id = (SELECT id FROM CourseSection WHERE classroom = N'P101_DIRTY_READ' AND course_id = (SELECT id FROM Course WHERE course_name = N'DEMO_DIRTY_READ_COURSE') AND semester_id = (SELECT id FROM Semester WHERE semester_name = N'DEMO_DIRTY_READ_SEM'));

SELECT N'Session A - trạng thái trước khi cập nhật' AS [Stage], @CurrentStatus AS status;

IF @CurrentStatus = 'REGISTERED'
BEGIN
    UPDATE CourseRegistration
    SET status = 'CANCELED'
    WHERE student_id = (SELECT id FROM Student WHERE user_id = (SELECT id FROM [User] WHERE email = 'dirtyread_student@example.com'))
      AND section_id = (SELECT id FROM CourseSection WHERE classroom = N'P101_DIRTY_READ' AND course_id = (SELECT id FROM Course WHERE course_name = N'DEMO_DIRTY_READ_COURSE') AND semester_id = (SELECT id FROM Semester WHERE semester_name = N'DEMO_DIRTY_READ_SEM'));

    SELECT N'Session A - trạng thái sau khi cập nhật' AS [Stage], *
    FROM CourseRegistration
    WHERE student_id = (SELECT id FROM Student WHERE user_id = (SELECT id FROM [User] WHERE email = 'dirtyread_student@example.com'))
      AND section_id = (SELECT id FROM CourseSection WHERE classroom = N'P101_DIRTY_READ' AND course_id = (SELECT id FROM Course WHERE course_name = N'DEMO_DIRTY_READ_COURSE') AND semester_id = (SELECT id FROM Semester WHERE semester_name = N'DEMO_DIRTY_READ_SEM'));

    WAITFOR DELAY '00:00:15';
    COMMIT TRANSACTION;
END
ELSE
BEGIN
    ROLLBACK TRANSACTION;
END
GO

-- =========================
-- Session B: đọc dữ liệu bằng READ COMMITTED, không đọc dữ liệu chưa commit
-- =========================
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
GO

SELECT N'Session B - trạng thái sau khi commit' AS [Stage], status
FROM CourseRegistration
WHERE student_id = (SELECT id FROM Student WHERE user_id = (SELECT id FROM [User] WHERE email = 'dirtyread_student@example.com'))
  AND section_id = (SELECT id FROM CourseSection WHERE classroom = N'P101_DIRTY_READ' AND course_id = (SELECT id FROM Course WHERE course_name = N'DEMO_DIRTY_READ_COURSE') AND semester_id = (SELECT id FROM Semester WHERE semester_name = N'DEMO_DIRTY_READ_SEM'));
GO