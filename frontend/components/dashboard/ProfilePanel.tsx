"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Brain, Star, Loader2 } from "lucide-react";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { useEffect } from "react";

interface ProfilePanelProps {
  user: {
    skills: string[];
    weeklyProgress: number;
    xp: number;
  };
}

export const ProfilePanel = ({ user }: ProfilePanelProps) => {
  const { name, avatar, role, rank, xp, fetchProfile, lastUpdated, isLoading } = useProfileStore();

  useEffect(() => {
    // Fetch on mount if stale (older than 5 minutes)
    const isStale = !lastUpdated || Date.now() - lastUpdated > 5 * 60 * 1000;
    if (isStale) fetchProfile();
  }, [fetchProfile, lastUpdated]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        {isLoading && !name && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
             <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        )}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 ring-4 ring-white shadow-xl bg-slate-100 flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt={name || "User"} className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl font-black text-blue-600">
                  {name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full ring-4 ring-white shadow-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">{name}</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">{role}</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-2xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
            <p className="text-sm font-black text-slate-900">#{rank}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total XP</p>
            <p className="text-sm font-black text-slate-900">{xp || user.xp || "0"}</p>
          </div>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">My Skills</h3>
          <Star className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, i) => (
              <motion.span
                key={`${skill}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-100/50"
              >
                {skill}
              </motion.span>
            ))
          ) : (
            <p className="text-xs font-bold text-slate-400 italic">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Weekly Focus</h3>
          </div>
          <span className="text-lg font-black text-indigo-600">{user.weeklyProgress}%</span>
        </div>
        
        <div className="space-y-4">
          <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${user.weeklyProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 relative rounded-full"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />
            </motion.div>
          </div>
          <div className="flex justify-between text-[10px] font-black text-slate-400">
            <span>START</span>
            <span>GOAL: 100%</span>
          </div>
        </div>
      </div>

      {/* Mentorship / Feedback Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[32px] text-white shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-200">AI Mentor</h3>
        </div>
        <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
          "Focus on Backend API testing this week to hit your Full Stack milestone."
        </p>
      </div>
    </div>
  );
};
