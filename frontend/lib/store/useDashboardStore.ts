import { create } from 'zustand';
import { apiRequest } from '../api';

interface Task {
  title: string;
  description: string;
  completed: boolean;
  duration?: string;
  tag?: string;
}

interface Week {
  week: number;
  title: string;
  tasks: Task[];
}

interface Roadmap {
  id: number;
  title: string;
  weeks: Week[];
}

interface Activity {
  id: number;
  type: string;
  action: string;
  xp: number;
  timestamp: string;
  time: string;
}

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  skills: string[];
}

interface SkillData {
  current: Record<string, number>;
  target: Record<string, number>;
}

interface DashboardState {
  userProfile: UserProfile | null;
  roadmap: Roadmap | null;
  skills: SkillData | null;
  activity: Activity[];
  recommendations: any[];
  isLoading: boolean;
  error: string | null;

  fetchDashboardData: () => Promise<void>;
  updateTaskStatus: (weekNumber: number, taskTitle: string, completed: boolean) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  userProfile: null,
  roadmap: null,
  skills: null,
  activity: [],
  recommendations: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [roadmapRes, skillsRes, activityRes, resourcesRes, profileRes] = await Promise.all([
        apiRequest('/roadmap/current'),
        apiRequest('/user/skills'),
        apiRequest('/user/activity'),
        apiRequest('/resources/recommended'),
        apiRequest('/profile')
      ]);

      set({
        roadmap: roadmapRes.data,
        skills: skillsRes.data,
        activity: activityRes.data,
        recommendations: resourcesRes.data,
        userProfile: profileRes.data,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateTaskStatus: async (weekNumber: number, taskTitle: string, completed: boolean) => {
    const previousRoadmap = get().roadmap;
    if (!previousRoadmap) return;

    const newWeeks = previousRoadmap.weeks.map(w => {
      if (w.week === weekNumber) {
        return {
          ...w,
          tasks: w.tasks.map(t => t.title === taskTitle ? { ...t, completed } : t)
        };
      }
      return w;
    });

    set({ roadmap: { ...previousRoadmap, weeks: newWeeks } });

    try {
      await apiRequest('/roadmap/task', {
        method: 'PATCH',
        body: JSON.stringify({
          week_number: weekNumber,
          task_title: taskTitle,
          completed
        })
      });
      const activityRes = await apiRequest('/user/activity');
      set({ activity: activityRes.data });
    } catch (err: any) {
      set({ roadmap: previousRoadmap, error: `Failed to update task: ${err.message}` });
    }
  }
}));
