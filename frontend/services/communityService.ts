import { apiRequest } from '@/lib/api';

export interface PostComment {
  id: number;
  user_id: number;
  author_name: string;
  author_career_goal: string | null;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: number;
  user_id: number;
  type: 'milestone' | 'question' | 'share';
  content: string;
  created_at: string;
  author_name: string;
  author_career_goal: string | null;
  likes_count: number;
  liked_by_me: boolean;
  comments_count: number;
  comments: PostComment[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  name: string;
  career_goal: string | null;
  total_xp: number;
  current_streak: number;
  completed_tasks: number;
  is_me: boolean;
}

export interface SharedRoadmap {
  user_id: number;
  user_name: string;
  career_goal: string | null;
  skill_level: string | null;
  total_weeks: number;
  completed_tasks: number;
  total_tasks: number;
  completion_rate: number;
  created_at: string | null;
}

export interface CommunityStats {
  total_posts: number;
  total_members: number;
}

export const getCommunityStats = async (): Promise<CommunityStats> => {
  const res = await apiRequest('/community/stats');
  return res.data ?? { total_posts: 0, total_members: 0 };
};

export const getFeed = async (): Promise<CommunityPost[]> => {
  const res = await apiRequest('/community/feed');
  return res.data ?? [];
};

export const createPost = async (type: string, content: string): Promise<CommunityPost | null> => {
  const res = await apiRequest('/community/posts', {
    method: 'POST',
    body: JSON.stringify({ type, content }),
  });
  return res.success ? res.data : null;
};

export const deletePost = async (postId: number): Promise<boolean> => {
  const res = await apiRequest(`/community/posts/${postId}`, {
    method: 'DELETE',
  });
  return res.success;
};

export const toggleLike = async (postId: number): Promise<{ liked: boolean; likes_count: number } | null> => {
  const res = await apiRequest(`/community/posts/${postId}/like`, {
    method: 'POST',
  });
  return res.success ? res.data : null;
};

export const addComment = async (postId: number, content: string): Promise<PostComment | null> => {
  const res = await apiRequest(`/community/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return res.success ? res.data : null;
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const res = await apiRequest('/community/leaderboard');
  return res.data ?? [];
};

export const getSharedRoadmaps = async (careerGoal?: string): Promise<SharedRoadmap[]> => {
  const qs = careerGoal ? `?career_goal=${encodeURIComponent(careerGoal)}` : '';
  const res = await apiRequest(`/community/roadmaps${qs}`);
  return res.data ?? [];
};
