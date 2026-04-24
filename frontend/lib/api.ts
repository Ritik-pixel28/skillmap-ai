import { 
  ApiResponse, 
  Roadmap, 
  User, 
  StatsOverview, 
  XpHistoryEntry, 
  HeatmapEntry, 
  Insight,
  DashboardActivity,
  CategoryPerf 
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
      throw new Error(data.message || data.error || 'Something went wrong');
    }

    return data as T;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error(`Backend server is not reachable at ${API_URL}`);
    }
    throw error;
  }
}

export const generateRoadmap = async () => {
  return await apiRequest<ApiResponse<Roadmap>>('/roadmap/generate', {
    method: 'POST',
  });
};

export const getRoadmap = async () => {
  return await apiRequest<ApiResponse<Roadmap>>('/roadmap/current');
};

export const updateTaskStatus = async (weekNumber: number, taskTitle: string, completed: boolean) => {
  return await apiRequest<ApiResponse<any>>('/roadmap/task', {
    method: 'PATCH',
    body: JSON.stringify({
      week_number: weekNumber,
      task_title: taskTitle,
      completed
    })
  });
};

export const getUserProfile = async () => {
  return await apiRequest<ApiResponse<User>>('/profile');
};

export const getStatsOverview = async () => {
  return await apiRequest<ApiResponse<StatsOverview>>('/stats/overview');
};

export const getXpHistory = async (days: number = 7) => {
  return await apiRequest<ApiResponse<XpHistoryEntry[]>>(`/stats/xp-history?days=${days}`);
};

export const getHeatmapData = async () => {
  return await apiRequest<ApiResponse<HeatmapEntry[]>>('/stats/heatmap');
};

export const getInsights = async () => {
  return await apiRequest<ApiResponse<Insight[]>>('/stats/insights');
};

export const getSkillsBreakdown = async () => {
  return await apiRequest<ApiResponse<Record<string, { current: number, target: number }>>>('/stats/skills-breakdown');
};

export const getCategoryPerformance = async () => {
  return await apiRequest<ApiResponse<CategoryPerf[]>>('/stats/category-performance');
};
