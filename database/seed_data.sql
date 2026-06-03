USE StudentRegistrationDB;
GO

-- Department
INSERT INTO Department(department_name, address, phone)
VALUES
(N'Information Technology', N'Building A', '0901000001'),
(N'Business Administration', N'Building B', '0901000002'),
(N'Mechanical Engineering', N'Building C', '0901000003');
GO

-- User
INSERT INTO [User]
(full_name, email, [password], role, status)
VALUES
('Admin System', 'admin@ut.edu.vn', 'admin123', 'ADMIN', 'ACTIVE'),
('Nguyen Van A', 'sv001@ut.edu.vn', '123456', 'STUDENT', 'ACTIVE'),
('Tran Thi B', 'sv002@ut.edu.vn', '123456', 'STUDENT', 'ACTIVE'),
('Le Van C', 'sv003@ut.edu.vn', '123456', 'STUDENT', 'ACTIVE'),
('Pham Thi D', 'sv004@ut.edu.vn', '123456', 'STUDENT', 'ACTIVE'),
('Hoang Van E', 'sv005@ut.edu.vn', '123456', 'STUDENT', 'ACTIVE');
GO

-- Student
INSERT INTO Student
(
date_of_birth,
gender,
phone,
address,
department_id,
user_id
)
VALUES
('2003-01-15', 'MALE', '0911111111', N'Ha Noi', 1, 2),
('2003-02-20', 'FEMALE', '0911111112', N'Hai Phong', 1, 3),
('2003-03-10', 'MALE', '0911111113', N'Da Nang', 2, 4),
('2003-04-25', 'FEMALE', '0911111114', N'Can Tho', 2, 5),
('2003-05-05', 'MALE', '0911111115', N'Ho Chi Minh', 3, 6);
GO

-- Lecturer
INSERT INTO Lecturer
(
full_name,
email,
phone,
department_id
)
VALUES
(N'Dr. Nguyen Minh', 'gv001@ut.edu.vn', '0988880001', 1),
(N'Dr. Tran Thanh', 'gv002@ut.edu.vn', '0988880002', 1),
(N'Dr. Le Hoang', 'gv003@ut.edu.vn', '0988880003', 2),
(N'Dr. Pham Duc', 'gv004@ut.edu.vn', '0988880004', 3);
GO

-- Course
INSERT INTO Course
(
course_name,
credits,
description,
status
)
VALUES
(N'Database Systems', 3, N'Introduction to Database', 'ACTIVE'),
(N'Object Oriented Programming', 3, N'OOP with Java', 'ACTIVE'),
(N'Web Development', 3, N'HTML CSS JavaScript', 'ACTIVE'),
(N'Software Engineering', 3, N'Software Development Process', 'ACTIVE'),
(N'Computer Networks', 3, N'Networking Fundamentals', 'ACTIVE');
GO

-- Semester
INSERT INTO Semester
(
semester_name,
academic_year,
start_date,
end_date,
registration_open_date,
registration_close_date,
cancel_deadline,
status
)
VALUES
(
N'Semester 1',
'2025-2026',
'2025-09-01',
'2026-01-15',
'2025-08-01',
'2025-08-31',
'2025-09-15',
'OPEN'
);
GO

-- CourseSection
INSERT INTO CourseSection
(
classroom,
schedule_day,
start_period,
end_period,
maximum_students,
registered_students,
status,
semester_id,
course_id,
lecturer_id
)
VALUES
('A101', 2, 1, 3, 50, 2, 'ACTIVE', 1, 1, 1),
('A102', 3, 4, 6, 50, 1, 'ACTIVE', 1, 2, 2),
('B201', 4, 1, 3, 40, 1, 'ACTIVE', 1, 3, 1),
('B202', 5, 7, 9, 40, 0, 'ACTIVE', 1, 4, 3),
('C301', 6, 4, 6, 45, 0, 'ACTIVE', 1, 5, 4);
GO

-- CourseRegistration
INSERT INTO CourseRegistration
(
student_id,
section_id,
registration_date,
status
)
VALUES
(1, 1, GETDATE(), 'REGISTERED'),
(2, 1, GETDATE(), 'REGISTERED'),
(3, 2, GETDATE(), 'REGISTERED'),
(4, 3, GETDATE(), 'REGISTERED');
GO
