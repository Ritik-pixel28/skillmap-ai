import { apiRequest } from "@/lib/api";
import { ApiResponse, User } from "@/lib/types";

export interface ProfileData {
  education: string;
  career_goal: string;
  skill_level: string;
  weekly_hours: number;
  timeline: number;
}

export async function saveProfile(data: ProfileData): Promise<ApiResponse<User>> {
  return await apiRequest<ApiResponse<User>>("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getProfile(): Promise<ApiResponse<User>> {
  return await apiRequest<ApiResponse<User>>("/profile", {
    method: "GET",
  });
}
