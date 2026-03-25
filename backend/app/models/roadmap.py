from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class Roadmap(Base):
    """SQLAlchemy model for a generated roadmap."""
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    weeks = relationship("RoadmapWeek", back_populates="roadmap", cascade="all, delete-orphan")
    user = relationship("User", backref="roadmap", uselist=False)

class RoadmapWeek(Base):
    """SQLAlchemy model for a specific week in a roadmap."""
    __tablename__ = "roadmap_weeks"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    week_number = Column(Integer, nullable=False)
    content = Column(String, nullable=False)

    # Relationships
    roadmap = relationship("Roadmap", back_populates="weeks")
