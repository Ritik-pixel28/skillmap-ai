from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from typing import List, Optional
import datetime

from app.models.community import CommunityPost, PostLike, PostComment
from app.models.user import User
from app.models.profile import Profile
from app.models.activity import Activity
from app.models.roadmap import Roadmap, RoadmapWeek
from app.core.logger import logger


# ─────────────────────────────────────────────────────────────────────────────
#  Seed Data — diverse "community" posts from multiple fake users
# ─────────────────────────────────────────────────────────────────────────────
SEED_USERS = [
    {"name": "Ananya Sharma", "email": "ananya@demo.skillmap.ai", "password": "demo"},
    {"name": "Rahul Verma", "email": "rahul@demo.skillmap.ai", "password": "demo"},
    {"name": "Priya Patel", "email": "priya@demo.skillmap.ai", "password": "demo"},
    {"name": "Karan Mehta", "email": "karan@demo.skillmap.ai", "password": "demo"},
]

SEED_PROFILES = [
    {"education": "B.Tech CSE", "career_goal": "Frontend Developer", "skill_level": "Beginner", "weekly_hours": 15, "timeline": 12},
    {"education": "MCA", "career_goal": "Data Scientist", "skill_level": "Intermediate", "weekly_hours": 20, "timeline": 16},
    {"education": "B.Sc IT", "career_goal": "Full Stack Developer", "skill_level": "Beginner", "weekly_hours": 10, "timeline": 20},
    {"education": "BE CSE", "career_goal": "DevOps Engineer", "skill_level": "Intermediate", "weekly_hours": 12, "timeline": 8},
]

SEED_POSTS = [
    {
        "user_idx": 0,
        "type": "milestone",
        "content": "🏆 Just completed Week 3 of my Frontend Developer roadmap! Finished all React hooks modules and built my first custom hook. The journey is real!",
    },
    {
        "user_idx": 1,
        "type": "question",
        "content": "Has anyone tried combining Zustand with React Query for state management? I'm trying to figure out the best pattern for server + client state in my ML dashboard.",
    },
    {
        "user_idx": 2,
        "type": "share",
        "content": "📚 Sharing this amazing resource — the Full Stack Open course by University of Helsinki is completely free and incredibly well structured. Highly recommend for anyone learning React + Node! https://fullstackopen.com",
    },
    {
        "user_idx": 3,
        "type": "milestone",
        "content": "🎯 Hit 500 XP today! Configured my first Kubernetes cluster and deployed a multi-container app. DevOps is amazing once you get past the YAML 😂",
    },
    {
        "user_idx": 0,
        "type": "question",
        "content": "What's everyone's favorite tool for API testing? I've been using Postman but curious if there are better alternatives in 2025.",
    },
    {
        "user_idx": 1,
        "type": "share",
        "content": "🔥 Just discovered this gem: fast.ai's Practical Deep Learning course. It's free and teaches top-down — you build real projects from day one. Highly recommend for anyone getting into ML!",
    },
    {
        "user_idx": 2,
        "type": "milestone",
        "content": "🚀 Deployed my first full-stack project to Vercel + Railway! A task management app built with Next.js and Express. Feels incredible to see it live.",
    },
    {
        "user_idx": 3,
        "type": "question",
        "content": "Anyone else find Docker networking confusing at first? Just spent 2 hours debugging a port mapping issue. Any tips for learning Docker more effectively?",
    },
]

SEED_ACTIVITIES = [
    {"user_idx": 0, "type": "learning", "action": "Completed React Hooks module", "xp": 50},
    {"user_idx": 0, "type": "learning", "action": "Finished CSS Grid tutorial", "xp": 30},
    {"user_idx": 1, "type": "learning", "action": "Completed Python basics", "xp": 40},
    {"user_idx": 1, "type": "learning", "action": "Built first ML model", "xp": 60},
    {"user_idx": 1, "type": "learning", "action": "Finished Pandas workshop", "xp": 35},
    {"user_idx": 2, "type": "learning", "action": "Completed Node.js intro", "xp": 40},
    {"user_idx": 2, "type": "learning", "action": "Built REST API", "xp": 50},
    {"user_idx": 3, "type": "learning", "action": "Set up CI/CD pipeline", "xp": 55},
    {"user_idx": 3, "type": "learning", "action": "Deployed to Kubernetes", "xp": 70},
    {"user_idx": 3, "type": "learning", "action": "Docker Compose mastery", "xp": 45},
]


