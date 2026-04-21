from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.dependencies import get_db
from app.schemas.profile_schema import APIResponse
from app.schemas.library_schema import SaveResourceRequest, LinkResourceRequest
from app.services import library_service
from app.core.logger import logger

router = APIRouter(prefix="/resources", tags=["Library"])

# Shared user_id placeholder (consistent with the rest of the codebase)
USER_ID = 1


@router.get("", response_model=APIResponse)
def get_all_resources(
    search: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Fetch all resources with optional search/filter."""
    try:
        resources = library_service.get_all_resources(
            db, USER_ID, search=search, type_filter=type, difficulty_filter=difficulty
        )
        return APIResponse(success=True, data=resources)
    except Exception as e:
        logger.error(f"Error fetching resources: {e}")
        return APIResponse(success=False, error="Failed to fetch resources")


@router.get("/recommended", response_model=APIResponse)
def get_recommended_resources(db: Session = Depends(get_db)):
    """Fetch resources recommended based on user's roadmap career goal."""
    try:
        resources = library_service.get_recommended_resources(db, USER_ID)
        return APIResponse(success=True, data=resources)
    except Exception as e:
        logger.error(f"Error fetching recommended resources: {e}")
        return APIResponse(success=False, error="Failed to fetch recommended resources")


@router.get("/saved", response_model=APIResponse)
def get_saved_resources(db: Session = Depends(get_db)):
    """Fetch all resources saved by the current user."""
    try:
        resources = library_service.get_saved_resources(db, USER_ID)
        return APIResponse(success=True, data=resources)
    except Exception as e:
        logger.error(f"Error fetching saved resources: {e}")
        return APIResponse(success=False, error="Failed to fetch saved resources")


@router.post("/save", response_model=APIResponse)
def save_resource(body: SaveResourceRequest, db: Session = Depends(get_db)):
    """Save / bookmark a resource for the current user."""
    try:
        result = library_service.save_resource(db, USER_ID, body.resource_id)
        if not result:
            return APIResponse(success=False, message="Resource already saved or not found")
        return APIResponse(success=True, message="Resource saved successfully")
    except Exception as e:
        logger.error(f"Error saving resource: {e}")
        return APIResponse(success=False, error="Failed to save resource")


@router.delete("/save/{resource_id}", response_model=APIResponse)
def unsave_resource(resource_id: int, db: Session = Depends(get_db)):
    """Remove a saved resource for the current user."""
    try:
        result = library_service.unsave_resource(db, USER_ID, resource_id)
        if not result:
            return APIResponse(success=False, message="Resource was not saved")
        return APIResponse(success=True, message="Resource removed from saved list")
    except Exception as e:
        logger.error(f"Error unsaving resource: {e}")
        return APIResponse(success=False, error="Failed to remove resource")


@router.post("/link", response_model=APIResponse)
def link_resource(body: LinkResourceRequest, db: Session = Depends(get_db)):
    """Link a resource to a specific roadmap week."""
    try:
        result = library_service.link_resource_to_week(db, USER_ID, body.resource_id, body.week_number)
        if not result:
            return APIResponse(success=False, message="Could not link resource — check roadmap and resource exist")
        return APIResponse(success=True, message=f"Resource linked to week {body.week_number}")
    except Exception as e:
        logger.error(f"Error linking resource: {e}")
        return APIResponse(success=False, error="Failed to link resource")
