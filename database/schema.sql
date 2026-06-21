-- STUDENT COURSE REGISTRATION SYSTEM
-- SQL Server Schema
CREATE DATABASE StudentRegistrationDB;
GO

USE StudentRegistrationDB;
GO

-- DEPARTMENT
CREATE TABLE Department (
id INT IDENTITY(1,1) PRIMARY KEY,
department_name NVARCHAR(100) NOT NULL,
address NVARCHAR(255),
phone VARCHAR(20)
);
-- USER
CREATE TABLE [User] (
id INT IDENTITY(1,1) PRIMARY KEY,
full_name NVARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
[password] VARCHAR(255) NOT NULL,

role VARCHAR(20) NOT NULL
    CHECK (role IN ('ADMIN', 'STUDENT')),

status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'LOCKED'))
);
-- STUDENT
CREATE TABLE Student (
id INT IDENTITY(1,1) PRIMARY KEY,
date_of_birth DATE,
gender VARCHAR(10)
    CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),

phone VARCHAR(20),
address NVARCHAR(255),

department_id INT NOT NULL,
user_id INT NOT NULL UNIQUE,

CONSTRAINT FK_Student_Department
    FOREIGN KEY (department_id)
    REFERENCES Department(id),

CONSTRAINT FK_Student_User
    FOREIGN KEY (user_id)
    REFERENCES [User](id)
);

-- LECTURER
CREATE TABLE Lecturer (
id INT IDENTITY(1,1) PRIMARY KEY,
full_name NVARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE,
phone VARCHAR(20),

department_id INT NOT NULL,

CONSTRAINT FK_Lecturer_Department
    FOREIGN KEY (department_id)
    REFERENCES Department(id)
);

-- COURSE
CREATE TABLE Course (
id INT IDENTITY(1,1) PRIMARY KEY,
course_name NVARCHAR(100) NOT NULL,

credits INT NOT NULL
    CHECK (credits > 0),

description NVARCHAR(500),

status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- SEMESTER
CREATE TABLE Semester (
id INT IDENTITY(1,1) PRIMARY KEY,
semester_name NVARCHAR(100) NOT NULL,
academic_year VARCHAR(20) NOT NULL,

start_date DATE NOT NULL,
end_date DATE NOT NULL,

registration_open_date DATETIME NOT NULL,
registration_close_date DATETIME NOT NULL,

cancel_deadline DATETIME NOT NULL,

status VARCHAR(20) NOT NULL DEFAULT 'OPEN'
    CHECK (status IN ('OPEN', 'CLOSED')),

CONSTRAINT CK_Semester_DateRange
    CHECK (start_date < end_date),

CONSTRAINT CK_Semester_RegistrationDate
    CHECK (registration_open_date < registration_close_date),

CONSTRAINT CK_Semester_CancelDeadline
    CHECK (cancel_deadline <= CAST(end_date AS DATETIME))
);

-- COURSE SECTION
CREATE TABLE CourseSection (
id INT IDENTITY(1,1) PRIMARY KEY,

classroom NVARCHAR(100) NOT NULL,

schedule_day INT NOT NULL
    CHECK (schedule_day BETWEEN 2 AND 8),

start_period INT NOT NULL
    CHECK (start_period > 0),

end_period INT NOT NULL,

maximum_students INT NOT NULL
    CHECK (maximum_students > 0),

registered_students INT NOT NULL DEFAULT 0
    CHECK (registered_students >= 0),

status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'INACTIVE')),

semester_id INT NOT NULL,
course_id INT NOT NULL,
lecturer_id INT NOT NULL,

CONSTRAINT CK_CourseSection_Period
    CHECK (end_period >= start_period),

CONSTRAINT FK_CourseSection_Semester
    FOREIGN KEY (semester_id)
    REFERENCES Semester(id),

CONSTRAINT FK_CourseSection_Course
    FOREIGN KEY (course_id)
    REFERENCES Course(id),

CONSTRAINT FK_CourseSection_Lecturer
    FOREIGN KEY (lecturer_id)
    REFERENCES Lecturer(id)
);

-- COURSE REGISTRATION
CREATE TABLE CourseRegistration (
student_id INT NOT NULL,
section_id INT NOT NULL,

registration_date DATETIME NOT NULL
    DEFAULT GETDATE(),

status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED'
    CHECK (status IN ('REGISTERED', 'CANCELED')),

CONSTRAINT PK_CourseRegistration
    PRIMARY KEY (student_id, section_id),

CONSTRAINT FK_CourseRegistration_Student
    FOREIGN KEY (student_id)
    REFERENCES Student(id),

CONSTRAINT FK_CourseRegistration_Section
    FOREIGN KEY (section_id)
    REFERENCES CourseSection(id)
);

-- INDEXES
CREATE INDEX IX_Student_Department
ON Student(department_id);

CREATE INDEX IX_Lecturer_Department
ON Lecturer(department_id);

CREATE INDEX IX_CourseSection_Semester
ON CourseSection(semester_id);

CREATE INDEX IX_CourseSection_Course
ON CourseSection(course_id);

CREATE INDEX IX_CourseSection_Lecturer
ON CourseSection(lecturer_id);

CREATE INDEX IX_CourseRegistration_Student
ON CourseRegistration(student_id);

CREATE INDEX IX_CourseRegistration_Section
ON CourseRegistration(section_id);


-- UPDATE: THÊM MỚI BẢNG RegistrationLog
CREATE TABLE RegistrationLog
(
    id INT IDENTITY(1,1) PRIMARY KEY,

    action_type VARCHAR(20) NOT NULL
        CHECK (action_type IN ('REGISTER', 'CANCEL')),

    action_date DATETIME NOT NULL
        DEFAULT GETDATE(),

    student_id INT NOT NULL,

    section_id INT NOT NULL,

    CONSTRAINT FK_RegistrationLog_Student
        FOREIGN KEY (student_id)
        REFERENCES Student(id),

    CONSTRAINT FK_RegistrationLog_CourseSection
        FOREIGN KEY (section_id)
        REFERENCES CourseSection(id)
);
GO

CREATE INDEX IX_RegistrationLog_Student
ON RegistrationLog(student_id);

CREATE INDEX IX_RegistrationLog_Section
ON RegistrationLog(section_id);

CREATE INDEX IX_RegistrationLog_ActionDate
ON RegistrationLog(action_date);
GO