def seed_community_posts(db: Session) -> None:
    """Seed the community with diverse users, profiles, posts and activities."""
    count = db.query(CommunityPost).count()
    if count > 0:
        return

    logger.info("Seeding community data (users, profiles, posts, activities)...")

    # Create demo users
    demo_user_ids = []
    for i, user_data in enumerate(SEED_USERS):
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if existing:
            demo_user_ids.append(existing.id)
        else:
            user = User(**user_data)
            db.add(user)
            db.flush()
            demo_user_ids.append(user.id)

    # Create profiles for demo users
    for i, profile_data in enumerate(SEED_PROFILES):
        uid = demo_user_ids[i]
        existing = db.query(Profile).filter(Profile.user_id == uid).first()
        if not existing:
            db.add(Profile(user_id=uid, **profile_data))

    db.flush()

    # Create posts
    post_ids = []
    for post_data in SEED_POSTS:
        uid = demo_user_ids[post_data["user_idx"]]
        post = CommunityPost(user_id=uid, type=post_data["type"], content=post_data["content"])
        db.add(post)
        db.flush()
        post_ids.append(post.id)

    # Add some likes — each user likes a few posts
    for i, uid in enumerate(demo_user_ids):
        # Each user likes 2-3 posts
        for j in range(min(3, len(post_ids))):
            target_post = post_ids[(i + j) % len(post_ids)]
            try:
                db.add(PostLike(user_id=uid, post_id=target_post))
                db.flush()
            except IntegrityError:
                db.rollback()

    # Create activities (for leaderboard XP)
    now = datetime.datetime.utcnow()
    for i, act_data in enumerate(SEED_ACTIVITIES):
        uid = demo_user_ids[act_data["user_idx"]]
        activity = Activity(
            user_id=uid,
            type=act_data["type"],
            action=act_data["action"],
            xp=act_data["xp"],
            created_at=now - datetime.timedelta(days=i % 7, hours=i * 3),
        )
        db.add(activity)

    # Add some comments
    seed_comments = [
        {"user_idx": 1, "post_idx": 0, "content": "Congrats! React hooks are a game changer 🎉"},
        {"user_idx": 2, "post_idx": 0, "content": "Custom hooks are so powerful. What pattern did you use?"},
        {"user_idx": 0, "post_idx": 1, "content": "I use TanStack Query + Zustand. Works great!"},
        {"user_idx": 3, "post_idx": 2, "content": "Thanks for sharing! Just bookmarked it 🔖"},
        {"user_idx": 0, "post_idx": 3, "content": "YAML nightmares are real 😂 Keep going!"},
        {"user_idx": 2, "post_idx": 5, "content": "fast.ai is incredible, second this recommendation!"},
    ]
    for cmt in seed_comments:
        uid = demo_user_ids[cmt["user_idx"]]
        pid = post_ids[cmt["post_idx"]]
        db.add(PostComment(user_id=uid, post_id=pid, content=cmt["content"]))

    db.commit()
    logger.info(f"Seeded {len(SEED_USERS)} demo users, {len(SEED_POSTS)} posts, {len(SEED_ACTIVITIES)} activities, {len(seed_comments)} comments.")


