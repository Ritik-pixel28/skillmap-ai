"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  Target,
  ArrowRight
} from "lucide-react";

interface RightPanelProps {
  tasks: any[];
  activity: any[];
}

export const RightPanel = ({ tasks, activity }: RightPanelProps) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');

  return (
    <div className="w-full flex flex-col gap-8 h-full">
      {/* Task/Goals Tab Panel */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden ">
        <div className="p-4 flex gap-2 border-b border-slate-50">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 px-6 rounded-2xl font-black text-sm transition-all
              ${activeTab === 'tasks' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-3 px-6 rounded-2xl font-black text-sm transition-all
              ${activeTab === 'goals' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
          >
            Goals
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {activeTab === 'tasks' ? (
                tasks.map((task) => (
                  <div key={task.id} className="p-4 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 border border-transparent hover:border-slate-100 rounded-3xl transition-all group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {task.status === "Done" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-900 mb-1 leading-tight">{task.title}</h4>
                        <p className="text-xs font-bold text-slate-400 mb-3 line-clamp-1">{task.desc}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg">
                            {task.tag}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                  <Target className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-400">Master Full-Stack Path</p>
                  <p className="text-xs font-medium text-slate-400 mt-1">Goal completion at 45%</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <button className="w-full mt-6 flex items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest leading-none">
            View full list <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col flex-1 min-h-[400px]">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Latest Activity</h3>
        
        <div className="relative flex flex-col gap-8">
          <div className="absolute top-2 left-6 bottom-4 w-0.5 bg-slate-50" />
          
          {activity.map((item, idx) => (
            <div key={item.id} className="relative flex gap-6 z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow-lg
                ${item.type === 'completed' ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"}`}>
                {item.type === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div className="pt-1">
                <p className="text-sm font-black text-slate-900 leading-tight mb-1">{item.action}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">{item.time}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Growth +20 XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
