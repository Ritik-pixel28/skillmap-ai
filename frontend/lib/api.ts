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
      // Handle 401 Unauthorized by redirecting to login
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
