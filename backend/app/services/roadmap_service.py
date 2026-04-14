from app.core.logger import logger
from app.models.roadmap import Roadmap, RoadmapWeek
from app.models.profile import Profile
from app.services import ai_service
from sqlalchemy.orm import Session
from fastapi import HTTPException

def generate_user_roadmap(db: Session, user_id: int):
    """
    Generates a personalized roadmap, saves it to the database, and returns the result.
    """
    logger.info(f"Generating roadmap for user_id: {user_id}")

    # 1. Fetch user profile
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        logger.warning(f"Profile not found for user_id: {user_id}")
        raise HTTPException(status_code=404, detail="User profile not found. Please complete your profile first.")

    # Safety check: Cap duration at 8 weeks
    profile.timeline = min(profile.timeline, 8)

    try:
        # 2. Call AI service
        ai_data = ai_service.generate_ai_roadmap(profile)
        
        # 3. Handle Roadmap base entry
        db_roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
        if not db_roadmap:
            db_roadmap = Roadmap(user_id=user_id, title=ai_data["title"])
            db.add(db_roadmap)
            db.commit()
            db.refresh(db_roadmap)
        else:
            db_roadmap.title = ai_data["title"]
            db.commit()

        # 4. Clear existing weeks (clean slate for new generation)
        db.query(RoadmapWeek).filter(RoadmapWeek.roadmap_id == db_roadmap.id).delete()
        
        # 5. Insert new weeks dynamically
        for week_data in ai_data["weeks"]:
            new_week = RoadmapWeek(
                roadmap_id=db_roadmap.id,
                week_number=week_data["week"],
                title=week_data["title"],
                tasks=week_data["tasks"]
            )
            db.add(new_week)
        
        db.commit()
        db.refresh(db_roadmap)
        
        logger.info(f"Successfully saved AI roadmap for user_id: {user_id}")
        
        # 6. Format response for frontend
        return {
            "title": db_roadmap.title,
            "duration": f"{len(db_roadmap.weeks)} weeks",
            "weeks": [
                {
                    "week": w.week_number,
                    "title": w.title,
                    "tasks": w.tasks
                } for w in sorted(db_roadmap.weeks, key=lambda x: x.week_number)
            ]
        }

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to generate/save AI roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")
