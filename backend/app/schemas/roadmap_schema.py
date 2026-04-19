from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class TaskItem(BaseModel):
    title: str
    description: str
    duration: Optional[str] = None
    estimated_days: Optional[int] = None
    subtopics: List[str] = []
    actions: List[str] = []
    completed: bool = False

class RoadmapWeekSchema(BaseModel):
    week: int
    title: str
    tasks: List[TaskItem]

class RoadmapResponse(BaseModel):
    title: str
    weeks: List[RoadmapWeekSchema]
    created_at: Optional[datetime] = None

class TaskUpdateSchema(BaseModel):
    week_number: int
    task_title: str
    completed: bool
