from sqlalchemy.orm import Session
from app.models.assignment import Assignment
from app.core.logger import logger

def calculate_user_progress(db: Session, user_id: int):
    """Calculate the completion percentage of assignments for a user."""
    logger.info(f"Calculating progress for user_id: {user_id}")
    
    assignments = db.query(Assignment).filter(Assignment.user_id == user_id).all()
    total = len(assignments)
    
    if total == 0:
        return {"total": 0, "completed": 0, "percentage": 0.0}
    
    completed = len([a for a in assignments if a.status == "completed"])
    percentage = (completed / total) * 100
    
    logger.info(f"Progress: {completed}/{total} ({percentage}%)")
    return {
        "total": total,
        "completed": completed,
        "percentage": round(percentage, 2)
    }
