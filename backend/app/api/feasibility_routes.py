from fastapi import APIRouter, Body
from app.services import feasibility_service
from app.schemas.profile_schema import APIResponse
from app.core.logger import logger

router = APIRouter(prefix="/feasibility", tags=["Feasibility Engine"])

@router.post("/check", response_model=APIResponse)
def check_feasibility(weekly_hours: int = Body(..., embed=True)):
    """Endpoint to check if a goal is feasible based on hours."""
    try:
        result = feasibility_service.calculate_feasibility(weekly_hours)
        return APIResponse(
            success=True,
            data=result,
            message="Feasibility check completed"
        )
    except Exception as e:
        logger.error(f"Error checking feasibility: {str(e)}")
        return APIResponse(success=False, error=str(e), message="Feasibility check failed")
