from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    settings = relationship("UserSettings", back_populates="user", uselist=False)
    profile = relationship("Profile", back_populates="user", uselist=False)
    roadmaps = relationship("Roadmap", back_populates="user")
    activities = relationship("Activity", back_populates="user")
    saved_resources = relationship("SavedResource", back_populates="user")
    assignments = relationship("Assignment", back_populates="user")
