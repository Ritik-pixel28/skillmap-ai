import { create } from 'zustand';
import { 
  getStatsOverview, 
  getXpHistory, 
  getSkillsBreakdown, 
  getCategoryPerformance,
  getHeatmapData,
  getInsights
} from '../api';

interface StatsOverview {
  totalXp: number;
  todayXp: number;
  weeklyXp: number;
  completionRate: number;
  currentStreak: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

interface XpHistoryEntry {
  date: string;
  xp: number;
}

interface SkillStats {
  current: Record<string, number>;
  target: Record<string, number>;
}

interface CategoryPerf {
  category: string;
  percentage: number;
  completed: number;
  total: number;
}

interface HeatmapEntry {
  date: string;
  xp: number;
  intensity: number;
}

interface Insight {
  type: string;
  text: string;
  positive: boolean;
}

interface StatsState {
  overview: StatsOverview | null;
  xpHistory: XpHistoryEntry[];
  heatmap: HeatmapEntry[];
  insights: Insight[];
  skills: SkillStats | null;
  categories: CategoryPerf[];
  isLoading: boolean;
  error: string | null;
  historyRange: number;

  fetchStatsData: (days?: number) => Promise<void>;
  setHistoryRange: (days: number) => void;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  overview: null,
  xpHistory: [],
  heatmap: [],
  insights: [],
  skills: null,
  categories: [],
  isLoading: false,
  error: null,
  historyRange: 7,

  setHistoryRange: (days: number) => {
    set({ historyRange: days });
    get().fetchStatsData(days);
  },

  fetchStatsData: async (days) => {
    const range = days || get().historyRange;
    set({ isLoading: true, error: null });

    // Helper for fault-tolerant API calls
    const safeFetch = async (apiFunc: () => Promise<any>, fallback: any = null) => {
      try {
        const res = await apiFunc();
        return res.success ? res.data : fallback;
      } catch (err) {
        return fallback;
      }
    };

    try {
      // Fetching all endpoints in parallel but safely
      const [
        overview, 
        xpHistory, 
        skills, 
        categories, 
        heatmap, 
        insights
      ] = await Promise.all([
        safeFetch(getStatsOverview),
        safeFetch(() => getXpHistory(range), []),
        safeFetch(getSkillsBreakdown),
        safeFetch(getCategoryPerformance, []),
        safeFetch(getHeatmapData, []),
        safeFetch(getInsights, [])
      ]);

      set({
        overview,
        xpHistory,
        heatmap,
        insights,
        skills,
        categories,
        isLoading: false,
        error: null
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
