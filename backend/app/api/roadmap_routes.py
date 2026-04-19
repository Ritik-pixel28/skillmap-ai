from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services import roadmap_service
from app.schemas.profile_schema import APIResponse
from app.schemas.roadmap_schema import TaskUpdateSchema
from app.core.logger import logger

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.get("", response_model=APIResponse)
@router.get("/current", response_model=APIResponse)
def get_roadmap(db: Session = Depends(get_db)):
    """Fetch current user's roadmap."""
    try:
        user_id = 1
        roadmap = roadmap_service.get_user_roadmap(db, user_id)
        if not roadmap:
            return APIResponse(success=False, message="No roadmap found. Generate one first.")
        
        return APIResponse(success=True, data=roadmap)
    except Exception as e:
        logger.error(f"Error fetching roadmap: {str(e)}")
        return APIResponse(success=False, error="Internal server error")

@router.post("/generate", response_model=APIResponse)
def generate_roadmap(db: Session = Depends(get_db)):
    """Trigger AI roadmap generation."""
    try:
        user_id = 1 
        roadmap = roadmap_service.generate_user_roadmap(db, user_id)
        return APIResponse(success=True, data=roadmap, message="Roadmap generated successfully")
    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        return APIResponse(success=False, error=str(e))

@router.patch("/task", response_model=APIResponse)
def update_task(payload: TaskUpdateSchema, db: Session = Depends(get_db)):
    """Update task completion status."""
    try:
        user_id = 1
        result = roadmap_service.update_task_status(
            db, user_id, payload.week_number, payload.task_title, payload.completed
        )
        return APIResponse(success=True, message=result["message"])
    except HTTPException as e:
        return APIResponse(success=False, error=e.detail)
    except Exception as e:
        logger.error(f"Error updating task: {str(e)}")
        return APIResponse(success=False, error="Internal server error")
