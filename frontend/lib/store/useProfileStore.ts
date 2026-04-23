import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

interface ProfileState {
  name: string;
  username: string;
  bio: string;
  avatar: string | null;
  role: string;
  location: string;
  timezone: string;
  website: string;
  xp: number;
  rank: string;
  isLoading: boolean;
  isUpdating: boolean;
  lastUpdated: number | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileState>) => Promise<void>;
  setAvatar: (avatarUrl: string) => void;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setBio: (bio: string) => void;
  setRole: (role: string) => void;
  setLocation: (location: string) => void;
  setTimezone: (timezone: string) => void;
  setWebsite: (website: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      name: 'Ritik',
      username: 'ritik-pixel28',
      bio: 'Building AI-driven learning experiences.',
      avatar: null,
      role: 'Aspiring Full Stack Engineer',
      location: 'San Francisco, CA',
      timezone: 'UTC-8',
      website: 'https://skillmap.ai',
      xp: 12200,
      rank: '42',
      isLoading: false,
      isUpdating: false,
      lastUpdated: null,

      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const res = await apiRequest<ApiResponse<any>>('/profile');
          if (res.success) {
            set({
              ...res.data,
              isLoading: false,
              lastUpdated: Date.now(),
            });
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          set({ isLoading: false });
          console.error('Failed to fetch profile:', err);
        }
      },

      updateProfile: async (updates) => {
        set({ isUpdating: true });
        const previousState = { ...get() };
        set({ ...updates });
        
        try {
          const res = await apiRequest<ApiResponse<any>>('/profile', {
            method: 'PUT',
            body: JSON.stringify(updates),
          });
          
          if (!res.success) throw new Error(res.message || 'Failed to update');
          
          set({ isUpdating: false, lastUpdated: Date.now() });
        } catch (err) {
          set({ ...previousState, isUpdating: false });
          throw err;
        }
      },

      setAvatar: (avatarUrl) => set({ avatar: avatarUrl, lastUpdated: Date.now() }),
      setName: (name) => set({ name, lastUpdated: Date.now() }),
      setUsername: (username) => set({ username, lastUpdated: Date.now() }),
      setBio: (bio) => set({ bio, lastUpdated: Date.now() }),
      setRole: (role) => set({ role, lastUpdated: Date.now() }),
      setLocation: (location) => set({ location, lastUpdated: Date.now() }),
      setTimezone: (timezone) => set({ timezone, lastUpdated: Date.now() }),
      setWebsite: (website) => set({ website, lastUpdated: Date.now() }),
    }),
    {
      name: 'skillmap-profile-storage',
      partialize: (state) => ({
        name: state.name,
        username: state.username,
        bio: state.bio,
        avatar: state.avatar,
        role: state.role,
        location: state.location,
        xp: state.xp,
        rank: state.rank,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
