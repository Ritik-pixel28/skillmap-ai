from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.dependencies import get_db
from app.schemas.profile_schema import APIResponse
from app.schemas.community_schema import PostCreate, CommentCreate
from app.services import community_service
from app.core.logger import logger

router = APIRouter(prefix="/community", tags=["Community"])

# Shared user_id placeholder (consistent with rest of codebase)
USER_ID = 1


@router.get("/stats", response_model=APIResponse)
def get_stats(db: Session = Depends(get_db)):
    """Quick aggregate stats (post count + member count)."""
    try:
        stats = community_service.get_community_stats(db)
        return APIResponse(success=True, data=stats)
    except Exception as e:
        logger.error(f"Error fetching community stats: {e}")
        return APIResponse(success=False, error="Failed to fetch stats")


@router.get("/feed", response_model=APIResponse)
def get_feed(db: Session = Depends(get_db)):
    """Fetch all community posts, newest first."""
    try:
        posts = community_service.get_feed(db, USER_ID)
        return APIResponse(success=True, data=posts)
    except Exception as e:
        logger.error(f"Error fetching community feed: {e}")
        return APIResponse(success=False, error="Failed to fetch feed")


@router.post("/posts", response_model=APIResponse)
def create_post(body: PostCreate, db: Session = Depends(get_db)):
    """Create a new community post."""
    try:
        if not body.content.strip():
            return APIResponse(success=False, error="Post content cannot be empty")
        if body.type not in ("milestone", "question", "share"):
            return APIResponse(success=False, error="Invalid post type")
        post = community_service.create_post(db, USER_ID, body.type, body.content.strip())
        return APIResponse(success=True, data=post, message="Post created successfully")
    except Exception as e:
        logger.error(f"Error creating post: {e}")
        return APIResponse(success=False, error="Failed to create post")


@router.delete("/posts/{post_id}", response_model=APIResponse)
def delete_post(post_id: int, db: Session = Depends(get_db)):
    """Delete a community post (only by author)."""
    try:
        result = community_service.delete_post(db, USER_ID, post_id)
        if result.get("deleted"):
            return APIResponse(success=True, data=result, message="Post deleted")
        return APIResponse(success=False, error=result.get("error", "Failed to delete"))
    except Exception as e:
        logger.error(f"Error deleting post {post_id}: {e}")
        return APIResponse(success=False, error="Failed to delete post")


@router.post("/posts/{post_id}/like", response_model=APIResponse)
def toggle_like(post_id: int, db: Session = Depends(get_db)):
    """Toggle like on a community post."""
    try:
        result = community_service.toggle_like(db, USER_ID, post_id)
        return APIResponse(success=True, data=result)
    except Exception as e:
        logger.error(f"Error toggling like on post {post_id}: {e}")
        return APIResponse(success=False, error="Failed to toggle like")


@router.post("/posts/{post_id}/comments", response_model=APIResponse)
def add_comment(post_id: int, body: CommentCreate, db: Session = Depends(get_db)):
    """Add a comment on a post."""
    try:
        if not body.content.strip():
            return APIResponse(success=False, error="Comment cannot be empty")
        comment = community_service.add_comment(db, USER_ID, post_id, body.content.strip())
        if comment:
            return APIResponse(success=True, data=comment, message="Comment added")
        return APIResponse(success=False, error="Post not found")
    except Exception as e:
        logger.error(f"Error adding comment to post {post_id}: {e}")
        return APIResponse(success=False, error="Failed to add comment")


@router.get("/leaderboard", response_model=APIResponse)
def get_leaderboard(db: Session = Depends(get_db)):
    """Get all users ranked by total XP."""
    try:
        entries = community_service.get_leaderboard(db, USER_ID)
        return APIResponse(success=True, data=entries)
    except Exception as e:
        logger.error(f"Error fetching leaderboard: {e}")
        return APIResponse(success=False, error="Failed to fetch leaderboard")


@router.get("/roadmaps", response_model=APIResponse)
def get_shared_roadmaps(
    career_goal: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get publicly shared roadmaps, optionally filtered by career goal."""
    try:
        roadmaps = community_service.get_shared_roadmaps(db, career_goal=career_goal)
        return APIResponse(success=True, data=roadmaps)
    except Exception as e:
        logger.error(f"Error fetching shared roadmaps: {e}")
        return APIResponse(success=False, error="Failed to fetch shared roadmaps")
