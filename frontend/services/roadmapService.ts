import { apiRequest } from '../lib/api';

export const saveProfile = async (profileData: { career_goal: string, skill_level: string, weekly_hours: number }) => {
  return await apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

export const generateRoadmap = async () => {
  return await apiRequest('/roadmap/generate', {
    method: 'POST',
  });
};
