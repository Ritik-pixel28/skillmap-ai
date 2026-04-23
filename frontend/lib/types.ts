/**
 * Production-ready dashboard type definitions
 */

export type MilestoneStatus = 'completed' | 'current' | 'upcoming';

export interface CareerStage {
  readonly label: string;
  readonly status: MilestoneStatus;
}

export interface Skill {
  readonly subject: string;
  readonly A: number;
  readonly B: number;
  readonly fullMark: number;
}

export interface User {
  readonly name: string;
  readonly role: string;
  readonly avatar: string;
  readonly skills: readonly string[];
  readonly xp: number;
  readonly weeklyProgress: number;
}

// --- Roadmap Types ---

export interface Task {
  readonly id: string | number;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly duration?: string;
  readonly tag?: string;
}

export interface Week {
  readonly week: number;
  readonly title: string;
  readonly tasks: readonly Task[];
}

export interface Roadmap {
  readonly id: number;
  readonly title: string;
  readonly weeks: readonly Week[];
}

export interface DashboardTask extends Task {
  readonly week: number;
  readonly desc: string;
  readonly status: 'Done' | 'In Progress';
}

// --- Stats Types ---

export interface StatsOverview {
  readonly totalXp: number;
  readonly todayXp: number;
  readonly weeklyXp: number;
  readonly currentStreak: number;
  readonly completionRate: number;
  readonly totalTasks: number;
  readonly completedTasks: number;
  readonly pendingTasks: number;
}

export interface XpHistoryEntry {
  readonly date: string;
  readonly xp: number;
}

export interface HeatmapEntry {
  readonly date: string;
  readonly xp: number;
  readonly intensity: number;
}

export interface Insight {
  readonly type: string;
  readonly text: string;
  readonly positive: boolean;
}

export interface CategoryPerf {
  readonly category: string;
  readonly percentage: number;
  readonly completed: number;
  readonly total: number;
}

// --- API Wrappers ---

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
}

export interface DashboardActivity {
  readonly id: number;
  readonly type: string;
  readonly action: string;
  readonly xp: number;
  readonly timestamp?: string;
  readonly time?: string;
}

export interface DashboardData {
  readonly userProfile: User;
  readonly roadmap: Roadmap;
  readonly skills: {
    readonly current: Record<string, number>;
    readonly target: Record<string, number>;
  };
  readonly activity: readonly DashboardActivity[];
  readonly recommendations: readonly { 
    id: number; 
    title: string; 
    type: string; 
    url?: string 
  }[];
}

export interface LoginResponse {
  readonly user_id: number;
  readonly access_token: string;
}

export interface RegisterResponse {
  readonly user_id: number;
}
