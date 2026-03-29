import { apiRequest } from "@/lib/api";

export interface ProfileData {
  education: string;
  career_goal: string;
  skill_level: string;
  weekly_hours: number;
  timeline: number;
}

export async function saveProfile(data: ProfileData) {
  try {
    const response = await apiRequest("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error: any) {
    console.error("Error saving profile:", error);
    throw error;
  }
}

export async function getProfile() {
  try {
    const response = await apiRequest("/profile", {
      method: "GET",
    });
    return response;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}
