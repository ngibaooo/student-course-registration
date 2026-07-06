/*
Demo lỗi Dirty Read (Read Uncommitted) cho CourseRegistration.
Mục tiêu: minh họa rằng Session B có thể đọc giá trị chưa commit từ Session A,
Sau đó khi Session A rollback, dữ liệu thực tế quay về REGISTERED,
nhưng Session B vẫn giữ giá trị CANCELED mà nó đã đọc trước đó.
*/

USE StudentRegistrationDB;
GO

-- Tạm thời vô hiệu hóa trigger audit để demo dirty read không bị chặn bởi logic cập nhật registered_students
ALTER TABLE CourseRegistration DISABLE TRIGGER trg_CourseRegistration_Audit;
GO

-- =========================
-- Session A: thiết lập dữ liệu ban đầu cho demo
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

-- Xóa bản ghi demo cũ để tránh trigger và constraint bị ảnh hưởng bởi dữ liệu cũ
DELETE FROM CourseRegistration
WHERE student_id = @StudentId AND section_id = @SectionId;

UPDATE CourseSection
SET registered_students = 0
WHERE id = @SectionId;

-- Tạo bản ghi đăng ký mới với trạng thái REGISTERED
INSERT INTO CourseRegistration (student_id, section_id, status)
VALUES (@StudentId, @SectionId, 'REGISTERED');

SELECT 'Session A - trang thai ban đau ' AS [Stage], *
FROM CourseRegistration
WHERE student_id = @StudentId AND section_id = @SectionId;

-- Bây giờ đổi sang CANCELED nhưng chưa commit
BEGIN TRANSACTION;

UPDATE CourseRegistration
SET status = 'CANCELED'
WHERE student_id = @StudentId AND section_id = @SectionId;

SELECT 'Session A - truoc khi rollback' AS [Stage], *
FROM CourseRegistration
WHERE student_id = @StudentId AND section_id = @SectionId;

WAITFOR DELAY '00:00:15';

-- Session A quay lại REGISTERED sau rollback
ROLLBACK TRANSACTION;

SELECT 'Session A - sau rollback ' AS [Stage], *
FROM CourseRegistration
WHERE student_id = @StudentId AND section_id = @SectionId;
GO

-- =========================
-- Session B: đọc dữ liệu chưa commit bằng READ UNCOMMITTED
-- =========================
-- Chạy phần này ở cửa sổ query riêng, sau khi Session A đã bắt đầu transaction.
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

IF OBJECT_ID('tempdb..#DirtyReadSnapshot') IS NOT NULL
BEGIN
    DROP TABLE #DirtyReadSnapshot;
END

CREATE TABLE #DirtyReadSnapshot
(
    status_value VARCHAR(20)
);

INSERT INTO #DirtyReadSnapshot (status_value)
SELECT status
FROM CourseRegistration WITH (NOLOCK)
WHERE student_id = (
    SELECT id FROM Student WHERE user_id = (
        SELECT id FROM [User] WHERE email = 'dirtyread_student@example.com'
    )
)
AND section_id = (
    SELECT id FROM CourseSection WHERE classroom = N'P101_DIRTY_READ' AND course_id = (
        SELECT id FROM Course WHERE course_name = N'DEMO_DIRTY_READ_COURSE'
    ) AND semester_id = (
        SELECT id FROM Semester WHERE semester_name = N'DEMO_DIRTY_READ_SEM'
    )
);

SELECT N'Session B - đọc được trước rollback' AS [Stage], status_value AS status
FROM #DirtyReadSnapshot;

-- Sau khi Session A rollback, chạy câu dưới để thấy giá trị đã được giữ lại ở Session B.
SELECT N'Session B - vẫn giữ giá trị ' AS [Stage], status_value AS status
FROM #DirtyReadSnapshot;
GO


