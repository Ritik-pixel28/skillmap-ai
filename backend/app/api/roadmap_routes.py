from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services import roadmap_service
from app.schemas.profile_schema import APIResponse
from app.core.logger import logger

router = APIRouter(prefix="/roadmap", tags=["Roadmap Generation"])

@router.post("/generate", response_model=APIResponse)
def generate_roadmap(db: Session = Depends(get_db)):
    """Endpoint to generate user roadmap."""
    try:
        user_id = 1  # Placeholder for demo
        roadmap = roadmap_service.generate_dummy_roadmap(db, user_id)
        return APIResponse(
            success=True,
            data=roadmap,
            message="Roadmap generated successfully"
        )
    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        return APIResponse(success=False, error=str(e), message="Roadmap generation failed")
