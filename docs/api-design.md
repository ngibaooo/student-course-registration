# API DESIGN DOCUMENT

## Base URL
http://localhost:5000/api

# 1. Authentication APIs
## 1.1 Login
### Endpoint
POST /auth/login

### Request Body
```json
{
  "email": "student01@gmail.com",
  "password": "123456"
}
```

### Response
```json
{
  "message": "Login successful",
  "role": "STUDENT",
  "user_id": 1,
  "token": "jwt_token"
}
```

## 1.2 Logout
### Endpoint
POST /auth/logout

# 2. Student APIs
## 2.1 View Personal Information
### Endpoint
GET /students/profile

### Response
```json
{
  "id": 1,
  "full_name": "Nguyen Van A",
  "gender": "...",
  "date_of_birth": "...",
  "email": "a@gmail.com",
  "phone": "0123456789",
  "address": "...",
  "department": "Information Technology"
}
```

## 2.2 View Open Course Sections
GET /course-sections/open

## 2.3 View Course Section Detail
GET /course-sections/{id}

## 2.4 Search Course Sections
GET /course-sections/search?keyword=name

## 2.5 View Registered Course Sections
GET /registrations

## 2.6 Register Course Section
POST /registrations

## 2.7 Cancel Registration

### Endpoint
DELETE /registrations

## 2.8 View Personal Schedule
### Endpoint
GET /students/schedule

# 3. Admin - Student Management APIs
## 3.1 Get All Students
GET /admin/students

## 3.2 Get Student By Id
GET /admin/students/{id}

## 3.3 Create Student Account
POST /admin/students

## 3.4 Update Student
PUT /admin/students/{id}

## 3.5 Lock Student Account
PATCH /admin/students/{id}/lock

## 3.6 Unlock Student Account
PATCH /admin/students/{id}/unlock

## 3.7 Search Student by Name
GET /admin/students/search?keyword=name

# 4. Admin - Course Management APIs
## 4.1 Get All Courses
GET /admin/courses

## 4.2 Get Course By Id
GET /admin/courses/{id}

## 4.3 Create Course
POST /admin/courses

## 4.4 Update Course
PUT /admin/courses/{id}

## 4.5 Disable Course
PATCH /admin/courses/{id}/disable

## 4.6 Search Course
GET /admin/courses/search?keyword=name

# 5. Admin - Semester Management APIs
## 5.1 Get All Semesters
GET /admin/semesters

## 5.2 Get Semester By Id
GET /admin/semesters/{id}

## 5.3 Create Semester
POST /admin/semesters

## 5.4 Update Semester
PUT /admin/semesters/{id}

## 5.5 Open Semester
PATCH /admin/semesters/{id}/open

## 5.6 Close Semester
PATCH /admin/semesters/{id}/close

# 6. Admin - Course Section Management APIs
## 6.1 Get All Course Sections
GET /admin/course-sections

## 6.2 Get Course Section By Id
GET /admin/course-sections/{id}

## 6.3 Create Course Section
POST /admin/course-sections

## 6.4 Update Course Section
PUT /admin/course-sections/{id}

## 6.5 Disable Course Section
PATCH /admin/course-sections/{id}/disable

## 6.6 Search Course Section
GET /admin/course-sections/search?keyword=name

# 7. Admin - Registration Management APIs
## 7.1 View Registration List By Course Section
GET /admin/course-sections/{id}/registrations

## 7.2 View Student Registration History
GET /admin/students/{id}/registrations

## 7.3 Statistics By Course Section
GET /admin/statistics/course-sections

## 7.4 Statistics By Semester
GET /admin/statistics/semesters

