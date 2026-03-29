from pydantic import BaseModel, Field
from typing import Optional, Any

class ProfileBase(BaseModel):
    education: str = Field(..., description="The user's education level")
    career_goal: str = Field(..., description="The user's career goal")
    skill_level: str = Field(..., description="Initial skill level (e.g., Beginner, Intermediate)")
    weekly_hours: int = Field(..., gt=0, le=40, description="Hours dedicated per week")
    timeline: int = Field(..., gt=0, description="Timeline in weeks")

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class APIResponse(BaseModel):
    """Standardized API response format."""
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None
