from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models.activity import Activity
from app.models.profile import Profile
from app.schemas.profile_schema import APIResponse
from app.core.logger import logger
import datetime

router = APIRouter(prefix="/user", tags=["User Dashboard"])

@router.get("/skills", response_model=APIResponse)
def get_user_skills(db: Session = Depends(get_db)):
    """Fetch user skill metrics for radar chart."""
    try:
        user_id = 1
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        
        default_skills = {
            "frontend": 70,
            "backend": 60,
            "database": 50,
            "devops": 40,
            "system_design": 45
        }
        
        skills = profile.skills if (profile and profile.skills) else default_skills
        
        target_skills = {k: v + 15 for k, v in skills.items()}
        
        return APIResponse(success=True, data={
            "current": skills,
            "target": target_skills
        })
    except Exception as e:
        logger.error(f"Error fetching skills: {str(e)}")
        return APIResponse(success=False, error="Internal server error")

@router.get("/activity", response_model=APIResponse)
def get_activity(db: Session = Depends(get_db)):
    """Fetch user activity feed."""
    try:
        user_id = 1
        activities = db.query(Activity).filter(Activity.user_id == user_id).order_by(Activity.created_at.desc()).limit(10).all()
        
        data = [
            {
                "id": a.id,
                "type": a.type,
                "action": a.action,
                "xp": a.xp,
                "timestamp": a.created_at.isoformat(),
                "time": "Just now"
            } for a in activities
        ]
        
        if not data:
            now = datetime.datetime.utcnow().isoformat()
            data = [
                {"id": 1, "type": "completed", "action": "Completed week 3 roadmap", "xp": 20, "timestamp": now, "time": "2h ago"},
                {"id": 2, "type": "started", "action": "Started 'System Design' module", "xp": 10, "timestamp": now, "time": "5h ago"},
                {"id": 3, "type": "started", "action": "Updated profile expertise", "xp": 5, "timestamp": now, "time": "1d ago"},
            ]

        return APIResponse(success=True, data=data)
    except Exception as e:
        logger.error(f"Error fetching activity: {str(e)}")
        return APIResponse(success=False, error="Internal server error")
