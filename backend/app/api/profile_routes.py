from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.profile_schema import ProfileCreate, ProfileResponse, APIResponse
from app.services import profile_service
from app.core.logger import logger

router = APIRouter(prefix="/profile", tags=["Profile Management"])

@router.get("", response_model=APIResponse)
def get_user_profile(db: Session = Depends(get_db)):
    """Fetch user profile (user_id=1 as placeholder)."""
    try:
        user_id = 1 # Placeholder until JWT implementation
        profile = profile_service.get_profile(db, user_id)
        return APIResponse(
            success=True,
            data=ProfileResponse.from_orm(profile),
            message="Profile fetched successfully"
        )
    except HTTPException as e:
        return APIResponse(success=False, error=e.detail, message="Profile fetch failed")
    except Exception as e:
        logger.error(f"Unexpected error in GET /profile: {str(e)}")
        return APIResponse(success=False, error="Internal server error", message="Unexpected error")

@router.put("", response_model=APIResponse)
def update_user_profile(data: ProfileCreate, db: Session = Depends(get_db)):
    """Create or update user profile (user_id=1 as placeholder)."""
    try:
        user_id = 1 # Placeholder until JWT implementation
        profile = profile_service.create_or_update_profile(db, user_id, data)
        return APIResponse(
            success=True,
            data=ProfileResponse.from_orm(profile),
            message="Profile updated successfully"
        )
    except Exception as e:
        logger.error(f"Error in PUT /profile: {str(e)}")
        return APIResponse(success=False, error=str(e), message="Profile update failed")
