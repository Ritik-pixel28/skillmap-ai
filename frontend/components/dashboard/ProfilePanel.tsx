"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Brain, Star } from "lucide-react";

interface ProfilePanelProps {
  user: {
    name: string;
    role: string;
    avatar: string;
    skills: string[];
    weeklyProgress: number;
  };
}

export const ProfilePanel = ({ user }: ProfilePanelProps) => {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 ring-4 ring-white shadow-xl">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full ring-4 ring-white shadow-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">{user.name}</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">{user.role}</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-2xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
            <p className="text-sm font-black text-slate-900">#42</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">XP</p>
            <p className="text-sm font-black text-slate-900">12k</p>
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
          {user.skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-100/50"
            >
              {skill}
            </motion.span>
          ))}
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
