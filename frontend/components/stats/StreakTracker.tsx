"use client";

import { Flame, Trophy, Target, Sparkles } from "lucide-react";

interface HeatmapEntry {
  date: string;
  xp: number;
  intensity: number;
}

interface StreakTrackerProps {
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  activityData: HeatmapEntry[];
}

export const StreakTracker = ({ currentStreak, bestStreak, completionRate, activityData }: StreakTrackerProps) => {
  const isInactiveToday = activityData.length > 0 && activityData[activityData.length - 1].xp === 0;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Smart Streak Card */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${
              isInactiveToday ? "bg-slate-100 text-slate-400" : "bg-orange-50 text-orange-500 shadow-orange-100"
            }`}>
              <Flame className={`w-7 h-7 ${isInactiveToday ? "" : "fill-current"}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ongoing Momentum</p>
              <h4 className="text-2xl font-black text-slate-900">{currentStreak} Days</h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest">Record: {bestStreak}</span>
          </div>
        </div>

        {/* Activity Mini Timeline */}
        <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 mb-6">
          <div className="flex gap-1.5">
            {activityData.slice(-7).map((day, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  day.xp > 0 ? "bg-orange-500 scale-110 shadow-sm shadow-orange-200" : "bg-slate-200"
                }`}
                title={`${day.date}: ${day.xp} XP`}
              />
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Last 7 Days</p>
        </div>

        {isInactiveToday ? (
          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-xl border border-orange-100/50">
            <Sparkles className="w-4 h-4" />
            <p className="text-xs font-black uppercase tracking-tight">Keep streak alive 🔥 — do a task!</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100/50">
            <Sparkles className="w-4 h-4" />
            <p className="text-xs font-black uppercase tracking-tight">You're on fire! Keep pushing 🚀</p>
          </div>
        )}
      </div>

      {/* Completion status with hover elevation */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-100">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Completion</p>
            <h4 className="text-2xl font-black text-slate-900">{completionRate}%</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
