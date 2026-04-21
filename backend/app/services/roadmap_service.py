from app.core.logger import logger
from app.models.activity import Activity
from app.models.roadmap import Roadmap, RoadmapWeek
from app.models.profile import Profile
from app.services import ai_service
from sqlalchemy.orm import Session
from fastapi import HTTPException

def generate_user_roadmap(db: Session, user_id: int):
    """
    Generates a personalized roadmap, saves it to the database, and returns the result.
    """
    logger.info(f"Generating roadmap for user_id: {user_id}")

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        logger.warning(f"Profile not found for user_id: {user_id}")
        raise HTTPException(status_code=404, detail="User profile not found. Please complete your profile first.")

    # Cap duration at 8 weeks
    profile.timeline = min(profile.timeline, 8)

    try:
        ai_data = ai_service.generate_ai_roadmap(profile)
        db_roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
        if not db_roadmap:
            db_roadmap = Roadmap(user_id=user_id, title=ai_data["title"])
            db.add(db_roadmap)
            db.commit()
            db.refresh(db_roadmap)
        else:
            db_roadmap.title = ai_data["title"]
            db.commit()

        db.query(RoadmapWeek).filter(RoadmapWeek.roadmap_id == db_roadmap.id).delete()
        
        for week_data in ai_data["weeks"]:
            # Inject completed status if missing
            tasks = []
            for t in week_data["tasks"]:
                t["completed"] = False
                tasks.append(t)

            new_week = RoadmapWeek(
                roadmap_id=db_roadmap.id,
                week_number=week_data["week"],
                title=week_data["title"],
                tasks=tasks
            )
            db.add(new_week)
        
        db.commit()
        db.refresh(db_roadmap)
        
        logger.info(f"Successfully saved AI roadmap for user_id: {user_id}")
        
        return get_user_roadmap(db, user_id)

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to generate/save AI roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")

def get_user_roadmap(db: Session, user_id: int):
    """Fetches the roadmap and its weeks for a specific user."""
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
    if not roadmap:
        return None
    
    return {
        "id": roadmap.id,
        "title": roadmap.title,
        "weeks": [
            {
                "id": w.id,
                "week": w.week_number,
                "title": w.title,
                "tasks": w.tasks
            } for w in sorted(roadmap.weeks, key=lambda x: x.week_number)
        ]
    }

def update_task_status(db: Session, user_id: int, week_number: int, task_title: str, completed: bool):
    """Updates the completion status of a specific task within a roadmap week."""
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    week = db.query(RoadmapWeek).filter(
        RoadmapWeek.roadmap_id == roadmap.id,
        RoadmapWeek.week_number == week_number
    ).first()
    
    if not week:
        raise HTTPException(status_code=404, detail="Roadmap week not found")
    
    updated_tasks = []
    found = False
    for task in week.tasks:
        if task['title'] == task_title:
            task['completed'] = completed
            found = True
        updated_tasks.append(task)
    
    if not found:
        raise HTTPException(status_code=404, detail=f"Task '{task_title}' not found in week {week_number}")
    
    from sqlalchemy.orm.attributes import flag_modified
    week.tasks = updated_tasks
    flag_modified(week, "tasks")

    if completed:
        try:
            new_activity = Activity(
                user_id=user_id,
                type="completed",
                action=f"Completed: {task_title}",
                xp=20
            )
            db.add(new_activity)
        except Exception as e:
            from app.core.logger import logger
            logger.error(f"Failed to log activity: {str(e)}")
            # Don't fail the task update if activity logging fails

    db.commit()
    
    return {"success": True, "message": "Task status updated"}
