from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
from app.api import (
    auth_routes, 
    profile_routes, 
    feasibility_routes, 
    roadmap_routes,
    assignment_routes,
    progress_routes,
    user_routes,
    resource_routes,
    stats_routes,
    community_routes
)
from app.database import engine, Base
from app.core.logger import logger

# Import models for table creation
from app.models import (
    User, 
    Profile, 
    Assignment, 
    Roadmap, 
    RoadmapWeek, 
    Activity, 
    Resource, 
    SavedResource, 
    RoadmapResource, 
    UserSettings,
    CommunityPost,
    PostLike,
    PostComment
)

Base.metadata.create_all(bind=engine)

# Seed the library with resources if empty
from app.services.library_service import seed_resources
from app.services.community_service import seed_community_posts

app = FastAPI(title="SkillMap AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("SkillMap AI API starting up...")
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        seed_resources(db)
        seed_community_posts(db)
    finally:
        db.close()

app.include_router(auth_routes.router)
app.include_router(profile_routes.router)
app.include_router(feasibility_routes.router)
app.include_router(roadmap_routes.router)
app.include_router(assignment_routes.router)
app.include_router(progress_routes.router)
app.include_router(user_routes.router)
app.include_router(resource_routes.router)
app.include_router(stats_routes.router)
app.include_router(community_routes.router)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to SkillMap AI API - Phase 3 (Assignments & Progress Active)"}

@app.get("/health")
def health_check():
    logger.info("Health endpoint accessed")
    return {"status": "ok"}