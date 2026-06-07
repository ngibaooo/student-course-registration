# TEAM GUIDE

## Repository Structure

```text
student-registration-system/
│
├── backend/
│   └── app/
│       ├── api (chứa endpoint APIs)
│       ├── database (kết nối SQL Server, transaction, session)
│       ├── models (entity mapping - chỉ dùng khi sử dụng SQLAlchemy tự sinh query)
│       ├── repositories (chứa các câu query SQL Server)
│       ├── schemas (validate request frontend gửi lên xem có đủ request không)
│       └── services (xử lí logic nghiệp vụ)
│   └── main.py (start FastAPI)
├── frontend/ 
├── database/ (chứa scripts db - mỗi khi có file nào mới sẽ pull về và copy paste vào sql server và run để đồng bộ db với nhau)
│   ├── schema.sql
│   ├── seed_data.sql
│   ├── functions.sql
│   ├── triggers.sql
│   └── procedures.sql
│
├── docs/ (đọc các file tài liệu trong này để thống nhất cách code với nhau & hiểu về hệ thống)
│   ├── api-design.md
│   └── TEAM_GUIDE.md
│
├── README.md
├── .env.example (file ví dụ để cấu hình môi trường. Khi clone code về đổi tên file này thành .env và đổi DB_SERVER phù hợp với sql server trên máy cá nhân)
├── .gitignore
└── requirements.txt (chứa các thư viện cần thiết cho web. Khi clone về run: pip install -r requirements.txt để IDE tự động cài các thư viện trong đó)
```

## Git Branch Strategy

develop
│
├── feature/leader-registration
├── feature/admin-module
├── feature/student-module
├── feature/frontend
└── feature/documentation

Quy tắc:

- Không commit trực tiếp lên develop.
- Mỗi thành viên chỉ làm việc trên branch của mình.
- Sau khi hoàn thành chức năng, tạo Pull Request vào develop.
- Leader review và merge.
---

# Team Assignment

## TV1 - Bảo (Leader)

### Responsibilities:

* Database Design
* ERD
* schema.sql
* seed_data.sql
* Registration Module
* Registration Transaction
* Cancel Registration Transaction
* GitHub Management
* Code Review
* Merge Pull Request

### Branch:

```text
feature/registration-module
```


## TV2 - Vinh (Admin Backend)

### Responsibilities:

* Student Management APIs
* Course Management APIs
* Semester Management APIs
* Course Section Management APIs

### Branch:

```text
feature/admin-module
```

---

## TV3 - Tài (Student Backend & Authentication)

### Responsibilities:

#### Authentication:
* Login API
* Logout API
* JWT Authentication
* Authorization
#### Student APIs:
* View profile API
* View Opening Course Sections API
* View Course Section Details API
* Search Course Sections API
* View Registered Course Sections API
* View Personal Class Schedule

### Branch:

```text
feature/student-module
```

---

## TV4 - Trí (Frontend)

### Responsibilities:

* Admin UI
* Student UI
* API Integration

### Branch:

```text
feature/frontend
```

---

## TV5 - Tân (Documentation)

### Responsibilities:
* SRS
* Word Report
* PowerPoint
* Testing Support

### Branch:

```text
feature/documentation
```

---

# Git Workflow
## Main branches:

```text
main
develop
```

## Rules:
* Do NOT commit directly to main.
* Do NOT commit directly to develop.
* Work only on your assigned feature branch.
* Create Pull Request into develop.
* Leader reviews and merges.

## Workflow:
```text
feature branch -> Pull Request -> develop -> final merge -> main
```

---

# Commit Message Convention

Examples:
```text
feat: add login api

feat: create course section api

fix: resolve registration bug

docs: update api design

refactor: clean service layer
```

---

## Setup Project

### 1. Clone repository

git clone <repository-url>

### 2. Cài thư viện

pip install -r requirements.txt

### 3. Tạo file môi trường

Copy:

.env.example

thành:

.env

Sau đó chỉnh:

DB_SERVER
DB_NAME
DB_USERNAME
DB_PASSWORD

theo SQL Server trên máy cá nhân.

### 4. Khởi tạo database

Chạy lần lượt:

database/schema.sql

database/seed_data.sql

database/functions.sql

database/triggers.sql

database/procedures.sql
