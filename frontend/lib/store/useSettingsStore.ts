import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontScale: 'small' | 'medium' | 'large' | 'xl';
  compactMode: boolean;
  sidebarStyle: 'full' | 'icon-only';
}

export interface NotificationSettings {
  notificationsEnabled: boolean;
  notifyDailyReminder: boolean;
  dailyReminderTime: string;
  notifyWeeklySummary: boolean;
  notifyStreakWarning: boolean;
  notifyTaskDeadline: boolean;
  notifyXpMilestones: boolean;
  notifyAiSuggestions: boolean;
  notifySystemUpdates: boolean;
  notifyChannelInapp: boolean;
  notifyChannelEmail: boolean;
  notifyChannelPush: boolean;
  notificationEmail: string;
}

export interface GoalsSettings {
  weeklyXpTarget: number;
  dailyStudyMinutes: number;
  learningStyle: 'visual' | 'practical' | 'theoretical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skillFocusAreas: string[];
  streakGoal: number;
  streakReminder: boolean;
}

export interface AISettings {
  roadmapStyle: 'aggressive' | 'balanced' | 'relaxed';
  taskComplexity: number;
  regenerateFrequency: 'weekly' | 'biweekly' | 'monthly' | 'manual';
  aiExplanationDepth: 'brief' | 'detailed';
  aiCustomInstructions: string;
}

export interface PrivacySettings {
  profilePublic: boolean;
  inLeaderboard: boolean;
  shareAnonymousData: boolean;
  analyticsCookies: boolean;
  personalizationCookies: boolean;
}

