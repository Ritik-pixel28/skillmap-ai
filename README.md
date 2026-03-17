#SkillMap AI
### Personalized AI Career Roadmap & Assignment Platform

SkillMap AI is an AI-powered career planning platform that generates structured, personalized learning roadmaps based on user goals, skill levels, and time availability.

It helps users:

- Evaluate career feasibility
- Generate AI-driven learning roadmaps
- Complete structured weekly assignments
- Track progress and learning streaks
- Receive milestone and reminder notifications

---

## Problem Statement

Many learners struggle with:
- Unstructured learning paths
- Unrealistic career timelines
- Lack of progress tracking
- No accountability system

SkillMap AI solves this by combining:
- Feasibility logic
- AI roadmap generation
- Assignment tracking
- Gamified progress system

---

## Core Features

### Authentication
- User registration and login (JWT-based)
- Secure password hashing
- Role-based access (User/Admin)

### Profile Management
- Education level
- Skill level
- Career goal
- Weekly study hours

### Feasibility Engine
- Calculates required vs available learning hours
- Returns:
  - Feasible
  - Risky
  - Not Feasible

### AI Roadmap Generation
- AI-generated structured weekly roadmap
- Stored in database
- Regeneration support

### Assignment System
- Weekly tasks
- GitHub/demo submission support
- Completion tracking

### Progress & Dashboard
- Completion percentage
- Learning streak
- Milestone tracking
- Dashboard analytics

### Notifications
- Email reminders
- Weekly summaries
- In-app notifications

### Admin Dashboard
- Total users
- Active users
- Completion analytics
- Feasibility distribution

---

## Tech Stack

### Frontend
- Next.js (TypeScript)
- Tailwind CSS

### Backend
- FastAPI
- SQLAlchemy ORM
- Pydantic validation
- JWT Authentication

### Database
- PostgreSQL

### AI Integration
- OpenAI API (Structured JSON Roadmap Generation)

### Background Services
- APScheduler
- SMTP Email Service

### Deployment
- Docker & Docker Compose

---

## Project Structure

### Root Folder
skillmap-ai/
│
├── backend/
├── frontend/
├── docker-compose.yml
├── .env
├── .gitignore
├── README.md

### Backend Structure
backend/
│
├── app/
│   │
│   ├── main.py                # FastAPI entry point
│   ├── config.py              # Environment & settings management
│   ├── database.py            # DB connection + session
│   ├── dependencies.py        # Shared dependencies (auth, db session)
│
│   ├── core/                  # Core utilities
│   │   ├── security.py        # JWT + password hashing
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │
│   ├── models/                # SQLAlchemy Models (DB Tables)
│   │   ├── user.py
│   │   ├── profile.py
│   │   ├── feasibility.py
│   │   ├── roadmap.py
│   │   ├── roadmap_week.py
│   │   ├── assignment.py
│   │   ├── submission.py
│   │   ├── progress.py
│   │   ├── notification.py
│   │   ├── milestone.py
│   │
│   ├── schemas/               # Pydantic Request/Response Schemas
│   │   ├── auth_schema.py
│   │   ├── profile_schema.py
│   │   ├── feasibility_schema.py
│   │   ├── roadmap_schema.py
│   │   ├── assignment_schema.py
│   │   ├── progress_schema.py
│   │   ├── notification_schema.py
│   │
│   ├── api/                   # Route Grouping
│   │   ├── auth_routes.py
│   │   ├── profile_routes.py
│   │   ├── feasibility_routes.py
│   │   ├── roadmap_routes.py
│   │   ├── assignment_routes.py
│   │   ├── progress_routes.py
│   │   ├── notification_routes.py
│   │   ├── admin_routes.py
│   │
│   ├── services/              # Business Logic Layer
│   │   ├── auth_service.py
│   │   ├── profile_service.py
│   │   ├── feasibility_service.py
│   │   ├── roadmap_service.py
│   │   ├── ai_service.py
│   │   ├── assignment_service.py
│   │   ├── progress_service.py
│   │   ├── notification_service.py
│   │   ├── email_service.py
│   │
│   ├── scheduler/             # Background Jobs
│   │   ├── reminder_jobs.py
│   │   ├── weekly_summary.py
│   │
│   ├── utils/
│   │   ├── helpers.py
│   │
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_feasibility.py
│   │   ├── test_roadmap.py
│
├── requirements.txt
├── Dockerfile
├── .env


### Frontend Structure
frontend/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │
│   ├── roadmap/
│   │   ├── page.tsx
│   │   ├── [roadmapId]/page.tsx
│   │
│   ├── assignments/
│   │   ├── page.tsx
│   │   ├── [assignmentId]/page.tsx
│   │
│   ├── profile/
│   │   ├── page.tsx
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── roadmap/
│   ├── assignments/
│   ├── charts/
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── utils.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useRoadmap.ts
│
├── types/
│   ├── user.ts
│   ├── roadmap.ts
│   ├── assignment.ts
│
├── context/
│   ├── AuthContext.tsx
│
├── services/
│   ├── authService.ts
│   ├── roadmapService.ts
│   ├── assignmentService.ts
│
├── Dockerfile
├── .env.local



---

## Setup Instructions

### 1.Clone Repository
git clone https://github.com/ritik/skillmap-ai.git
cd skillmap-ai

---

### 2.Backend Setup 
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app –reload

---

### 3.Frontend Setup
cd frontend
npm install
npm run dev

---

### 4.Environment Variables

#### Backend (.env)
DATABASE_URL=postgresql://username:password@localhost:5432/skillmap
SECRET_KEY=your_secret_key

#### Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

---


## Security Practices

- JWT-based stateless authentication
- Password hashing using bcrypt
- Input validation with Pydantic
- Role-based route protection
- Environment-based secret management

---

## Architecture Principles

- Modular architecture
- Separation of concerns
- Stateless backend
- AI orchestration layer
- Production-ready RESTful API structure
- Docker-based containerization

---

## Current Status

✅ Git repository initialized  
✅ Basic project scaffolding completed  
✅ Backend health endpoint implemented  
🚧 Feature development in progress  

---

## Author

**Ritik Arya and  Prakhar Joshi**  
Computer Science Students  
Polaris School of Technology  

---

## License

This project is for academic and learning purposes.