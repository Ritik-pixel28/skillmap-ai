from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ResourceOut(BaseModel):
    id: int
    title: str
    type: str
    url: str
    description: Optional[str] = None
    difficulty: str
    duration: Optional[str] = None
    source: Optional[str] = None
    tags: Optional[str] = None
    career_goals: Optional[str] = None
    is_saved: Optional[bool] = False

    class Config:
        from_attributes = True


class SaveResourceRequest(BaseModel):
    resource_id: int


class LinkResourceRequest(BaseModel):
    resource_id: int
    week_number: int


class SavedResourceOut(BaseModel):
    id: int
    resource_id: int
    saved_at: datetime
    resource: ResourceOut

    class Config:
        from_attributes = True
