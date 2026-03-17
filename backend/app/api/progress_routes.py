from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.profile_schema import APIResponse
from app.schemas.assignment_schema import ProgressResponse
from app.services import progress_service
from app.core.logger import logger

router = APIRouter(prefix="/progress", tags=["Progress Tracking"])

@router.get("", response_model=APIResponse)
def get_progress(db: Session = Depends(get_db)):
    """Fetch user progress (placeholder user_id=1)."""
    try:
        user_id = 1
        progress = progress_service.calculate_user_progress(db, user_id)
        return APIResponse(
            success=True,
            data=ProgressResponse(**progress),
            message="Progress calculated successfully"
        )
    except Exception as e:
        logger.error(f"Error calculating progress: {str(e)}")
        return APIResponse(success=False, error="Internal server error", message="Failed to calculate progress")
