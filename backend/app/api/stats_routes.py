from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime
from typing import List

from app.dependencies import get_db
from app.models.activity import Activity
from app.models.profile import Profile
from app.models.roadmap import Roadmap, RoadmapWeek
from app.schemas.profile_schema import APIResponse
from app.core.logger import logger

router = APIRouter(prefix="/stats", tags=["Analytics"])

@router.get("/overview", response_model=APIResponse)
def get_stats_overview(db: Session = Depends(get_db)):
    """Calculates overall progress and XP benchmarks."""
    try:
        user_id = 1
        now = datetime.datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - datetime.timedelta(days=now.weekday())

        # 1. XP Aggregation
        total_xp = db.query(func.sum(Activity.xp)).filter(Activity.user_id == user_id).scalar() or 0
        today_xp = db.query(func.sum(Activity.xp)).filter(
            Activity.user_id == user_id, 
            Activity.created_at >= today_start
        ).scalar() or 0
        week_xp = db.query(func.sum(Activity.xp)).filter(
            Activity.user_id == user_id, 
            Activity.created_at >= week_start
        ).scalar() or 0

        # 2. Roadmap Progress
        roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
        completion_rate = 0
        total_tasks = 0
        completed_tasks = 0
        
        if roadmap:
            weeks = db.query(RoadmapWeek).filter(RoadmapWeek.roadmap_id == roadmap.id).all()
            for week in weeks:
                for task in week.tasks:
                    total_tasks += 1
                    if task.get("completed"):
                        completed_tasks += 1
            if total_tasks > 0:
                completion_rate = round((completed_tasks / total_tasks) * 100)

        # 3. Streak Calculation (simplified)
        # 3. Streak Calculation
        # Fetch unique activity dates
        activities = db.query(Activity.created_at).filter(
            Activity.user_id == user_id
        ).order_by(Activity.created_at.desc()).all()
        
        unique_days = sorted(list(set([a.created_at.date() for a in activities])), reverse=True)
        
        current_streak = 0
        if unique_days:
            today = datetime.date.today()
            if unique_days[0] == today or unique_days[0] == today - datetime.timedelta(days=1):
                temp_date = unique_days[0]
                current_streak = 1
                for i in range(1, len(unique_days)):
                    if unique_days[i] == temp_date - datetime.timedelta(days=1):
                        current_streak += 1
                        temp_date = unique_days[i]
                    else:
                        break

        return APIResponse(success=True, data={
            "totalXp": total_xp,
            "todayXp": today_xp,
            "weeklyXp": week_xp,
            "completionRate": completion_rate,
            "currentStreak": current_streak,
            "totalTasks": total_tasks,
            "completedTasks": completed_tasks,
            "pendingTasks": total_tasks - completed_tasks
        })
    except Exception as e:
        logger.exception(f"Error fetching stats overview: {str(e)}")
        return APIResponse(success=False, error=f"Internal server error: {str(e)}")

@router.get("/xp-history", response_model=APIResponse)
def get_xp_history(days: int = 7, db: Session = Depends(get_db)):
    """Returns XP grouped by date for the specified number of days."""
    try:
        user_id = 1
        history_days = []
        for i in range(days - 1, -1, -1):
            date = (datetime.date.today() - datetime.timedelta(days=i))
            history_days.append(date)

        history = []
        for day in history_days:
            day_start = datetime.datetime.combine(day, datetime.time.min)
            day_end = datetime.datetime.combine(day, datetime.time.max)
            
            xp = db.query(func.sum(Activity.xp)).filter(
                Activity.user_id == user_id,
                Activity.created_at >= day_start,
                Activity.created_at <= day_end
            ).scalar() or 0
            
            history.append({
                "date": day.strftime("%a") if days <= 7 else day.strftime("%m/%d"),
                "xp": xp,
                "fullDate": day.isoformat()
            })
            
        return APIResponse(success=True, data=history)
    except Exception as e:
        logger.error(f"Error fetching XP history: {str(e)}")
        return APIResponse(success=False, error="Failed to fetch XP history")

@router.get("/skills-breakdown", response_model=APIResponse)
def get_skills_breakdown(db: Session = Depends(get_db)):
    """Fetch skills breakdown from profile."""
    try:
        user_id = 1
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        
        # Consistent with dashboard logic
        default_skills = {
            "frontend": 70,
            "backend": 60,
            "database": 50,
            "devops": 40,
            "system_design": 45
        }
        
        skills = profile.skills if (profile and profile.skills) else default_skills
        target = {k: v + 15 for k, v in skills.items()}
        
        return APIResponse(success=True, data={
            "current": skills,
            "target": target
        })
    except Exception as e:
        logger.error(f"Error fetching skills breakdown: {str(e)}")
        return APIResponse(success=False, error="Failed to fetch skills breakdown")