export interface SettingsStore extends AppearanceSettings, NotificationSettings,
  GoalsSettings, AISettings, PrivacySettings {
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: number | null;

  fetchSettings: () => Promise<void>;
  saveAppearance: (data: Partial<AppearanceSettings>) => Promise<void>;
  saveNotifications: (data: Partial<NotificationSettings>) => Promise<void>;
  saveGoals: (data: Partial<GoalsSettings>) => Promise<void>;
  saveAI: (data: Partial<AISettings>) => Promise<void>;
  savePrivacy: (data: Partial<PrivacySettings>) => Promise<void>;
  saveSettings: () => Promise<void>;
  setField: (key: string, value: any) => void;
  applyTheme: (theme: 'light' | 'dark' | 'system') => void;
  applyAccentColor: (color: string) => void;
  applyFontScale: (scale: string) => void;
  resetAIPreferences: () => void;
  exportData: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      accentColor: '#2563EB',
      fontScale: 'medium',
      compactMode: false,
      sidebarStyle: 'full',

      notificationsEnabled: true,
      notifyDailyReminder: false,
      dailyReminderTime: '09:00',
      notifyWeeklySummary: true,
      notifyStreakWarning: true,
      notifyTaskDeadline: true,
      notifyXpMilestones: true,
      notifyAiSuggestions: true,
      notifySystemUpdates: true,
      notifyChannelInapp: true,
      notifyChannelEmail: false,
      notifyChannelPush: false,
      notificationEmail: '',

      weeklyXpTarget: 300,
      dailyStudyMinutes: 30,
      learningStyle: 'practical',
      difficulty: 'intermediate',
      skillFocusAreas: [],
      streakGoal: 7,
      streakReminder: true,

      roadmapStyle: 'balanced',
      taskComplexity: 3,
      regenerateFrequency: 'weekly',
      aiExplanationDepth: 'detailed',
      aiCustomInstructions: '',

      profilePublic: false,
      inLeaderboard: true,
      shareAnonymousData: true,
      analyticsCookies: true,
      personalizationCookies: true,

      isLoading: false,
      isSaving: false,
      isDirty: false,
      lastSaved: null,

      setField: (key, value) => set({ [key]: value, isDirty: true }),

      fetchSettings: async () => {
        set({ isLoading: true });
        try {
          const res = await apiRequest<ApiResponse<any>>('/settings/');
          if (res.success && res.data) {
            const data = res.data;
            set({
                theme: data.theme,
                accentColor: data.accent_color,
                fontScale: data.font_scale,
                compactMode: data.compact_mode,
                sidebarStyle: data.sidebar_style,
                notificationsEnabled: data.notifications_enabled,
                notifyDailyReminder: data.notify_daily_reminder,
                dailyReminderTime: data.daily_reminder_time,
                notifyWeeklySummary: data.notify_weekly_summary,
                notifyStreakWarning: data.notify_streak_warning,
                notifyTaskDeadline: data.notify_task_deadline,
                notifyXpMilestones: data.notify_xp_milestones,
                notifyAiSuggestions: data.notify_ai_suggestions,
                notifySystemUpdates: data.notify_system_updates,
                notifyChannelInapp: data.notify_channel_inapp,
                notifyChannelEmail: data.notify_channel_email,
                notifyChannelPush: data.notify_channel_push,
                notificationEmail: data.notification_email ?? '',
                weeklyXpTarget: data.weekly_xp_target,
                dailyStudyMinutes: data.daily_study_minutes,
                learningStyle: data.learning_style,
                difficulty: data.difficulty,
                skillFocusAreas: data.skill_focus_areas ?? [],
                streakGoal: data.streak_goal,
                streakReminder: data.streak_reminder,
                roadmapStyle: data.roadmap_style,
                taskComplexity: data.task_complexity,
                regenerateFrequency: data.regenerate_frequency,
                aiExplanationDepth: data.ai_explanation_depth,
                aiCustomInstructions: data.ai_custom_instructions ?? '',
                profilePublic: data.profile_public,
                inLeaderboard: data.in_leaderboard,
                shareAnonymousData: data.share_anonymous_data,
                analyticsCookies: data.analytics_cookies,
                personalizationCookies: data.personalization_cookies,
                isLoading: false,
                isDirty: false,
            });
            get().applyTheme(data.theme);
            get().applyAccentColor(data.accent_color);
            get().applyFontScale(data.font_scale);
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          set({ isLoading: false });
        }
      },

      saveAppearance: async (data) => {
        set({ isSaving: true });
        set(data as any);
        if (data.theme) get().applyTheme(data.theme);
        if (data.accentColor) get().applyAccentColor(data.accentColor);
        if (data.fontScale) get().applyFontScale(data.fontScale);
        try {
          await apiRequest('/settings/appearance', {
            method: 'PATCH',
            body: JSON.stringify({
                theme: data.theme ?? get().theme,
                accent_color: data.accentColor ?? get().accentColor,
                font_scale: data.fontScale ?? get().fontScale,
                compact_mode: data.compactMode ?? get().compactMode,
                sidebar_style: data.sidebarStyle ?? get().sidebarStyle,
            })
          });
          set({ isSaving: false, isDirty: false, lastSaved: Date.now() });
        } catch {
          set({ isSaving: false });
          throw new Error('Failed to save appearance');
        }
      },

      saveNotifications: async (data) => {
        set({ isSaving: true, ...data });
        try {
          await apiRequest('/settings/notifications', {
            method: 'PATCH',
            body: JSON.stringify({
                notifications_enabled: get().notificationsEnabled,
                notify_daily_reminder: get().notifyDailyReminder,
                daily_reminder_time: get().dailyReminderTime,
                notify_weekly_summary: get().notifyWeeklySummary,
                notify_streak_warning: get().notifyStreakWarning,
                notify_task_deadline: get().notifyTaskDeadline,
                notify_xp_milestones: get().notifyXpMilestones,
                notify_ai_suggestions: get().notifyAiSuggestions,
                notify_system_updates: get().notifySystemUpdates,
                notify_channel_inapp: get().notifyChannelInapp,
                notify_channel_email: get().notifyChannelEmail,
                notify_channel_push: get().notifyChannelPush,
                notification_email: get().notificationEmail,
            })
          });
          set({ isSaving: false, isDirty: false, lastSaved: Date.now() });
        } catch {
          set({ isSaving: false });
          throw new Error('Failed to save notifications');
        }
      },

      saveGoals: async (data) => {
        set({ isSaving: true, ...data });
        try {
          await apiRequest('/settings/goals', {
            method: 'PATCH',
            body: JSON.stringify({
                weekly_xp_target: get().weeklyXpTarget,
                daily_study_minutes: get().dailyStudyMinutes,
                learning_style: get().learningStyle,
                difficulty: get().difficulty,
                skill_focus_areas: get().skillFocusAreas,
                streak_goal: get().streakGoal,
                streak_reminder: get().streakReminder,
            })
          });
          set({ isSaving: false, isDirty: false, lastSaved: Date.now() });
        } catch {
          set({ isSaving: false });
        }
      },

      saveAI: async (data) => {
        set({ isSaving: true, ...data });
        try {
          await apiRequest('/settings/ai', {
            method: 'PATCH',
            body: JSON.stringify({
                roadmap_style: get().roadmapStyle,
                task_complexity: get().taskComplexity,
                regenerate_frequency: get().regenerateFrequency,
                ai_explanation_depth: get().aiExplanationDepth,
                ai_custom_instructions: get().aiCustomInstructions,
            })
          });
          set({ isSaving: false, isDirty: false, lastSaved: Date.now() });
        } catch {
          set({ isSaving: false });
        }
      },

      savePrivacy: async (data) => {
        set({ isSaving: true, ...data });
        try {
          await apiRequest('/settings/privacy', {
            method: 'PATCH',
            body: JSON.stringify({
                profile_public: get().profilePublic,
                in_leaderboard: get().inLeaderboard,
                share_anonymous_data: get().shareAnonymousData,
                analytics_cookies: get().analyticsCookies,
                personalization_cookies: get().personalizationCookies,
            })
          });
          set({ isSaving: false, isDirty: false, lastSaved: Date.now() });
        } catch {
          set({ isSaving: false });
        }
      },

      saveSettings: async () => {
        set({ isSaving: true });
        const state = get();
        try {
          await apiRequest('/settings/', {
            method: 'PATCH',
            body: JSON.stringify({
              theme: state.theme,
              accent_color: state.accentColor,
              font_scale: state.fontScale,
              compact_mode: state.compactMode,
              sidebar_style: state.sidebarStyle,
              notifications_enabled: state.notificationsEnabled,
              notify_daily_reminder: state.notifyDailyReminder,
              daily_reminder_time: state.dailyReminderTime,
              notify_weekly_summary: state.notifyWeeklySummary,
              notify_streak_warning: state.notifyStreakWarning,
              notify_task_deadline: state.notifyTaskDeadline,
              notify_xp_milestones: state.notifyXpMilestones,
              notify_ai_suggestions: state.notifyAiSuggestions,
              notify_system_updates: state.notifySystemUpdates,
              notify_channel_inapp: state.notifyChannelInapp,
              notify_channel_email: state.notifyChannelEmail,
              notify_channel_push: state.notifyChannelPush,
              notification_email: state.notificationEmail,
              weekly_xp_target: state.weeklyXpTarget,
              daily_study_minutes: state.dailyStudyMinutes,
              learning_style: state.learningStyle,
              difficulty: state.difficulty,
              skill_focus_areas: state.skillFocusAreas,
              roadmap_style: state.roadmapStyle,
              task_complexity: state.taskComplexity,
              regenerate_frequency: state.regenerateFrequency,
              ai_explanation_depth: state.aiExplanationDepth,
              ai_custom_instructions: state.aiCustomInstructions,
              profile_public: state.profilePublic,
              in_leaderboard: state.inLeaderboard,
              share_anonymous_data: state.shareAnonymousData,
              analytics_cookies: state.analyticsCookies,
              personalization_cookies: state.personalizationCookies,
            })
          });
          set({ isSaving: false, isDirty: false, lastSaved: Date.now() });
        } catch (err) {
          set({ isSaving: false });
          console.error('Failed to save all settings:', err);
        }
      },

      applyTheme: (theme) => {
        if (typeof window === 'undefined') return;
        const root = document.documentElement;
        const resolved = theme === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark' : 'light')
          : theme;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        root.setAttribute('data-theme', resolved);
      },

      applyAccentColor: (color) => {
        if (typeof window === 'undefined') return;
        document.documentElement.style.setProperty('--color-accent', color);
        document.documentElement.style.setProperty('--tw-accent', color);
      },

      applyFontScale: (scale) => {
        if (typeof window === 'undefined') return;
        const scaleMap = {
          small: '14px',
          medium: '16px',
          large: '18px',
          xl: '20px',
        };
        document.documentElement.style.fontSize = 
          scaleMap[scale as keyof typeof scaleMap] ?? '16px';
      },

      resetAIPreferences: () => set({
        roadmapStyle: 'balanced',
        taskComplexity: 3,
        regenerateFrequency: 'weekly',
        aiExplanationDepth: 'detailed',
        aiCustomInstructions: '',
        isDirty: true,
      }),

      exportData: async () => {
        const res = await apiRequest<ApiResponse<any>>('/settings/export/json', { method: 'POST' });
        if (res.success && res.data) {
          const blob = new Blob([JSON.stringify(res.data, null, 2)], 
                                 { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `skillmap-data-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      },

      deleteAccount: async () => {
        await apiRequest('/settings/account', { method: 'DELETE' });
        localStorage.clear();
        window.location.href = '/';
      },
    }),
    { name: 'skillmap-settings-v2' }
  )
);
