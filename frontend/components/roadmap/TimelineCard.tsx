import { motion } from "framer-motion";
import { Clock, CheckCircle2, Circle } from "lucide-react";

interface TimelineCardProps {
  task: {
    id: any;
    title: string;
    duration?: string;
    completed: boolean;
    week?: number;
    weekTitle?: string;
    subtopics?: string[];
  };
  index: number;
  isLeft: boolean;
  onToggle: () => void;
  showWeekBadge?: boolean;
  isActive?: boolean;
  onSelect: () => void;
}

export const TimelineCard = ({ task, index, isLeft, onToggle, showWeekBadge, isActive, onSelect }: TimelineCardProps) => {
  const isCompleted = task.completed;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`flex items-center w-full mb-12 ${isLeft ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="w-1/2" />
      
      <div className="relative z-10 flex items-center justify-center w-12 shrink-0">
        <div className={`w-4 h-4 rounded-full border-4 border-slate-50 transition-all duration-500 shadow-xl
          ${isCompleted ? "bg-emerald-500 shadow-emerald-500/30 scale-125" : "bg-blue-600 shadow-blue-500/30"}`} 
        />
      </div>

      <div className={`w-1/2 ${isLeft ? "pr-12 text-right" : "pl-12 text-left"}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.05 }}
          onClick={onSelect}
          className={`group p-7 rounded-[32px] border-2 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between
            min-w-[260px] sm:min-w-[280px] lg:min-w-[320px] min-h-[160px]
            ${isActive 
              ? "bg-white border-blue-500 shadow-2xl shadow-blue-500/10" 
              : isCompleted 
                ? "bg-emerald-50/50 border-emerald-100 shadow-emerald-100" 
                : "bg-white border-slate-100 shadow-xl shadow-slate-200/40 hover:border-slate-300 hover:shadow-2xl"
            }`}
        >
          <div className={`absolute top-0 bottom-0 w-1.5 ${isLeft ? "right-0" : "left-0"} transition-all duration-500
            ${isActive ? "bg-blue-500 opacity-100" : isCompleted ? "bg-emerald-500 opacity-100" : "bg-blue-600 opacity-0 group-hover:opacity-100"}`} 
          />
          
          <div className="flex flex-col gap-4">
            {showWeekBadge && (
              <div className={`flex items-center gap-2 mb-2 p-2 rounded-2xl bg-slate-50 border border-slate-100/50 ${isLeft ? "flex-row-reverse" : "flex-row"}`}>
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  W{task.week}
                </div>
                <div className={`flex flex-col overflow-hidden ${isLeft ? "text-right" : "text-left"}`}>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter truncate">
                    {task.weekTitle || "Topic Phase"}
                  </span>
                </div>
              </div>
            )}

            <div className={`flex items-center gap-3 ${isLeft ? "justify-end" : "justify-start"}`}>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors
                ${isActive ? "bg-blue-500 text-white" : isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                Task {index + 1}
              </span>
              {task.duration && (
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
                  <Clock className="w-3 h-3" />
                  {task.duration}
                </div>
              )}
            </div>

            <h4 className={`text-xl font-black tracking-tight leading-relaxed break-words transition-colors
              ${isCompleted ? "text-emerald-700 line-through opacity-70" : "text-slate-800 group-hover:text-blue-600"}`}>
              {task.title}
            </h4>
          </div>

          <div className={`flex items-center gap-2 mt-4 ${isLeft ? "justify-end" : "justify-start"}`}>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className={`flex items-center gap-2 text-sm font-bold transition-all z-20 hover:scale-105 active:scale-95
              ${isCompleted ? "text-emerald-600" : "text-slate-400 hover:text-blue-500"}`}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              {isCompleted ? "Completed" : "Mark as complete"}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
