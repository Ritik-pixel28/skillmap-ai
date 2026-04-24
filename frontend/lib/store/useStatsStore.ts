import { create } from 'zustand';
import { 
  getStatsOverview, 
  getXpHistory, 
  getSkillsBreakdown, 
  getCategoryPerformance,
  getHeatmapData,
  getInsights
} from '../api';

import { 
  StatsOverview,
  XpHistoryEntry,
  HeatmapEntry,
  Insight,
  ApiResponse,
  CategoryPerf
} from '../types';

interface SkillStats {
  [skillName: string]: { current: number; target: number };
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
    const safeFetch = async <T>(apiFunc: () => Promise<ApiResponse<T>>, fallback: T): Promise<T> => {
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
        safeFetch<StatsOverview>(getStatsOverview, null as any),
        safeFetch<XpHistoryEntry[]>(() => getXpHistory(range), []),
        safeFetch<SkillStats>(getSkillsBreakdown, null as any),
        safeFetch<CategoryPerf[]>(getCategoryPerformance, []),
        safeFetch<HeatmapEntry[]>(getHeatmapData, []),
        safeFetch<Insight[]>(getInsights, [])
      ]);

      set({
        overview,
        xpHistory,
        heatmap,
        insights,
        skills: (skills as any), // Cast to fit the standardized interface if needed
        categories,
        isLoading: false,
        error: null
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
