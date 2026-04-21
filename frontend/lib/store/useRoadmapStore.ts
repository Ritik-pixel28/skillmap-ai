import { create } from 'zustand';
import { getRoadmap, updateTaskStatus, generateRoadmap } from '../api';
import { useStatsStore } from './useStatsStore';
import { useDashboardStore } from './useDashboardStore';

interface Task {
  id: string | number;
  title: string;
  duration?: string;
  completed: boolean;
  subtopics?: string[];
}

interface Week {
  week: number;
  title: string;
  tasks: Task[];
}

interface RoadmapData {
  id: number;
  title: string;
  weeks: Week[];
}

interface RoadmapState {
  roadmap: RoadmapData | null;
  isLoading: boolean;
  error: string | null;

  fetchRoadmap: () => Promise<void>;
  generateNewRoadmap: () => Promise<void>;
  toggleTask: (weekNumber: number, taskTitle: string, taskId: string | number) => Promise<void>;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  roadmap: null,
  isLoading: false,
  error: null,

  fetchRoadmap: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getRoadmap();
      if (response.success && response.data) {
        const rawData = response.data;
        const normalizedWeeks = rawData.weeks.map((w: any) => ({
          week: w.week || w.week_number,
          title: w.title || w.content,
          tasks: (w.tasks || []).map((t: any, tidx: number) => {
            if (typeof t === 'string') return { id: tidx, title: t, duration: "N/A", completed: false, subtopics: [] };
            return { ...t, id: t.id || tidx, completed: !!t.completed, subtopics: t.subtopics || [] };
          })
        }));
        set({ roadmap: { ...rawData, weeks: normalizedWeeks }, isLoading: false });
      } else {
        set({ roadmap: null, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  generateNewRoadmap: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await generateRoadmap();
      if (response.success && response.data) {
        const rawData = response.data;
        const normalizedWeeks = rawData.weeks.map((w: any) => ({
          week: w.week || w.week_number,
          title: w.title || w.content,
          tasks: (w.tasks || []).map((t: any, tidx: number) => {
            if (typeof t === 'string') return { id: tidx, title: t, duration: "N/A", completed: false, subtopics: [] };
            return { ...t, id: t.id || tidx, completed: !!t.completed, subtopics: t.subtopics || [] };
          })
        }));
        set({ roadmap: { ...rawData, weeks: normalizedWeeks }, isLoading: false });
        // Refresh other stores as a new roadmap might reset stats
        useStatsStore.getState().fetchStatsData();
        useDashboardStore.getState().fetchDashboardData();
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  toggleTask: async (weekNumber, taskTitle, taskId) => {
    const currentRoadmap = get().roadmap;
    if (!currentRoadmap) return;

    // 1. Optimistic Update
    const previousRoadmap = JSON.parse(JSON.stringify(currentRoadmap));
    
    const updatedWeeks = currentRoadmap.weeks.map(w => {
      if (w.week === weekNumber) {
        return {
          ...w,
          tasks: w.tasks.map(t => {
            // Check by ID if available, fallback to title (as per backend requirements)
            if (t.id === taskId || t.title === taskTitle) {
              return { ...t, completed: !t.completed };
            }
            return t;
          })
        };
      }
      return w;
    });

    const isCompleted = updatedWeeks.find(w => w.week === weekNumber)?.tasks.find(t => t.title === taskTitle)?.completed ?? false;

    set({ roadmap: { ...currentRoadmap, weeks: updatedWeeks } });

    try {
      // 2. API Call
      const response = await updateTaskStatus(weekNumber, taskTitle, isCompleted);
      
      if (response.success) {
        // 3. Sync other stores on success
        // We don't await these to keep the UI snappy, but they will refresh in background
        useStatsStore.getState().fetchStatsData();
        useDashboardStore.getState().fetchDashboardData();
      } else {
        throw new Error(response.message || "Failed to update task");
      }
    } catch (err: any) {
      // 4. Rollback on failure
      set({ roadmap: previousRoadmap, error: `Rollback: ${err.message}` });
    }
  }
}));
