from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.profile_schema import APIResponse
from app.schemas.assignment_schema import AssignmentResponse
from app.services import assignment_service
from app.core.logger import logger
from typing import List

router = APIRouter(prefix="/assignments", tags=["Assignment System"])

@router.get("", response_model=APIResponse)
def get_assignments(db: Session = Depends(get_db)):
    """Get all assignments for the current user (placeholder user_id=1)."""
    try:
        user_id = 1
        assignments = assignment_service.get_user_assignments(db, user_id)
        return APIResponse(
            success=True,
            data=[AssignmentResponse.from_orm(a) for a in assignments],
            message="Assignments fetched successfully"
        )
    except Exception as e:
        logger.error(f"Error fetching assignments: {str(e)}")
        return APIResponse(success=False, error="Internal server error", message="Failed to fetch assignments")

@router.get("/{id}", response_model=APIResponse)
def get_assignment_details(id: int, db: Session = Depends(get_db)):
    """Get specific assignment details."""
    try:
        assignment = assignment_service.get_assignment_by_id(db, id)
        return APIResponse(
            success=True,
            data=AssignmentResponse.from_orm(assignment),
            message="Assignment details fetched"
        )
    except Exception as e:
        logger.error(f"Error fetching assignment {id}: {str(e)}")
        return APIResponse(success=False, error=str(e), message="Failed to fetch assignment")

@router.patch("/{id}/complete", response_model=APIResponse)
def complete_assignment(id: int, db: Session = Depends(get_db)):
    """Mark an assignment as completed."""
    try:
        assignment = assignment_service.mark_assignment_complete(db, id)
        return APIResponse(
            success=True,
            data=AssignmentResponse.from_orm(assignment),
            message="Assignment marked as completed"
        )
    except Exception as e:
        logger.error(f"Error completing assignment {id}: {str(e)}")
        return APIResponse(success=False, error=str(e), message="Failed to complete assignment")
