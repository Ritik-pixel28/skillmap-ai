# ✨ SkillMap AI

### *Empowering Careers through AI-Driven Personalized Roadmaps*

SkillMap AI is a premium, full-stack orchestration platform designed to transform career aspirations into actionable reality. By combining high-fidelity UI/UX with state-of-the-art AI generation, SkillMap provides learners with structured, weekly-focused learning paths, gamified progress tracking, and professional community engagement.

---

## 🚀 Key Features

### 🧠 AI Roadmap Engine
- **Weekly Precision**: Generates intensive 1-3 month plans broken down into weekly execution modules.
- **Dynamic Adaptation**: Refine and regenerate roadmaps based on changing time commitments or skill levels.
- **Structured Tasks**: Each week contains specific, actionable assignments to ensure consistent progress.

### 📊 Professional Dashboard & Stats
- **Velocity Tracking**: Real-time visualization of learning speed and milestone completion.
- **Skill Radar**: Interactive charts mapping your expertise across the target career domain.
- **Global Ranking**: Compete with a community of learners and climb the XP leaderboard.

### 👤 High-Fidelity Workspace
- **Public Profile**: Showcase your bio, rank, role, and historical achievements in a sleek, professional layout.
- **Settings Ecosystem**: Granular control over platform appearance (Dark/Light), AI preferences, and notification channels.

### 📚 Resource Library & Community
- **Curated Content**: Access a hand-picked selection of articles, videos, and courses tailored to your specific goals.
- **Community Feed**: Share milestones, ask questions, and engage with other tech-forward learners.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| **State Management** | Zustand (Persistent & Atomic) |
| **Backend** | FastAPI (Python 3.12+), Pydantic v2 |
| **Database** | SQLite (Dev) / PostgreSQL (Prod), SQLAlchemy 2.0 |
| **AI Layer** | OpenAI GPT-4 API Integration |
| **Security** | JWT (Stateless), Bcrypt Hashing |

---

## 🏗 System Architecture

The project follows a **Modular Service-Oriented Architecture** with strict separation of concerns.

> [!TIP]
> For a deep dive into the system design, check out our **[Premium Architecture Specification](ARCHITECTURE.md)**.

### Directory Structure
```text
skillmap-ai/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI Routes (Auth, Profile, Roadmap, Community)
│   │   ├── models/       # SQLAlchemy Centralized Models
│   │   ├── schemas/      # Pydantic Validation Schemas
│   │   └── services/     # Core Business Logic & AI Orchestration
├── frontend/
│   ├── app/             # Next.js App Router (Dashboard, Settings, Profile)
│   ├── components/      # Atomic UI Components & Layouts
│   ├── lib/store/       # Zustand State Management Engine
│   └── services/        # Frontend API Clients
└── docs/                # Architecture & Design Assets
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.12+
- OpenAI API Key (for roadmap generation)

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend will automatically pick port 3001 if 3000 is occupied.*

---

## 🔒 Security & Data Integrity

- **Stateless Auth**: JWT tokens signed with SHA-256, stored securely for session persistence.
- **Mapper Stability**: Centralized model registration in `app/models/__init__.py` to prevent SQLALchemy circular dependencies.
- **Input Validation**: Zero-trust approach using Pydantic models for every API endpoint.

---

## 👥 Authors

**Ritik Arya & Prakhar Joshi**
*Polaris School of Technology*

---

## 📄 License

This project is developed for academic purposes and high-fidelity prototype demonstration.