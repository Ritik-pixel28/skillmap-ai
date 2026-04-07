from app.core.logger import logger
from app.models.roadmap import Roadmap, RoadmapWeek
from sqlalchemy.orm import Session

def generate_dummy_roadmap(db: Session, user_id: int):
    """Generates and saves a dummy structured roadmap."""
    logger.info(f"Generating and saving dummy roadmap for user_id: {user_id}")
    
    # 1. Fetch user's profile for customization
    from app.models.profile import Profile
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    title = f"{profile.career_goal} Mastery Path" if profile else "AI-Powered Career Journey"

    # 1. Create Roadmap Header
    db_roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
    if not db_roadmap:
        db_roadmap = Roadmap(user_id=user_id, title=title)
        db.add(db_roadmap)
        db.commit()
        db.refresh(db_roadmap)
    else:
        db_roadmap.title = title
    
    # 2. Add Weeks
    dummy_data = {
        1: "Learn fundamentals and setup workspace",
        2: "Advanced concepts and practice projects",
        3: "Building portfolio projects",
        4: "Final review and mock interviews"
    }
    
    # Clear existing weeks if any
    db.query(RoadmapWeek).filter(RoadmapWeek.roadmap_id == db_roadmap.id).delete()
    
    for week_num, content in dummy_data.items():
        week = RoadmapWeek(roadmap_id=db_roadmap.id, week_number=week_num, content=content)
        db.add(week)
    
    db.commit()
    db.refresh(db_roadmap)
    
    # Return richer structured data (Updated for SaaS Dashboard Timeline)
    roadmap_weeks = []
    
    # Define tasks with titles and durations as requested
    base_tasks = [
        {"title": "Theory & Concepts", "duration": "2 days"},
        {"title": "Hands-on Exercises", "duration": "2 days"},
        {"title": "Mini Project Build", "duration": "2 days"},
        {"title": "Weekly Review", "duration": "1 day"}
    ]

    for w in db_roadmap.weeks:
        roadmap_weeks.append({
            "week": w.week_number,
            "title": w.content,
            "tasks": base_tasks
        })
    
    return {
        "duration": f"{len(db_roadmap.weeks)} weeks",
        "weeks": roadmap_weeks
    }
