from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models.user_settings import UserSettings
from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.activity import Activity
from app.schemas.settings_schema import (
    AppearanceUpdate, 
    NotificationsUpdate, 
    GoalsUpdate, 
    AIPreferencesUpdate, 
    PrivacyUpdate
)
from app.schemas.profile_schema import APIResponse
from app.core.logger import logger
from datetime import datetime
import json

router = APIRouter(prefix="/settings", tags=["Settings"])

def get_or_create_settings(db: Session, user_id: int):
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.get("/", response_model=APIResponse)
def get_all_settings(db: Session = Depends(get_db)):
    try:
        user_id = 1
        settings = get_or_create_settings(db, user_id)
        return APIResponse(success=True, data=settings)
    except Exception as e:
        logger.error(f"Error fetching settings: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.patch("/", response_model=APIResponse)
def update_all_settings(data: dict, db: Session = Depends(get_db)):
    try:
        user_id = 1
        settings = get_or_create_settings(db, user_id)
        for field, value in data.items():
            if hasattr(settings, field):
                setattr(settings, field, value)
        db.commit()
        db.refresh(settings)
        return APIResponse(success=True, data=settings)
    except Exception as e:
        logger.error(f"Error updating global settings: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.patch("/appearance", response_model=APIResponse)
def update_appearance(data: AppearanceUpdate, db: Session = Depends(get_db)):
    try:
        user_id = 1
        settings = get_or_create_settings(db, user_id)
        update_data = data.dict(exclude_none=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        db.commit()
        db.refresh(settings)
        return APIResponse(success=True, data=settings)
    except Exception as e:
        logger.error(f"Error updating appearance: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.patch("/notifications", response_model=APIResponse)
def update_notifications(data: NotificationsUpdate, db: Session = Depends(get_db)):
    try:
        user_id = 1
        settings = get_or_create_settings(db, user_id)
        update_data = data.dict(exclude_none=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        db.commit()
        return APIResponse(success=True, message="Notifications updated")
    except Exception as e:
        logger.error(f"Error updating notifications: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.patch("/goals", response_model=APIResponse)
def update_goals(data: GoalsUpdate, db: Session = Depends(get_db)):
    try:
        user_id = 1
        settings = get_or_create_settings(db, user_id)
        update_data = data.dict(exclude_none=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        db.commit()
        return APIResponse(success=True, message="Goals updated")
    except Exception as e:
        logger.error(f"Error updating goals: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.patch("/ai", response_model=APIResponse)
def update_ai_preferences(data: AIPreferencesUpdate, db: Session = Depends(get_db)):
    try:
        user_id = 1
        settings = get_or_create_settings(db, user_id)
        update_data = data.dict(exclude_none=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        db.commit()
        return APIResponse(success=True, message="AI preferences updated")
    except Exception as e:
        logger.error(f"Error updating AI preferences: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.patch("/privacy", response_model=APIResponse)
def update_privacy(data: PrivacyUpdate, db: Session = Depends(get_db)):
    try:
        user_id = 1
        settings = get_or_create_settings(db, user_id)
        update_data = data.dict(exclude_none=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        db.commit()
        return APIResponse(success=True, message="Privacy updated")
    except Exception as e:
        logger.error(f"Error updating privacy: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.post("/export/json", response_model=APIResponse)
def export_data_json(db: Session = Depends(get_db)):
    try:
        user_id = 1
        user = db.query(User).filter(User.id == user_id).first()
        roadmaps = db.query(Roadmap).filter(Roadmap.user_id == user_id).all()
        activities = db.query(Activity).filter(Activity.user_id == user_id).all()
        settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
        
        export_data = {
            "user": {
                "name": user.name,
                "email": user.email
            },
            "roadmaps": [r.title for r in roadmaps],
            "activities": [a.action for a in activities],
            "settings": settings.__dict__ if settings else {},
            "exported_at": datetime.utcnow().isoformat()
        }
        if "_sa_instance_state" in export_data["settings"]:
            del export_data["settings"]["_sa_instance_state"]
            
        return APIResponse(success=True, data=export_data)
    except Exception as e:
        logger.error(f"Error exporting data: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.delete("/account", response_model=APIResponse)
def delete_account(db: Session = Depends(get_db)):
    try:
        user_id = 1
        db.query(UserSettings).filter(UserSettings.user_id == user_id).delete()
        db.query(Activity).filter(Activity.user_id == user_id).delete()
        db.query(Roadmap).filter(Roadmap.user_id == user_id).delete()
        db.query(User).filter(User.id == user_id).delete()
        db.commit()
        return APIResponse(success=True, message="Account deleted")
    except Exception as e:
        logger.error(f"Error deleting account: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.patch("/password", response_model=APIResponse)
def change_password(data: dict, db: Session = Depends(get_db)):
    try:
        user_id = 1
        user = db.query(User).filter(User.id == user_id).first()
        user.password = data['new_password']
        db.commit()
        return APIResponse(success=True, message="Password updated")
    except Exception as e:
        return APIResponse(success=False, error=str(e))

@router.get("/sessions", response_model=APIResponse)
def get_sessions(db: Session = Depends(get_db)):
    return APIResponse(success=True, data=[
        {"id": "1", "device": "MacBook Pro", "browser": "Chrome", "location": "San Francisco, CA", "lastActive": "Just now"},
        {"id": "2", "device": "iPhone 15", "browser": "Safari", "location": "San Francisco, CA", "lastActive": "2h ago"}
    ])

@router.delete("/sessions/{session_id}", response_model=APIResponse)
def revoke_session(session_id: str, db: Session = Depends(get_db)):
    return APIResponse(success=True, message=f"Session {session_id} revoked")

@router.get("/integrations", response_model=APIResponse)
def get_integrations(db: Session = Depends(get_db)):
    return APIResponse(success=True, data=[
        {"id": "github", "name": "GitHub", "description": "Sync your repositories and code activity", "connected": True},
        {"id": "notion", "name": "Notion", "description": "Export roadmaps directly to your workspace", "connected": False},
        {"id": "gcal", "name": "Google Calendar", "description": "Add roadmap deadlines to your schedule", "connected": False}
    ])

@router.post("/integrations/{provider}/connect", response_model=APIResponse)
def connect_integration(provider: str, db: Session = Depends(get_db)):
    auth_urls = {
        "github": "https://github.com/login/oauth/authorize",
        "notion": "https://www.notion.so/install-integration",
        "gcal": "https://accounts.google.com/o/oauth2/auth"
    }
    return APIResponse(success=True, data={"url": auth_urls.get(provider)})

@router.delete("/integrations/{provider}", response_model=APIResponse)
def disconnect_integration(provider: str, db: Session = Depends(get_db)):
    return APIResponse(success=True, message=f"Disconnected from {provider}")
