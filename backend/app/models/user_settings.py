from sqlalchemy import Column, Integer, String, Boolean, JSON, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    # Appearance
    theme = Column(String, default="light")          # light | dark | system
    accent_color = Column(String, default="#2563EB") # hex color
    font_scale = Column(String, default="medium")    # small|medium|large|xl
    compact_mode = Column(Boolean, default=False)
    sidebar_style = Column(String, default="full")   # full | icon-only

    # Notifications
    notifications_enabled = Column(Boolean, default=True)
    notify_daily_reminder = Column(Boolean, default=False)
    daily_reminder_time = Column(String, default="09:00")
    notify_weekly_summary = Column(Boolean, default=True)
    notify_streak_warning = Column(Boolean, default=True)
    notify_task_deadline = Column(Boolean, default=True)
    notify_xp_milestones = Column(Boolean, default=True)
    notify_ai_suggestions = Column(Boolean, default=True)
    notify_system_updates = Column(Boolean, default=True)
    notify_channel_inapp = Column(Boolean, default=True)
    notify_channel_email = Column(Boolean, default=False)
    notify_channel_push = Column(Boolean, default=False)
    notification_email = Column(String, nullable=True)

    # Goals & Learning
    weekly_xp_target = Column(Integer, default=300)
    daily_study_minutes = Column(Integer, default=30)
    learning_style = Column(String, default="practical")
    difficulty = Column(String, default="intermediate")
    skill_focus_areas = Column(JSON, default=[])
    streak_goal = Column(Integer, default=7)
    streak_reminder = Column(Boolean, default=True)

    # AI Preferences
    roadmap_style = Column(String, default="balanced")
    task_complexity = Column(Integer, default=3)
    regenerate_frequency = Column(String, default="weekly")
    ai_explanation_depth = Column(String, default="detailed")
    ai_custom_instructions = Column(Text, default="")

    # Privacy
    profile_public = Column(Boolean, default=False)
    in_leaderboard = Column(Boolean, default=True)
    share_anonymous_data = Column(Boolean, default=True)
    analytics_cookies = Column(Boolean, default=True)
    personalization_cookies = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to user
    user = relationship("User", back_populates="settings")