@router.get("/category-performance", response_model=APIResponse)
def get_category_performance(db: Session = Depends(get_db)):
    """Aggregates performance by task tags (category)."""
    try:
        user_id = 1
        roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
        
        # Categories we want to track
        stats = {
            "Frontend": {"completed": 0, "total": 0},
            "Backend": {"completed": 0, "total": 0},
            "Database": {"completed": 0, "total": 0},
            "DevOps": {"completed": 0, "total": 0},
            "General": {"completed": 0, "total": 0}
        }
        
        if roadmap:
            weeks = db.query(RoadmapWeek).filter(RoadmapWeek.roadmap_id == roadmap.id).all()
            for week in weeks:
                for task in week.tasks:
                    tag = task.get("tag", "General")
                    # Normalize tag to our tracked categories
                    category = "General"
                    for key in stats.keys():
                        if key.lower() in tag.lower():
                            category = key
                            break
                    
                    stats[category]["total"] += 1
                    if task.get("completed"):
                        stats[category]["completed"] += 1
        
        # Transform for chart
        result = []
        for cat, data in stats.items():
            percentage = 0
            if data["total"] > 0:
                percentage = round((data["completed"] / data["total"]) * 100)
            
            # Only include if there are tasks in that category
            if data["total"] > 0:
                result.append({
                    "category": cat,
                    "percentage": percentage,
                    "completed": data["completed"],
                    "total": data["total"]
                })
        
        # Sort by percentage
        result = sorted(result, key=lambda x: x["percentage"], reverse=True)
        
        return APIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Error fetching category performance: {str(e)}")
        return APIResponse(success=False, error="Failed to fetch category performance")

@router.get("/heatmap", response_model=APIResponse)
def get_heatmap_data(db: Session = Depends(get_db)):
    """Returns activity intensity for the last 14 days."""
    try:
        user_id = 1
        history = []
        for i in range(13, -1, -1):
            date = (datetime.date.today() - datetime.timedelta(days=i))
            day_start = datetime.datetime.combine(date, datetime.time.min)
            day_end = datetime.datetime.combine(date, datetime.time.max)
            
            xp = db.query(func.sum(Activity.xp)).filter(
                Activity.user_id == user_id,
                Activity.created_at >= day_start,
                Activity.created_at <= day_end
            ).scalar() or 0
            
            history.append({
                "date": date.isoformat(),
                "xp": xp,
                "intensity": min(xp // 20, 4) # Scale 0-4
            })
            
        return APIResponse(success=True, data=history)
    except Exception as e:
        logger.exception(f"Error fetching heatmap: {str(e)}")
        return APIResponse(success=False, error="Failed to fetch heatmap data")

@router.get("/insights", response_model=APIResponse)
def get_insights(db: Session = Depends(get_db)):
    """Generates personalized analytics insights."""
    try:
        user_id = 1
        insights = []
        
        # 1. Momentum Insight
        today = datetime.datetime.utcnow()
        week_this_start = today - datetime.timedelta(days=7)
        week_last_start = today - datetime.timedelta(days=14)
        
        xp_this_week = db.query(func.sum(Activity.xp)).filter(
            Activity.user_id == user_id, Activity.created_at >= week_this_start
        ).scalar() or 0
        
        xp_last_week = db.query(func.sum(Activity.xp)).filter(
            Activity.user_id == user_id, 
            Activity.created_at >= week_last_start,
            Activity.created_at < week_this_start
        ).scalar() or 0
        
        if xp_this_week > xp_last_week:
            growth = 0
            if xp_last_week > 0:
                growth = round(((xp_this_week - xp_last_week) / xp_last_week) * 100)
            insights.append({
                "type": "momentum",
                "text": f"Your learning momentum is up by {growth}% this week! 🚀",
                "positive": True
            })
        elif xp_this_week < xp_last_week:
            insights.append({
                "type": "momentum",
                "text": "Consistency dropped slightly compared to last week. Keep pushing!",
                "positive": False
            })
            
        # 2. Strength Insight
        # (Reusing category performance logic for a quick insight)
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        if profile and profile.skills:
            best_skill = max(profile.skills, key=profile.skills.get)
            insights.append({
                "type": "strength",
                "text": f"You are showing exceptional strength in {best_skill.title()}.",
                "positive": True
            })

        # Default fallback
        if not insights:
            insights.append({
                "type": "general",
                "text": "Complete more tasks to unlock personalized AI insights.",
                "positive": True
            })

        return APIResponse(success=True, data=insights)
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        return APIResponse(success=False, error="Failed to generate insights")
