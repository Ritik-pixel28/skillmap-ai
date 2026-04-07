import { apiRequest } from '../lib/api';

export const login = async (email: string, password: string) => {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (result.success) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_id', result.data.user_id.toString());
      localStorage.setItem('token', result.data.access_token);
    }
  }
  return result;
};

export const register = async (name: string, email: string, password: string) => {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

export const getCurrentUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id');
  }
  return null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_id');
  }
};
