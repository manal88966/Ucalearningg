# 🎓 UcaLearn — E-Learning Platform
### PFE Project | Spring Boot + React | Soutenance 27 Fév 2026

---

## 📁 Project Structure

```
ucalearn/
├── backend/          ← Spring Boot (Java 17)
│   ├── src/main/java/com/ucalearn/
│   │   ├── model/           (User, Course, Lesson, Enrollment, Quiz, Question, QuizResult, ForumPost)
│   │   ├── repository/      (JPA Repositories)
│   │   ├── service/         (AuthService, CourseService, EnrollmentService, QuizService, AdminService)
│   │   ├── controller/      (AuthController, CourseController, EnrollmentController, QuizController, AdminController)
│   │   ├── security/        (JwtUtils, JwtAuthFilter)
│   │   └── config/          (SecurityConfig, CorsConfig, DataInitializer)
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/         ← React 18 + Vite + Tailwind CSS
    └── src/
        ├── pages/           (LoginPage, RegisterPage, StudentDashboard, ProfessorDashboard, AdminDashboard, CoursesPage, QuizPage, ChatbotPage)
        ├── components/      (Sidebar)
        ├── context/         (AuthContext)
        └── services/        (api.js)
```

---

## 🚀 How to Run

### Step 1 — Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
✅ Backend starts at: **http://localhost:8080**
✅ H2 Console: **http://localhost:8080/h2-console** (jdbc:h2:mem:ucalearndb, user: sa, password: empty)

### Step 2 — Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
✅ Frontend starts at: **http://localhost:5173**

---

## 🔑 Test Accounts (auto-created)

| Role      | Email                     | Password   |
|-----------|---------------------------|------------|
| Admin     | admin@ucalearn.ma         | admin123   |
| Professor | k.hassan@ucalearn.ma      | prof123    |
| Student   | sara@ucalearn.ma          | student123 |

---

## 🌐 API Endpoints

### Auth (Public)
| Method | Endpoint              | Description    |
|--------|-----------------------|----------------|
| POST   | /api/auth/login       | Login          |
| POST   | /api/auth/register    | Register       |

### Courses (Public)
| Method | Endpoint                   | Description       |
|--------|----------------------------|-------------------|
| GET    | /api/courses/public        | Get all courses   |
| GET    | /api/courses/public/search | Search courses    |
| GET    | /api/courses/public/{id}   | Get one course    |

### Enrollments (Protected)
| Method | Endpoint                             | Description        |
|--------|--------------------------------------|--------------------|
| POST   | /api/enrollments/enroll              | Enroll in course   |
| GET    | /api/enrollments/student/{id}        | My enrollments     |
| GET    | /api/enrollments/student/{id}/stats  | My stats           |
| PATCH  | /api/enrollments/{id}/progress       | Update progress    |

### Quizzes (Protected)
| Method | Endpoint                           | Description         |
|--------|------------------------------------|---------------------|
| GET    | /api/quizzes/course/{courseId}     | Quizzes for course  |
| GET    | /api/quizzes/{quizId}              | Get one quiz        |
| POST   | /api/quizzes/{quizId}/submit       | Submit quiz answers |
| GET    | /api/quizzes/student/{id}/results  | My quiz results     |

### Admin (Protected)
| Method | Endpoint                      | Description        |
|--------|-------------------------------|--------------------|
| GET    | /api/admin/stats              | Platform stats     |
| GET    | /api/admin/users              | All users          |
| DELETE | /api/admin/users/{id}         | Delete user        |
| PATCH  | /api/admin/users/{id}/toggle  | Enable/disable     |

---

## 🎨 Design System

| Token    | Color     | Usage                         |
|----------|-----------|-------------------------------|
| Flame    | #E8490F   | Primary CTA, active states    |
| Azure    | #2563FF   | Frontend / secondary          |
| Mint     | #00B894   | Success, completed            |
| Gold     | #F0A500   | Warnings, ratings             |
| Ink      | #0A0A0F   | Dark backgrounds              |
| Cream    | #F5F3EE   | Light backgrounds             |

Fonts: **Syne** (headings) + **DM Sans** (body)

---

## 📋 Feature Checklist

- [x] JWT Authentication (Login + Register)
- [x] 3 User Roles (Student, Professor, Admin)
- [x] Student Dashboard with stats
- [x] Professor Dashboard with course management
- [x] Admin Dashboard with user management
- [x] Course Catalog with search & filters
- [x] Course Enrollment system
- [x] Progress tracking (0–100%)
- [x] Quiz system with auto-correction
- [x] Timer for quizzes
- [x] AI Chatbot (UcaBot)
- [x] Logout confirmation modal
- [x] Protected routes
- [x] Responsive design
- [x] Toast notifications
- [x] Test data pre-loaded

---

## 🧠 How to Explain to Jury

### Architecture (say this):
> "Our app uses a REST API architecture. The React frontend communicates with the Spring Boot backend via HTTP requests using JWT tokens for authentication. The backend uses JPA to interact with the H2 database for development."

### Flow (Login example):
```
User clicks "Sign In"
  → LoginPage.jsx: handleSubmit()
  → api.js: authAPI.login({ email, password })
  → HTTP POST → /api/auth/login
  → AuthController.java: login()
  → AuthService.java: authenticate()
  → UserRepository: findByEmail()
  → H2 Database: SELECT * FROM users
  → Return user + JWT token
  → Frontend: stores token in localStorage
  → Redirect to dashboard
```

### Key annotations:
- `@RestController` = handles HTTP requests, returns JSON
- `@Entity` = Java class = database table
- `@JpaRepository` = gives us free CRUD methods
- `@Service` = business logic layer
- `@Autowired` = Spring injects the dependency automatically

---

*Built with ❤️ for UCA PFE 2026*
