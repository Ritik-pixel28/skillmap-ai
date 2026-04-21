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

export interface DashboardTask {
  readonly id: string | number;
  readonly week: number;
  readonly title: string;
  readonly desc: string;
  readonly tag: string;
  readonly status: 'Done' | 'In Progress';
}

export interface DashboardActivity {
  readonly id: number;
  readonly type: string;
  readonly action: string;
  readonly xp: number;
  readonly timestamp?: string;
  readonly time?: string;
}
