from fastapi import FastAPI
from app.api import (
    auth_routes, 
    profile_routes, 
    feasibility_routes, 
    roadmap_routes,
    assignment_routes,
    progress_routes
)
from app.database import engine, Base
from app.core.logger import logger

# Import models for table creation
from app.models.user import User
from app.models.profile import Profile
from app.models.assignment import Assignment

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkillMap AI API")

@app.on_event("startup")
async def startup_event():
    logger.info("SkillMap AI API (Phase 3) is starting up...")

# Include all routers
app.include_router(auth_routes.router)
app.include_router(profile_routes.router)
app.include_router(feasibility_routes.router)
app.include_router(roadmap_routes.router)
app.include_router(assignment_routes.router)
app.include_router(progress_routes.router)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to SkillMap AI API - Phase 3 (Assignments & Progress Active)"}