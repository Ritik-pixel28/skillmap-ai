from fastapi import APIRouter
from app.schemas.profile_schema import APIResponse

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.get("/recommended", response_model=APIResponse)
def get_recommended_resources():
    """Fetch recommended resources based on roadmap and skills."""
    data = [
      {
        "id": 1,
        "title": "Mastering React Design Patterns",
        "type": "Article",
        "duration": "15 min read",
        "link": "#"
      },
      {
        "id": 2,
        "title": "System Design Fundamentals",
        "type": "Video",
        "duration": "45 min",
        "link": "#"
      },
      {
        "id": 3,
        "title": "Next.js Performance Optimization",
        "type": "Course",
        "duration": "3h total",
        "link": "#"
      }
    ]
    return APIResponse(success=True, data=data)
