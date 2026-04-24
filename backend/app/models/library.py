from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
import datetime


class Resource(Base):
    """A curated learning resource (Article, Video, Course)."""
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # article, video, course
    url = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String, nullable=False, default="beginner")  # beginner, intermediate, advanced
    duration = Column(String, nullable=True)  # "15 min read", "2h course", etc.
    source = Column(String, nullable=True)  # YouTube, MDN, Udemy, etc.
    tags = Column(String, nullable=True)  # Comma-separated tags: "python,data-science,ml"
    career_goals = Column(String, nullable=True)  # Comma-separated career goals this resource is relevant to
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    saved_by = relationship("SavedResource", back_populates="resource", cascade="all, delete-orphan")


class SavedResource(Base):
    """Tracks which resources a user has saved/bookmarked."""
    __tablename__ = "saved_resources"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Ensure a user can only save a resource once
    __table_args__ = (
        UniqueConstraint("user_id", "resource_id", name="uq_user_resource"),
    )

    # Relationships
    resource = relationship("Resource", back_populates="saved_by")
    user = relationship("User", back_populates="saved_resources")


class RoadmapResource(Base):
    """Links a resource to a specific roadmap week."""
    __tablename__ = "roadmap_resources"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    week_number = Column(Integer, nullable=False)
    linked_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Ensure a resource is linked to a week only once
    __table_args__ = (
        UniqueConstraint("roadmap_id", "resource_id", "week_number", name="uq_roadmap_resource_week"),
    )

    # Relationships
    resource = relationship("Resource")
    roadmap = relationship("Roadmap")
