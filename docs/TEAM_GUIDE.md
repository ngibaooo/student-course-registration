# TEAM GUIDE

## Repository Structure

```text
student-registration-system/
│
├── backend/
├── frontend/
├── database/
│   ├── schema.sql
│   └── seed_data.sql
│
├── docs/
│   ├── api-design.md
│   └── TEAM_GUIDE.md
│
└── README.md
```

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

# Database Setup
1. Install libraries in requirements.txt
```text
pip install -r requirements.txt
```

2. Run:

```text
database/schema.sql
```

3. Then:

```text
database/seed_data.sql
```

* Database name:

```text
StudentRegistrationDB
```
