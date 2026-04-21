"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface GoalProgressTrackerProps {
  achieved: number;
  target: number;
}

export const GoalProgressTracker = ({ achieved, target }: GoalProgressTrackerProps) => {
  const percentage = Math.min(Math.round((achieved / target) * 100), 100);
  const isExceeded = achieved > target;
  const isOnTrack = percentage >= 60;

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Weekly Goal Progress</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">XP Target: {target}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
          isExceeded ? "bg-amber-50 text-amber-600" : (isOnTrack ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")
        }`}>
          {isExceeded ? <Sparkles className="w-3.5 h-3.5" /> : (isOnTrack ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />)}
          {isExceeded ? "Goal Exceeded" : (isOnTrack ? "On Track" : "Keep Going")}
        </div>
      </div>
      
      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-3xl font-black text-slate-900">{achieved}</span>
          <span className="text-slate-400 font-bold text-sm">/ {target} XP</span>
        </div>
        
        <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full rounded-full relative ${
              isExceeded ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-blue-600 to-indigo-600"
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />
          </motion.div>
        </div>
      </div>
      
      <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
        Goal resets in 4 days
      </p>
    </div>
  );
};
