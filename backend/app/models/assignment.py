from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Assignment(Base):
    """SQLAlchemy model for Assignments."""
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    week = Column(Integer, nullable=False)
    status = Column(String, default="pending", nullable=False) # "pending" or "completed"
