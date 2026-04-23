import { apiRequest } from '../lib/api';
import { ApiResponse, Roadmap, User } from '../lib/types';

export const saveProfile = async (profileData: { career_goal: string, skill_level: string, weekly_hours: number }): Promise<ApiResponse<User>> => {
  return await apiRequest<ApiResponse<User>>('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

export const generateRoadmap = async (): Promise<ApiResponse<Roadmap>> => {
  return await apiRequest<ApiResponse<Roadmap>>('/roadmap/generate', {
    method: 'POST',
  });
};
