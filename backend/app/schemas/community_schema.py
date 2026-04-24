from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PostCreate(BaseModel):
    type: str  # "milestone" | "question" | "share"
    content: str


class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    user_id: int
    author_name: str
    author_career_goal: Optional[str] = None
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class PostOut(BaseModel):
    id: int
    user_id: int
    type: str
    content: str
    created_at: datetime
    author_name: str
    author_career_goal: Optional[str] = None
    likes_count: int
    liked_by_me: bool
    comments_count: int = 0
    comments: List[CommentOut] = []

    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    name: str
    career_goal: Optional[str] = None
    total_xp: int
    current_streak: int
    completed_tasks: int
    is_me: bool


class SharedRoadmapOut(BaseModel):
    user_id: int
    user_name: str
    career_goal: Optional[str] = None
    skill_level: Optional[str] = None
    total_weeks: int
    completed_tasks: int
    total_tasks: int
    completion_rate: int
    created_at: Optional[datetime] = None


class CommunityStats(BaseModel):
    total_posts: int
    total_members: int
