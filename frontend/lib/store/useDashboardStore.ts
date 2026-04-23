import { create } from 'zustand';
import { apiRequest } from '../api';
import { 
  Roadmap, 
  Skill, 
  DashboardActivity, 
  User, 
  ApiResponse 
} from '../types';

interface DashboardState {
  userProfile: User | null;
  roadmap: Roadmap | null;
  skills: { current: Record<string, number>; target: Record<string, number> } | null;
  activity: DashboardActivity[];
  recommendations: { id: number; title: string; type: string; url?: string }[];
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
        apiRequest<ApiResponse<Roadmap>>('/roadmap/current'),
        apiRequest<ApiResponse<{ current: Record<string, number>; target: Record<string, number> }>>('/user/skills'),
        apiRequest<ApiResponse<DashboardActivity[]>>('/user/activity'),
        apiRequest<ApiResponse<{ id: number; title: string; type: string; url?: string }[]>>('/resources/recommended'),
        apiRequest<ApiResponse<User>>('/profile')
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
      await apiRequest<ApiResponse<any>>('/roadmap/task', {
        method: 'PATCH',
        body: JSON.stringify({
          week_number: weekNumber,
          task_title: taskTitle,
          completed
        })
      });
      const activityRes = await apiRequest<ApiResponse<DashboardActivity[]>>('/user/activity');
      set({ activity: activityRes.data });
    } catch (err: any) {
      set({ roadmap: previousRoadmap, error: `Failed to update task: ${err.message}` });
    }
  }
}));
