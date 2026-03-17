# API Testing Checklist - SkillMap AI

This document provides a comprehensive checklist to verify the functionality and robustness of all backend APIs.

## 1. Authentication (`/auth`)

### POST /register
- [ ] **Positive**: Valid email, name, and password (length > 6).
- [ ] **Edge Case**: Email already exists (Expect: `success: false`, `error: "User with this email already exists"`).
- [ ] **Edge Case**: Invalid email format (Expect: 422 Unprocessable Entity).
- [ ] **Edge Case**: Short password (Expect: 422 Unprocessable Entity - Pydantic validation).

### POST /login
- [ ] **Positive**: Correct email and password.
- [ ] **Edge Case**: Incorrect password (Expect: `success: false`, `error: "Invalid credentials"`).
- [ ] **Edge Case**: Non-existent email (Expect: `success: false`, `error: "Invalid credentials"`).

## 2. Profile Management (`/profile`)

### PUT /profile
- [ ] **Positive**: Submit `career_goal`, `skill_level`, `weekly_hours`.
- [ ] **Edge Case**: Negative `weekly_hours` (Expect: 422 Unprocessable Entity).
- [ ] **Edge Case**: Update existing profile (Expect: Successful update, no duplicate created).

### GET /profile
- [ ] **Positive**: Fetch profile for existing user.
- [ ] **Edge Case**: Profile not filled yet (Expect: `success: false`, `error: "Profile not found"`).

## 3. Feasibility & Roadmap

### POST /feasibility/check
- [ ] **Positive**: Submit `weekly_hours: 40` (Expect: "Feasible").
- [ ] **Positive**: Submit `weekly_hours: 5` (Expect: "Not Feasible").
- [ ] **Edge Case**: Submit string instead of int (Expect: 422).

### POST /roadmap/generate
- [ ] **Positive**: Call endpoint (Expect: 4-week structured JSON).

## 4. Assignments & Progress

### GET /assignments
- [ ] **Positive**: Returns list of assignments.
- [ ] **Edge Case**: User with zero assignments (Expect: `data: []`).

### PATCH /assignments/{id}/complete
- [ ] **Positive**: Mark valid ID as completed (Expect: `status: "completed"`).
- [ ] **Edge Case**: Mark non-existent ID (Expect: `success: false`, `error: "Assignment not found"`).

### GET /progress
- [ ] **Positive**: Returns correct percentage (Check: `(completed / total) * 100`).
