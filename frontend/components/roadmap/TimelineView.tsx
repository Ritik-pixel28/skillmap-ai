"use client";

import { motion } from "framer-motion";
import { Search, Bell, Plus, Clock, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export const TimelineView = ({ 
  roadmapData, 
  loading, 
  error, 
  onRetry 
}: { 
  roadmapData: any, 
  loading: boolean, 
  error: string | null,
  onRetry: () => void
}) => {
  
  const scheduleItems = roadmapData?.weeks?.flatMap((week: any, weekIdx: number) => {
    let currentDayInWeek = 1;
    return week.tasks.map((task: any, taskIdx: number) => {
      const durationDays = parseInt(task.duration) || 1;
      const startDay = (weekIdx * 7) + currentDayInWeek;
      const item = {
        id: `${week.week}-${taskIdx}`,
        title: task.title,
        day: startDay,
        colSpan: durationDays,
        color: taskIdx % 2 === 0 ? "#2563EB" : "#10B981",
        avatars: Math.floor(Math.random() * 3) + 1,
        weekInfo: `Week ${week.week}`,
        durationText: task.duration
      };
      currentDayInWeek += durationDays;
      return item;
    });
  }) || [];

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50/30 backdrop-blur-md overflow-hidden relative">
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white/20 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Roadmap</h1>
          <div className="relative group/search">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within/search:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search project..." 
              className="bg-white/40 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-6 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-200 focus:shadow-lg shadow-slate-100/50 transition-all w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </motion.button>
        </div>
      </div>

      <div className="px-10 pt-10 pb-4 flex items-center justify-between z-10">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {loading ? "Generating Roadmap..." : roadmapData?.duration ? `Mastery Path (${roadmapData.duration})` : "Project Timeline"}
            </h2>
            <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
              <span>{roadmapData?.duration || "Custom duration"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>AI-Generated Schedule</span>
            </div>
         </div>
         <div className="flex items-center gap-2 pr-4">
            <button className="w-8 h-8 rounded-full border border-slate-100 bg-white flex items-center justify-center hover:bg-slate-50">
               <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="w-8 h-8 rounded-full border border-slate-100 bg-white flex items-center justify-center hover:bg-slate-50">
               <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-x-auto custom-scrollbar p-10 relative z-10 h-full">
         <div className="flex flex-col min-w-[1240px] h-full relative">
            
            <div className="flex border-b border-slate-200/50 pb-6 mb-12">
               {days.map((day, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2 group/day cursor-pointer">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider group-hover/day:text-blue-500 transition-colors">{day}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all 
                      ${i === 1 ? "bg-slate-900 text-white shadow-xl shadow-slate-300/50 scale-110" : "text-slate-900 group-hover/day:bg-slate-100"}`}>
                      {24 + i}
                    </div>
                 </div>
               ))}
            </div>

            <div className="absolute top-[80px] bottom-0 left-0 right-0 flex -z-10">
               {days.map((_, i) => (
                 <div key={i} className={`flex-1 border-r border-slate-100/50 ${i === 1 ? "bg-blue-50/10" : ""}`} />
               ))}
            </div>

            <div className="flex-1 flex flex-col gap-8 py-10 relative">
               {loading ? (
                 [1, 2].map((n) => (
                   <div key={n} className="h-28 w-1/3 bg-white/50 rounded-[24px] border border-slate-100 animate-pulse ml-[10%]" />
                 ))
               ) : (
                 scheduleItems.map((item: any, index: number) => {
                   const step = 100 / days.length;
                   const left = (step * (item.day - 1)) % 100;
                   const width = Math.min(step * item.colSpan, 100 - left);

                   return (
                     <motion.div
                       key={item.id}
                       initial={{ opacity: 0, x: 50 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.1 + index * 0.05, type: "spring", stiffness: 100 }}
                       className="relative cursor-pointer group/card h-28"
                       style={{ 
                          left: `${left}%`, 
                          width: `${width}%`,
                          minWidth: '200px'
                       }}
                     >
                       <div className="h-full rounded-[24px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 p-5 flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-300 transition-all hover:scale-[1.02] active:scale-95 group/detail overflow-hidden relative">
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1.5"
                            style={{ backgroundColor: item.color }}
                          />

                          <div>
                             <div className="flex items-center justify-between mb-2">
                               <h4 className="text-[15px] font-black text-slate-800 tracking-tight leading-none truncate pr-4">
                                 {item.title}
                               </h4>
                               <div className="text-[10px] font-black text-slate-400 group-hover/card:text-blue-500 transition-colors uppercase whitespace-nowrap">
                                  {item.durationText}
                               </div>
                             </div>
                             <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                               <Clock className="w-3 h-3" />
                               <span>{item.weekInfo}</span>
                             </div>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                             <div className="flex -space-x-3">
                                {Array.from({ length: item.avatars }).map((_, a) => (
                                  <div key={a} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                                ))}
                             </div>
                          </div>
                       </div>
                     </motion.div>
                   );
                 })
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
