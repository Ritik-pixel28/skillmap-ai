# SkillMap AI - Demo Walkthrough Script

Follow these steps to demonstrate the full workflow of the SkillMap AI platform.

## Pre-requisites
1. Database is clean or user `demo@example.com` does not exist.
2. Backend is running: `uvicorn app.main:app --reload`
3. Swagger Docs open: `http://localhost:8000/docs`

---

## Step 1: User Onboarding
1. **API**: `POST /auth/register`
   - **Payload**: `{"name": "Demo User", "email": "demo@example.com", "password": "password123"}`
   - **Goal**: Show success message and user object extraction.

2. **API**: `POST /auth/login`
   - **Payload**: `{"email": "demo@example.com", "password": "password123"}`
   - **Goal**: Show `user_id: 1` returned.

---

## Step 2: Goal Setting
3. **API**: `PUT /profile`
   - **Payload**: `{"career_goal": "Full Stack Engineer", "skill_level": "Beginner", "weekly_hours": 20}`
   - **Goal**: Show that the profile is saved and linked to user ID.

---

## Step 3: Analysis
4. **API**: `POST /feasibility/check`
   - **Payload**: `{"weekly_hours": 20}`
   - **Goal**: Show the calculation result. (20 * 12 = 240 hours. This will show as "Risky" or "Not Feasible" against the 1000-hour requirement).

5. **API**: `POST /roadmap/generate`
   - **Goal**: Display the structured 4-week learning path.

---

## Step 4: Action & Tracking
6. **API**: `GET /assignments`
   - **Goal**: Fetch assignments (empty initially unless seeded).
   - **Seed Action**: (Manual DB insert or additional API call) Create 2 dummy assignments.

7. **API**: `PATCH /assignments/1/complete`
   - **Goal**: Complete one assignment.

8. **API**: `GET /progress`
   - **Goal**: Show completion jumps from 0% to 50%.

---

## Conclusion
"This demonstrates a complete end-to-end flow from registration to career progress tracking using a modular backend architecture."
