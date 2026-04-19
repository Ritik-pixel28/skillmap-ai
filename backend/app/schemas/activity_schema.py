from pydantic import BaseModel
from datetime import datetime
from typing import List

class ActivityBase(BaseModel):
    type: str
    action: str

class ActivityCreate(ActivityBase):
    user_id: int

class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
