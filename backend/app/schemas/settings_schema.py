from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AppearanceUpdate(BaseModel):
    theme: Optional[str] = None           # "light" | "dark" | "system"
    accent_color: Optional[str] = None    # hex e.g. "#2563EB"
    font_scale: Optional[str] = None      # "small"|"medium"|"large"|"xl"
    compact_mode: Optional[bool] = None
    sidebar_style: Optional[str] = None

class NotificationsUpdate(BaseModel):
    notifications_enabled: Optional[bool] = None
    notify_daily_reminder: Optional[bool] = None
    daily_reminder_time: Optional[str] = None
    notify_weekly_summary: Optional[bool] = None
    notify_streak_warning: Optional[bool] = None
    notify_task_deadline: Optional[bool] = None
    notify_xp_milestones: Optional[bool] = None
    notify_ai_suggestions: Optional[bool] = None
    notify_system_updates: Optional[bool] = None
    notify_channel_inapp: Optional[bool] = None
    notify_channel_email: Optional[bool] = None
    notify_channel_push: Optional[bool] = None
    notification_email: Optional[str] = None

class GoalsUpdate(BaseModel):
    weekly_xp_target: Optional[int] = None
    daily_study_minutes: Optional[int] = None
    learning_style: Optional[str] = None
    difficulty: Optional[str] = None
    skill_focus_areas: Optional[List[str]] = None
    streak_goal: Optional[int] = None
    streak_reminder: Optional[bool] = None

class AIPreferencesUpdate(BaseModel):
    roadmap_style: Optional[str] = None
    task_complexity: Optional[int] = None
    regenerate_frequency: Optional[str] = None
    ai_explanation_depth: Optional[str] = None
    ai_custom_instructions: Optional[str] = None

class PrivacyUpdate(BaseModel):
    profile_public: Optional[bool] = None
    in_leaderboard: Optional[bool] = None
    share_anonymous_data: Optional[bool] = None
    analytics_cookies: Optional[bool] = None
    personalization_cookies: Optional[bool] = None
