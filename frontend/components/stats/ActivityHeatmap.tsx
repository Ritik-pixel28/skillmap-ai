"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

interface HeatmapEntry {
  date: string;
  xp: number;
  intensity: number;
}

interface ActivityHeatmapProps {
  data: HeatmapEntry[];
}

export const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  const intensityColors = [
    "bg-slate-50",
    "bg-blue-200",
    "bg-blue-400",
    "bg-blue-600",
    "bg-blue-800"
  ];

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Activity</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Less</span>
          {intensityColors.map((color, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-sm ${color}`} />
          ))}
          <span className="text-[10px] font-bold text-slate-400 uppercase">More</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {data.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative"
          >
            <div 
              className={`w-8 h-8 rounded-lg ${intensityColors[day.intensity]} border border-slate-100 shadow-sm transition-all group-hover:ring-2 group-hover:ring-blue-100 cursor-default`}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
              {format(new Date(day.date), "MMM d")}: {day.xp} XP
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
            </div>
          </motion.div>
        ))}
      </div>
      
      <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
        Last 14 days contribution momentum
      </p>
    </div>
  );
};
