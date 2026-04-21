import { apiRequest } from '@/lib/api';

export interface Resource {
  id: number;
  title: string;
  type: 'article' | 'video' | 'course';
  url: string;
  description: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string | null;
  source: string | null;
  tags: string | null;
  career_goals: string | null;
  is_saved: boolean;
}

export interface APIResourceResponse {
  success: boolean;
  data: Resource[] | null;
  message?: string;
  error?: string;
}

export const getAllResources = async (params?: {
  search?: string;
  type?: string;
  difficulty?: string;
}): Promise<Resource[]> => {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.type) query.set('type', params.type);
  if (params?.difficulty) query.set('difficulty', params.difficulty);
  const qs = query.toString() ? `?${query.toString()}` : '';
  const res: APIResourceResponse = await apiRequest(`/resources${qs}`);
  return res.data ?? [];
};

export const getRecommendedResources = async (): Promise<Resource[]> => {
  const res: APIResourceResponse = await apiRequest('/resources/recommended');
  return res.data ?? [];
};

export const getSavedResources = async (): Promise<Resource[]> => {
  const res: APIResourceResponse = await apiRequest('/resources/saved');
  return res.data ?? [];
};

export const saveResource = async (resourceId: number): Promise<boolean> => {
  const res = await apiRequest('/resources/save', {
    method: 'POST',
    body: JSON.stringify({ resource_id: resourceId }),
  });
  return res.success as boolean;
};

export const unsaveResource = async (resourceId: number): Promise<boolean> => {
  const res = await apiRequest(`/resources/save/${resourceId}`, {
    method: 'DELETE',
  });
  return res.success as boolean;
};

export const linkResource = async (resourceId: number, weekNumber: number): Promise<boolean> => {
  const res = await apiRequest('/resources/link', {
    method: 'POST',
    body: JSON.stringify({ resource_id: resourceId, week_number: weekNumber }),
  });
  return res.success as boolean;
};
