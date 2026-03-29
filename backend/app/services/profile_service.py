from sqlalchemy.orm import Session
from app.models.profile import Profile
from app.schemas.profile_schema import ProfileCreate
from app.core.logger import logger
from fastapi import HTTPException, status

def create_or_update_profile(db: Session, user_id: int, data: ProfileCreate):
    """Business logic to create or update a user profile."""
    try:
        db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        
        if db_profile:
            logger.info(f"Updating profile for user_id: {user_id}")
            db_profile.education = data.education
            db_profile.career_goal = data.career_goal
            db_profile.skill_level = data.skill_level
            db_profile.weekly_hours = data.weekly_hours
            db_profile.timeline = data.timeline
        else:
            logger.info(f"Creating new profile for user_id: {user_id}")
            db_profile = Profile(
                user_id=user_id,
                education=data.education,
                career_goal=data.career_goal,
                skill_level=data.skill_level,
                weekly_hours=data.weekly_hours,
                timeline=data.timeline
            )
            db.add(db_profile)
        
        db.commit()
        db.refresh(db_profile)
        return db_profile
    except Exception as e:
        logger.error(f"Error in create_or_update_profile: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save profile"
        )

def get_profile(db: Session, user_id: int):
    """Fetch profile for a specific user."""
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        logger.warning(f"Profile not found for user_id: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile
