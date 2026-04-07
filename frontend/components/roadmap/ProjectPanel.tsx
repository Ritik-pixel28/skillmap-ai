"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Calendar, ChevronRight } from "lucide-react";

export const ProjectPanel = ({ roadmapData, loading }: { roadmapData: any, loading: boolean }) => {
  // Extract projects from backend data or use empty array
  const projects = roadmapData?.weeks?.map((w: any) => ({
    id: w.week,
    title: w.title,
    status: w.week === 1 ? "In progress" : "Planned",
    progress: w.week === 1 ? 25 : 0,
    date: `Week ${w.week}`,
    active: w.week === 1
  })) || [];

  return (
    <div className="w-80 h-full border-r border-slate-100/50 flex flex-col pt-10 px-6 shrink-0 bg-white/40 backdrop-blur-sm z-10">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Projects</h2>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pb-10 custom-scrollbar">
        {loading ? (
          // Skeleton Loaders
          [1, 2, 3].map((n) => (
            <div key={n} className="p-6 rounded-[28px] bg-white border border-slate-100 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="w-20 h-4 bg-slate-100 rounded-full" />
                <div className="w-12 h-4 bg-slate-100 rounded-full" />
              </div>
              <div className="w-full h-6 bg-slate-100 rounded-lg mb-6" />
              <div className="w-full h-2 bg-slate-100 rounded-full" />
            </div>
          ))
        ) : (
          projects.map((project: any, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              className={`p-6 rounded-[28px] cursor-pointer transition-all border 
                ${project.active 
                  ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-blue-500/10" 
                  : "bg-white border-slate-100 text-slate-900 hover:border-slate-200 hover:shadow-xl shadow-slate-100/50 shadow-sm"
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full 
                  ${project.active ? "bg-white/10 text-white/80" : "bg-slate-50 text-slate-400"}`}>
                  {project.status}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-black">
                  <Calendar className="w-3 h-3" />
                  {project.date}
                </div>
              </div>

              <h3 className="text-lg font-black leading-tight mb-6 pr-4">
                {project.title}
              </h3>

              <div className="flex items-center justify-between gap-4 mb-2">
                 <div className="flex -space-x-3">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center overflow-hidden">
                         <div className="w-full h-full bg-gradient-to-br from-blue-300 to-indigo-400" />
                      </div>
                    ))}
                 </div>
                 <span className={`text-xs font-black ${project.active ? "text-white/60" : "text-slate-400"}`}>
                   {project.progress}%
                 </span>
              </div>

              <div className={`w-full h-1.5 rounded-full overflow-hidden 
                ${project.active ? "bg-white/10" : "bg-slate-100"}`}>
                <motion.div 
                  className={`h-full ${project.active ? "bg-white" : "bg-blue-600"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-10">
             <p className="text-slate-400 font-bold text-sm">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};
