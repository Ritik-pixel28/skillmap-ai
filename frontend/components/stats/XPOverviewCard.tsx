"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Calendar } from "lucide-react";

interface XPOverviewCardProps {
  totalXp?: number;
  todayXp?: number;
  weeklyXp?: number;
}

export const XPOverviewCard = ({ totalXp, todayXp, weeklyXp }: XPOverviewCardProps) => {
  const formatVal = (val?: number) => val !== undefined ? val.toLocaleString() : "---";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Total XP Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-xl shadow-blue-200/20 relative overflow-hidden group"
      >
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 blur-[50px] rounded-full group-hover:scale-125 transition-transform duration-700" />
        <div className="relative z-10">
          <div className="p-3 bg-white/20 rounded-2xl w-fit mb-6">
            <Zap className="w-6 h-6 text-yellow-300" />
          </div>
          <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-2">Total Experience</p>
          <h3 className="text-4xl font-black">{formatVal(totalXp)} <span className="text-lg font-bold text-blue-200">XP</span></h3>
        </div>
      </motion.div>

      {/* Today's XP Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm"
      >
        <div className="p-3 bg-emerald-50 rounded-2xl w-fit mb-6 text-emerald-600">
          <TrendingUp className="w-6 h-6" />
        </div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Gained Today</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-900">+{formatVal(todayXp)}</h3>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">+12%</span>
        </div>
      </motion.div>

      {/* Weekly XP Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm"
      >
        <div className="p-3 bg-blue-50 rounded-2xl w-fit mb-6 text-blue-600">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Weekly Growth</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-900">+{formatVal(weeklyXp)}</h3>
          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">Target: 500</span>
        </div>
      </motion.div>
    </div>
  );
};
