"use client";

import { motion } from "framer-motion";
import { TrendingUp, Layout, Calendar, Clock } from "lucide-react";

export const RoadmapHeader = ({ totalWeeks }: { totalWeeks: number }) => {
  return (
    <div className="w-full bg-white/50 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Generated Roadmap</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Career Accelerator</h1>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">PROGRAM DURATION</span>
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{totalWeeks} Weeks</span>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />

          <div className="flex items-center gap-4">
             <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                   className="h-full bg-blue-600"
                   initial={{ width: 0 }}
                   animate={{ width: "10%" }} // Just starting
                   transition={{ duration: 1, delay: 1 }}
                />
             </div>
             <span className="text-sm font-black text-slate-900 tracking-tight">0% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};
