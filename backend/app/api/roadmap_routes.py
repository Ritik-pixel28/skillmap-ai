from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services import roadmap_service
from app.schemas.profile_schema import APIResponse
from app.core.logger import logger

router = APIRouter(prefix="/roadmap", tags=["Roadmap Generation"])

@router.post("/generate", response_model=APIResponse)
def generate_roadmap(db: Session = Depends(get_db)):
    """
    Endpoint to trigger AI-powered roadmap generation.
    Currently uses internal user_id logic (demo).
    """
    try:
        # TODO: Integrate with actual auth dependency to get current user_id
        user_id = 1 
        
        logger.info(f"Received roadmap generation request for user_id: {user_id}")
        roadmap = roadmap_service.generate_user_roadmap(db, user_id)
        
        return APIResponse(
            success=True,
            data=roadmap,
            message="Roadmap generated successfully using AI"
        )
    except HTTPException as e:
        return APIResponse(success=False, error=e.detail, message="Could not generate roadmap")
    except Exception as e:
        logger.error(f"Unexpected error in roadmap generation: {str(e)}")
        return APIResponse(
            success=False, 
            error="Internal server error", 
            message="An unexpected error occurred during roadmap generation"
        )
