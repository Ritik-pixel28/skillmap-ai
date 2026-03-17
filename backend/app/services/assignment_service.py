from sqlalchemy.orm import Session
from app.models.assignment import Assignment
from app.core.logger import logger
from fastapi import HTTPException, status

def get_user_assignments(db: Session, user_id: int):
    """Fetch all assignments for a specific user."""
    logger.info(f"Fetching assignments for user_id: {user_id}")
    return db.query(Assignment).filter(Assignment.user_id == user_id).all()

def get_assignment_by_id(db: Session, assignment_id: int):
    """Fetch assignment details by ID."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        logger.warning(f"Assignment {assignment_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    return assignment

def mark_assignment_complete(db: Session, assignment_id: int):
    """Update assignment status to completed."""
    assignment = get_assignment_by_id(db, assignment_id)
    logger.info(f"Marking assignment {assignment_id} as completed")
    assignment.status = "completed"
    db.commit()
    db.refresh(assignment)
    return assignment
