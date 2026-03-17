from pydantic import BaseModel, Field
from typing import Optional, List

class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    week: int
    status: str = "pending"

class AssignmentResponse(AssignmentBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class ProgressResponse(BaseModel):
    total: int
    completed: int
    percentage: float
