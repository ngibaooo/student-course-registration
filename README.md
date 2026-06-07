# Student Course Registration System

A web-based system that allows students to register and cancel course sections during an academic semester. The system also provides administrative functions for managing students, courses, semesters, and course sections.

---

## Project Overview

The Student Course Registration System is developed as a Database Management Systems course project.

The system supports two main roles:

### Student

* Login to the system
* View personal information
* View available course sections
* Search courses
* Register for course sections
* Cancel course registrations
* View registered courses
* View personal study schedule

### Administrator

* Manage students
* Manage courses
* Manage semesters
* Manage course sections
* Control registration periods

---

## Technology Stack

| Layer           | Technology            |
| --------------- | --------------------- |
| Backend         | Python, FastAPI       |
| Database        | Microsoft SQL Server  |
| Frontend        | HTML, CSS, JavaScript |
| Authentication  | JWT                   |
| API Testing     | Postman               |
| Version Control | Git & GitHub          |

---

## Project Structure

```text
student-course-registration/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── database/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   │
│   └── main.py
│
├── frontend/
│
├── database/
│   ├── schema.sql
│   ├── seed_data.sql
│   ├── procedures.sql
│   ├── functions.sql
│   └── triggers.sql
│
├── docs/
│   ├── api-design.md
│   └── TEAM_GUIDE.md
│
├── README.md
├── .env.example
├── .gitignore
└── requirements.txt
```

---

## Documentation

### Team Guide

Detailed team responsibilities, branch strategy, coding conventions, and project workflow:

```text
docs/TEAM_GUIDE.md
```

### API Design

System API specifications:

```text
docs/api-design.md
```

---

## Database

Database scripts are located in:

```text
database/
```

Files:

| File           | Description                       |
| -------------- | --------------------------------- |
| schema.sql     | Create database schema and tables |
| seed_data.sql  | Insert sample data                |
| procedures.sql | Stored Procedures                 |
| functions.sql  | SQL Functions                     |
| triggers.sql   | SQL Triggers                      |

---

## Setup Guide

### 1. Clone Repository

```bash
git clone <repository-url>
cd student-course-registration
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy:

```text
.env.example
```

to:

```text
.env
```

Example:

```env
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=StudentRegistrationDB
DB_USERNAME=your_username
DB_PASSWORD=your_password

SECRET_KEY=your_secret_key
```

---

### 4. Initialize Database

Run the following scripts in SQL Server Management Studio:

```text
database/schema.sql
database/seed_data.sql
```

If available:

```text
database/functions.sql
database/procedures.sql
database/triggers.sql
```

---

### 5. Run Backend Server

Instructions will be updated after backend structure is completed.

---

## Git Workflow

### Main Branches

```text
main
└── develop
```

### Feature Branches

```text
feature/registration-module
feature/admin-module
feature/student-module
feature/frontend
feature/documentation
```

Rules:

* Do not commit directly to `develop`.
* Each member works on their assigned branch.
* Create a Pull Request before merging into `develop`.
* Leader reviews and merges code.

---

## Academic Purpose

This project is developed for educational purposes as part of the Database Management Systems course.

The project emphasizes:

* Database Design (ERD)
* SQL Server
* Constraints
* Stored Procedures
* Functions
* Triggers
* Transactions
* API Development
* Team Collaboration

## Team Members

| No  | Full Name | Student ID | Responsibility                                                              | Contribution (%) |
| --- | --------- | ---------- | --------------------------------------------------------------------------- | ---------------- |
| TV1 | Ngô Gia Bảo       | 079205011307| Database Design, Registration Module, Git Management, Team Support (Leader) |               |
| TV2 | Nguyễn Quang Vinh       |         | Admin Module (Backend APIs & Business Logic)                                |               |
| TV3 | Trần Tấn Tài      |         | Student Module & Authentication (Backend APIs & Business Logic)             |               |
| TV4 | Trần Lê Quốc Trí       |         | Frontend Development (Admin & Student Interfaces)                           |               |
| TV5 | Nguyễn Hoàng Thiên Tân   |         | Documentation, SRS, PowerPoint, Testing Support                           |               |

**Notes**

* Contribution percentage will be updated after project completion.
* Responsibilities may be adjusted during development if necessary.
* Leader is responsible for task coordination, code integration, and final review.
