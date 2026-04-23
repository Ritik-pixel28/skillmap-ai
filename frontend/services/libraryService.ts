import { apiRequest } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

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
  const res = await apiRequest<ApiResponse<Resource[]>>(`/resources${qs}`);
  return res.data ?? [];
};

export const getRecommendedResources = async (): Promise<Resource[]> => {
  const res = await apiRequest<ApiResponse<Resource[]>>('/resources/recommended');
  return res.data ?? [];
};

export const getSavedResources = async (): Promise<Resource[]> => {
  const res = await apiRequest<ApiResponse<Resource[]>>('/resources/saved');
  return res.data ?? [];
};

export const saveResource = async (resourceId: number): Promise<boolean> => {
  const res = await apiRequest<ApiResponse<any>>('/resources/save', {
    method: 'POST',
    body: JSON.stringify({ resource_id: resourceId }),
  });
  return res.success;
};

export const unsaveResource = async (resourceId: number): Promise<boolean> => {
  const res = await apiRequest<ApiResponse<any>>(`/resources/save/${resourceId}`, {
    method: 'DELETE',
  });
  return res.success;
};

export const linkResource = async (resourceId: number, weekNumber: number): Promise<boolean> => {
  const res = await apiRequest<ApiResponse<any>>('/resources/link', {
    method: 'POST',
    body: JSON.stringify({ resource_id: resourceId, week_number: weekNumber }),
  });
  return res.success;
};
