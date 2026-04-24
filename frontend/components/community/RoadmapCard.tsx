"use client";

import { motion } from "framer-motion";
import { BarChart2, CheckCircle2, Calendar, GraduationCap, Users } from "lucide-react";
import { SharedRoadmap } from "@/services/communityService";

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

function getAvatarColor(userId: number): string {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const SKILL_COLORS: Record<string, string> = {
  Beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-600 bg-amber-50 border-amber-200",
  Advanced: "text-rose-600 bg-rose-50 border-rose-200",
};

interface RoadmapCardProps {
  roadmap: SharedRoadmap;
  index: number;
}

export default function RoadmapCard({ roadmap, index }: RoadmapCardProps) {
  const skillStyle = SKILL_COLORS[roadmap.skill_level ?? ""] ?? "text-slate-600 bg-slate-50 border-slate-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
    >
      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarColor(roadmap.user_id)} flex items-center justify-center shrink-0`}
        >
          <span className="text-xs font-black text-white">{getInitials(roadmap.user_name)}</span>
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">{roadmap.user_name}</p>
          {roadmap.skill_level && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${skillStyle}`}>
              {roadmap.skill_level}
            </span>
          )}
        </div>
      </div>

      {/* Career Goal */}
      {roadmap.career_goal && (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-sm font-bold text-slate-700 truncate">{roadmap.career_goal}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-500">Progress</span>
          <span className="text-xs font-black text-blue-600">{roadmap.completion_rate}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${roadmap.completion_rate}%` }}
            transition={{ duration: 0.8, delay: index * 0.05 + 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 pt-1 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {roadmap.total_weeks} weeks
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {roadmap.completed_tasks}/{roadmap.total_tasks} tasks
        </div>
      </div>
    </motion.div>
  );
}
