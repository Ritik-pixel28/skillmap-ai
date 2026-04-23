from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class Activity(Base):
    """SQLAlchemy model for tracking user activities/events."""
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    action = Column(String, nullable=False)
    xp = Column(Integer, default=20)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="activities")
