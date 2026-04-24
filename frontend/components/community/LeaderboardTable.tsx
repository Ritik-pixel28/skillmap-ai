"use client";

import { motion } from "framer-motion";
import { Crown, Trophy, Flame, CheckCircle2 } from "lucide-react";
import { LeaderboardEntry } from "@/services/communityService";

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

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const RANK_STYLES: Record<number, string> = {
  1: "bg-amber-50 border-amber-200",
  2: "bg-slate-50 border-slate-200",
  3: "bg-orange-50 border-orange-200",
};

const RANK_NUMBER_STYLES: Record<number, string> = {
  1: "text-amber-500 font-black",
  2: "text-slate-400 font-black",
  3: "text-orange-400 font-black",
};

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-amber-300" />
        </div>
        <p className="text-lg font-black text-slate-800">No data yet</p>
        <p className="text-sm text-slate-400 mt-1">Complete tasks to appear on the leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry, idx) => {
        const rowStyle = RANK_STYLES[entry.rank] ?? "bg-white border-slate-100";
        const numStyle = RANK_NUMBER_STYLES[entry.rank] ?? "text-slate-500 font-bold";

        return (
          <motion.div
            key={entry.user_id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${rowStyle} ${
              entry.is_me ? "ring-2 ring-blue-300 ring-offset-1" : ""
            }`}
          >
            {/* Rank */}
            <div className="w-8 flex items-center justify-center shrink-0">
              {entry.rank === 1 ? (
                <Crown className="w-6 h-6 text-amber-400" />
              ) : (
                <span className={`text-lg ${numStyle}`}>#{entry.rank}</span>
              )}
            </div>

            {/* Avatar */}
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarColor(entry.user_id)} flex items-center justify-center shrink-0`}
            >
              <span className="text-xs font-black text-white">{getInitials(entry.name)}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-slate-900 truncate">{entry.name}</p>
                {entry.is_me && (
                  <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    You
                  </span>
                )}
              </div>
              {entry.career_goal && (
                <p className="text-xs text-slate-400 font-medium truncate">{entry.career_goal}</p>
              )}
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                {entry.current_streak}d
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {entry.completed_tasks}
              </div>
            </div>

            {/* XP */}
            <div className="shrink-0 text-right">
              <p className="text-lg font-black text-slate-900">{entry.total_xp.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
