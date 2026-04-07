"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Clock, Star } from "lucide-react";

interface RoadmapCardProps {
  week: number;
  title: string;
  tasks: string[];
  index: number;
}

export const RoadmapCard = ({ week, title, tasks, index }: RoadmapCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1, 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -8 }}
      className="group relative bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col gap-4 min-w-[120px]">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-100">
            <Star className="w-3 h-3 fill-current" />
            Week {week}
          </span>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>7 Days</span>
          </div>
        </div>

        <div className="flex-1 w-full">
          <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100/50 group-hover:bg-white group-hover:border-blue-100/50 transition-all group/task"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xs group-hover/task:border-blue-500 group-hover/task:text-blue-500 transition-all shrink-0">
                  {i + 1}
                </div>
                <span className="text-[15px] font-bold text-slate-700 leading-snug">
                  {task}
                </span>
                <div className="ml-auto opacity-0 group-hover/task:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex -space-x-4">
               {[1, 2, 3].map((n) => (
                 <div 
                   key={n}
                   className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center overflow-hidden"
                 >
                   <div className="w-full h-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">
                     S{n}
                   </div>
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full bg-slate-50 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                 +2
               </div>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm hover:scale-105 transition-transform">
               Start This Week
               <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};
