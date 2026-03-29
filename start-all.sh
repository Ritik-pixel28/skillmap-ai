#!/bin/bash

# SkillMap AI - Start All services
# --------------------------------

# 1. Ensure we are in the root directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the skillmap-ai root directory."
    exit 1
fi

echo "🚀 Starting SkillMap AI Services..."

# 2. Cleanup any old processes first
echo "🧹 Clearing existing processes on ports 8000 and 3000..."
kill -9 $(lsof -t -i :8000) 2>/dev/null || true
kill -9 $(lsof -t -i :3000) 2>/dev/null || true

# 3. Start Backend in background
echo "📥 Starting Backend (FastAPI)..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# 4. Start Frontend
echo "💻 Starting Frontend (Next.js)..."
cd frontend

# Optional: Clear Next.js cache if things are stuck
echo "🧹 Clearing Next.js cache..."
rm -rf .next

npm run dev

# Cleanup on exit
trap 'kill $BACKEND_PID' EXIT
