from fastapi import APIRouter
from app.services import roadmap_service
from app.schemas.profile_schema import APIResponse
from app.core.logger import logger

router = APIRouter(prefix="/roadmap", tags=["Roadmap Generation"])

@router.post("/generate", response_model=APIResponse)
def generate_roadmap():
    """Endpoint to generate user roadmap."""
    try:
        roadmap = roadmap_service.generate_dummy_roadmap()
        return APIResponse(
            success=True,
            data=roadmap,
            message="Roadmap generated successfully"
        )
    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        return APIResponse(success=False, error=str(e), message="Roadmap generation failed")