# ─────────────────────────────────────────────────────────────────────────────
#  Feed
# ─────────────────────────────────────────────────────────────────────────────
def get_feed(db: Session, user_id: int) -> List[dict]:
    """Return all community posts newest-first, annotated with like info."""
    posts = db.query(CommunityPost).order_by(CommunityPost.created_at.desc()).all()

    # Fetch all likes by this user in one query
    liked_post_ids = {
        row.post_id
        for row in db.query(PostLike.post_id).filter(PostLike.user_id == user_id).all()
    }

    result = []
    for post in posts:
        profile = db.query(Profile).filter(Profile.user_id == post.user_id).first()
        comments = db.query(PostComment).filter(PostComment.post_id == post.id).order_by(PostComment.created_at.asc()).all()
        comment_list = []
        for c in comments:
            c_profile = db.query(Profile).filter(Profile.user_id == c.user_id).first()
            comment_list.append({
                "id": c.id,
                "user_id": c.user_id,
                "author_name": c.user.name if c.user else "Unknown",
                "author_career_goal": c_profile.career_goal if c_profile else None,
                "content": c.content,
                "created_at": c.created_at,
            })
        result.append({
            "id": post.id,
            "user_id": post.user_id,
            "type": post.type,
            "content": post.content,
            "created_at": post.created_at,
            "author_name": post.author.name if post.author else "Unknown",
            "author_career_goal": profile.career_goal if profile else None,
            "likes_count": len(post.likes),
            "liked_by_me": post.id in liked_post_ids,
            "comments_count": len(comments),
            "comments": comment_list,
        })

    return result


def create_post(db: Session, user_id: int, post_type: str, content: str) -> dict:
    """Create a new community post."""
    post = CommunityPost(user_id=user_id, type=post_type, content=content)
    db.add(post)
    db.commit()
    db.refresh(post)

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    return {
        "id": post.id,
        "user_id": post.user_id,
        "type": post.type,
        "content": post.content,
        "created_at": post.created_at,
        "author_name": post.author.name if post.author else "Unknown",
        "author_career_goal": profile.career_goal if profile else None,
        "likes_count": 0,
        "liked_by_me": False,
        "comments_count": 0,
        "comments": [],
    }


