from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Profile(Base):
    """SQLAlchemy model for User Profile."""
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    education = Column(String, nullable=False)
    career_goal = Column(String, nullable=False)
    skill_level = Column(String, nullable=False)
    weekly_hours = Column(Integer, nullable=False)
    timeline = Column(Integer, nullable=False)

    user = relationship("User", backref="profile", uselist=False)
