# SkillMap AI - Low-Level Design (LLD)

This document contains the core architectural blueprints for the SkillMap AI platform. It is designed to be easily accessible for developers and serves as the source of truth for the system's execution flow.

## ⚡ Unified System Flow

```mermaid
flowchart TD
    %% --- FRONTEND BLOCK ---
    subgraph FRONTEND ["FRONTEND (Next.js 14)"]
        subgraph UI_COMP ["UI COMPONENTS"]
            direction LR
            RV[Roadmap View]
            DB[Dashboard]
            SV[Stats View]
            EV[Settings View]
        end
        
        subgraph STYLING ["STYLING"]
            direction LR
            FM[Framer Motion]
            TW[Tailwind CSS]
        end
        
        subgraph STATE ["STATE MANAGEMENT"]
            direction LR
            ST_S[Stats Store]
            RM_S[Roadmap Store]
            PR_S[Profile Store]
            SE_S[Settings Store]
        end
    end

    %% --- API LAYER ---
    subgraph API_LAYER ["API LAYER"]
        AL_CORE{{lib/api.ts}}
        AL_AUTH{{Auth Service}}
    end

    %% --- BACKEND BLOCK ---
    subgraph BACKEND ["BACKEND (FastAPI)"]
        subgraph ROUTES ["ROUTES"]
            direction LR
            R_RM[roadmap]
            R_ST[stats]
            R_SE[settings]
            R_AU[auth]
        end
        
        subgraph VALIDATION ["VALIDATION"]
            SCH[Schemas / Pydantic]
        end
        
        subgraph SERVICES ["SERVICES"]
            direction LR
            S_PR[Profile Service]
            S_RM[Roadmap Service]
            S_AI[AI Service]
        end
        
        subgraph DEPS ["DEPENDENCIES"]
            direction LR
            D_DB[get_db]
            D_AU[Auth Middleware]
        end
    end

    %% --- SECURITY ---
    subgraph SECURITY ["SECURITY"]
        direction LR
        S_JWT[JWT - 7 Days]
        S_BC[Bcrypt]
    end

    %% --- DATABASE ---
    subgraph DATABASE ["DATABASE (SQLAlchemy)"]
        U([User])
        U --- US([UserSettings])
        U --- UP([Profile])
        U --- UR([Roadmap])
        U --- UA([Activity])
        UR --- RW([RoadmapWeek])
    end

    %% --- EXTERNAL ---
    LLM_PROV[LLM Provider / OpenAI]

    %% --- FLOWS ---
    UI_COMP <--> STATE
    STATE <--> AL_CORE
    AL_CORE <--> R_RM & R_ST & R_SE & R_AU
    R_AU --- AL_AUTH
    
    R_RM & R_ST & R_SE & R_AU --- SCH
    SCH --- SERVICES
    SERVICES --- DEPS
    
    DEPS --- DATABASE
    S_AI <--> LLM_PROV
    SERVICES --- SECURITY
```

---




## 📘 Architectural Overview

### 1. Frontend
- **Framework**: Next.js (App Router)
- **State Management**: Zustand (Atomic & Persistent)
- **Visuals**: Framer Motion for premium animations.

### 2. Backend
- **Core**: FastAPI (Asynchronous Python)
- **Data Validation**: Pydantic Models
- **Auth**: Stateless JWT-based security.

### 3. Data layer
- **ORM**: SQLAlchemy
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Schema**: Centralized User entity with secondary Profile, Settings, and Roadmap extensions.

---

## 🛠 Project Execution Flow
1. **User Request**: Component -> Zustand Action.
2. **Network**: Zustand -> `apiRequest` (lib/api.ts) -> FastAPI Route.
3. **Logic**: Route -> Schema Validation -> Service Logic.
4. **Persistence**: Service -> SQLAlchemy -> Database Update.
5. **Feedback**: 200 OK -> UI State Update.




## 🛤 User Journey & Experience Flow

This section maps the paths a user takes through the SkillMap platform to achieve their career goals.

### 1. The "First Impression" Flow (Auth & Onboarding)
```mermaid
graph LR
    Start([Landing Page]) --> Auth{Sign In/Up}
    Auth -->|Register| Setup[Profile Setup UI]
    Auth -->|Login| Dash[Dashboard]
    Setup --> Goal[Define Career Goal]
    Goal --> Skill[Select Current Level]
    Skill --> Generative[Generate Initial Roadmap]
    Generative --> Dash
```

### 2. The Core Learning Loop (Daily Workflow)
```mermaid
graph TD
    Entry[Enter Dashboard] --> Analysis[View Current Progress & Stats]
    Analysis --> Action{Take Action}
    Action --> Tasks[Execute Weekly Tasks]
    Action --> Library[Explore Saved Resources]
    Tasks --> Complete[Mark Task Done]
    Complete --> XP[Gain Experience / Update Heatmap]
    XP --> Analysis
```

### 3. Progressive Growth (Roadmap Refinement)
```mermaid
graph TD
    Monitor[Monitor Stats] --> Insight[Recieve AI Insight]
    Insight --> Adjust{Feeling Stuck?}
    Adjust -->|Yes| Regenerate[Request AI Roadmap Refinement]
    Adjust -->|No| Continue[Stay on Path]
    Regenerate --> NewPath[New Weekly Schedule]
```

## 🛠 Feature-Specific Logic

| Flow | Logic |
| :--- | :--- |
| **Authentication** | Stateless JWT (stored in cookies/local storage) |
| **Roadmap Generation** | Intensive WEEKLY structure (1-3 month horizon) |
| **Gamification** | Real-time XP awarding based on task complexity |
| **Insights** | AI-driven analysis of heatmap and completion rates |