def delete_post(db: Session, user_id: int, post_id: int) -> dict:
    """Delete a community post (only the author can delete)."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        return {"deleted": False, "error": "Post not found"}
    if post.user_id != user_id:
        return {"deleted": False, "error": "Not authorized"}
    db.delete(post)
    db.commit()
    return {"deleted": True}


def toggle_like(db: Session, user_id: int, post_id: int) -> dict:
    """Toggle like on a post. Returns {liked: bool, likes_count: int}."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        return {"liked": False, "likes_count": 0}

    existing = db.query(PostLike).filter(
        PostLike.user_id == user_id,
        PostLike.post_id == post_id,
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        likes_count = db.query(PostLike).filter(PostLike.post_id == post_id).count()
        return {"liked": False, "likes_count": likes_count}
    else:
        try:
            db.add(PostLike(user_id=user_id, post_id=post_id))
            db.commit()
            likes_count = db.query(PostLike).filter(PostLike.post_id == post_id).count()
            return {"liked": True, "likes_count": likes_count}
        except IntegrityError:
            db.rollback()
            likes_count = db.query(PostLike).filter(PostLike.post_id == post_id).count()
            return {"liked": True, "likes_count": likes_count}


# ─────────────────────────────────────────────────────────────────────────────
#  Comments
# ─────────────────────────────────────────────────────────────────────────────
def add_comment(db: Session, user_id: int, post_id: int, content: str) -> Optional[dict]:
    """Add a comment to a post."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        return None

    comment = PostComment(user_id=user_id, post_id=post_id, content=content)
    db.add(comment)
    db.commit()
    db.refresh(comment)

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    return {
        "id": comment.id,
        "user_id": comment.user_id,
        "author_name": comment.user.name if comment.user else "Unknown",
        "author_career_goal": profile.career_goal if profile else None,
        "content": comment.content,
        "created_at": comment.created_at,
    }


# ─────────────────────────────────────────────────────────────────────────────
#  Leaderboard
# ─────────────────────────────────────────────────────────────────────────────
def get_leaderboard(db: Session, current_user_id: int) -> List[dict]:
    """Rank all users by total XP earned through activities."""
    users = db.query(User).all()

    entries = []
    for user in users:
        # Skip demo accounts with no profile
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if not profile:
            continue

        # Total XP
        total_xp = db.query(func.sum(Activity.xp)).filter(
            Activity.user_id == user.id
        ).scalar() or 0

        # Streak calculation
        activities = db.query(Activity.created_at).filter(
            Activity.user_id == user.id
        ).order_by(Activity.created_at.desc()).all()

        unique_days = sorted(
            list(set([a.created_at.date() for a in activities])), reverse=True
        )
        streak = 0
        if unique_days:
            today = datetime.date.today()
            if unique_days[0] == today or unique_days[0] == today - datetime.timedelta(days=1):
                temp_date = unique_days[0]
                streak = 1
                for i in range(1, len(unique_days)):
                    if unique_days[i] == temp_date - datetime.timedelta(days=1):
                        streak += 1
                        temp_date = unique_days[i]
                    else:
                        break

        # Completed tasks
        roadmap = db.query(Roadmap).filter(Roadmap.user_id == user.id).first()
        completed_tasks = 0
        if roadmap:
            weeks = db.query(RoadmapWeek).filter(
                RoadmapWeek.roadmap_id == roadmap.id
            ).all()
            for week in weeks:
                completed_tasks += sum(1 for t in week.tasks if t.get("completed"))

        entries.append({
            "user_id": user.id,
            "name": user.name,
            "career_goal": profile.career_goal if profile else None,
            "total_xp": total_xp,
            "current_streak": streak,
            "completed_tasks": completed_tasks,
            "is_me": user.id == current_user_id,
        })

    # Sort by XP descending, assign ranks
    entries.sort(key=lambda x: x["total_xp"], reverse=True)
    for i, entry in enumerate(entries):
        entry["rank"] = i + 1

    return entries


# ─────────────────────────────────────────────────────────────────────────────
#  Shared Roadmaps
# ─────────────────────────────────────────────────────────────────────────────
def get_shared_roadmaps(db: Session, career_goal: Optional[str] = None) -> List[dict]:
    """Return all users' roadmaps with their completion stats."""
    query = db.query(Roadmap)
    roadmaps = query.all()

    results = []
    for roadmap in roadmaps:
        user = db.query(User).filter(User.id == roadmap.user_id).first()
        profile = db.query(Profile).filter(Profile.user_id == roadmap.user_id).first()

        # Filter by career goal if specified
        if career_goal and profile and career_goal.lower() not in (profile.career_goal or "").lower():
            continue

        weeks = db.query(RoadmapWeek).filter(
            RoadmapWeek.roadmap_id == roadmap.id
        ).all()

        total_tasks = 0
        completed_tasks = 0
        for week in weeks:
            for task in week.tasks:
                total_tasks += 1
                if task.get("completed"):
                    completed_tasks += 1

        completion_rate = (
            round((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0
        )

        results.append({
            "user_id": roadmap.user_id,
            "user_name": user.name if user else "Unknown",
            "career_goal": profile.career_goal if profile else None,
            "skill_level": profile.skill_level if profile else None,
            "total_weeks": len(weeks),
            "completed_tasks": completed_tasks,
            "total_tasks": total_tasks,
            "completion_rate": completion_rate,
            "created_at": roadmap.created_at,
        })

    results.sort(key=lambda x: x["completion_rate"], reverse=True)
    return results


# ─────────────────────────────────────────────────────────────────────────────
#  Stats helper — member count without loading full leaderboard
# ─────────────────────────────────────────────────────────────────────────────
def get_community_stats(db: Session) -> dict:
    """Quick aggregate stats for the community header."""
    total_posts = db.query(CommunityPost).count()
    total_members = db.query(Profile).count()
    return {"total_posts": total_posts, "total_members": total_members}
