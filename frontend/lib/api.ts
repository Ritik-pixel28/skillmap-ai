const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
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

    return data;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error(`Backend server is not reachable at ${API_URL}`);
    }
    throw error;
  }
}

export const generateRoadmap = async () => {
  return await apiRequest('/roadmap/generate', {
    method: 'POST',
  });
};

export const getRoadmap = async () => {
  return await apiRequest('/roadmap/current');
};

export const updateTaskStatus = async (weekNumber: number, taskTitle: string, completed: boolean) => {
  return await apiRequest('/roadmap/task', {
    method: 'PATCH',
    body: JSON.stringify({
      week_number: weekNumber,
      task_title: taskTitle,
      completed
    })
  });
};

export const getUserProfile = async () => {
  return await apiRequest('/profile');
};

export const getStatsOverview = async () => {
  return await apiRequest('/stats/overview');
};

export const getXpHistory = async (days: number = 7) => {
  return await apiRequest(`/stats/xp-history?days=${days}`);
};

export const getHeatmapData = async () => {
  return await apiRequest('/stats/heatmap');
};

export const getInsights = async () => {
  return await apiRequest('/stats/insights');
};

export const getSkillsBreakdown = async () => {
  return await apiRequest('/stats/skills-breakdown');
};

export const getCategoryPerformance = async () => {
  return await apiRequest('/stats/category-performance');
};
