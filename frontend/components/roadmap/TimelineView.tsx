import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Bell, 
  Plus, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Calendar as CalendarIcon,
  PlayCircle,
  CheckCircle2
} from "lucide-react";
import { TimelineCard } from "./TimelineCard";

export const TimelineView = ({ 
  roadmapData, 
  loading, 
  error, 
  onRetry,
  selectedWeek,
  onToggleTask,
  selectedTask,
  setSelectedTask
}: { 
  roadmapData: any, 
  loading: boolean, 
  error: string | null,
  onRetry: () => void,
  selectedWeek: number | null,
  onToggleTask: (weekNumber: number, taskId: any) => void,
  selectedTask: any | null,
  setSelectedTask: (task: any | null) => void
}) => {
  const [isStarted, setIsStarted] = useState(false);
  
  useEffect(() => {
    setIsStarted(false);
  }, [selectedWeek]);
  
  const getDates = () => {
    const dates = [];
    const start = new Date();
    for (let i = 0; i < 56; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push({
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        fullDate: d.toDateString()
      });
    }
    return dates;
  };

  const dates = getDates();
 
  const allTasks = roadmapData?.weeks?.flatMap((week: any) => {
    if (!week.tasks) return [];
    return week.tasks.map((task: any, index: number) => ({
      ...task,
      week: week.week,
      weekTitle: week.title,
      uniqueId: `${week.week}-${task.id || index}`
    }));
  }) || [];

  const filteredTasks = selectedWeek !== null
    ? allTasks.filter((task: any) => String(task.week) === String(selectedWeek))
    : allTasks;

  const currentWeekData = selectedWeek !== null
    ? roadmapData?.weeks?.find((w: any) => String(w.week) === String(selectedWeek))
    : null;

  return (
    <div className="flex-1 h-full flex flex-col bg-white overflow-hidden relative min-w-0">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #64748b 1px, transparent 1px),
            linear-gradient(to bottom, #64748b 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="h-24 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Timeline</h1>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Master Plan</span>
          </div>
          <div className="relative group/search hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within/search:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter tasks..." 
              className="bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-6 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-200 focus:shadow-lg shadow-slate-100/50 transition-all w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full" />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-black transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </motion.button>
        </div>
      </div>

      <div className="h-20 bg-white/50 backdrop-blur-sm border-b border-slate-100 px-6 flex items-center overflow-x-auto custom-scrollbar shrink-0 z-10">
        <div className="flex items-center gap-2 min-w-max">
          {dates.map((d, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all cursor-pointer
                ${i === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "hover:bg-slate-100 text-slate-500"}`}
            >
              <span className={`text-[9px] font-black uppercase mb-0.5 ${i === 0 ? "text-white/70" : "text-slate-400"}`}>
                {d.dayName}
              </span>
              <span className="text-sm font-black leading-none">{d.dayNum}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-12 custom-scrollbar z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col pt-4">
          
          <div className="flex items-center justify-between mb-16 px-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  {selectedWeek !== null ? `Week ${selectedWeek}` : "All Weeks"}
                </span>
                <span className="text-slate-400 font-bold text-sm">
                  {selectedWeek !== null ? "Focused View" : "Overview Path"}
                </span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none capitalize">
                {selectedWeek !== null ? (currentWeekData?.title || `Week ${selectedWeek} Roadmap`) : "Complete Skill Mastery"}
              </h2>
            </div>
            
            {selectedWeek && (
              <button 
                onClick={() => setIsStarted(!isStarted)}
              className={`flex items-center gap-2 px-6 py-4 rounded-3xl font-black transition-all
                ${isStarted 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
            >
              {isStarted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  In Progress
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Start Week
                </>
              )}
              </button>
            )}
          </div>

          <div className="relative">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-48 bg-slate-50 rounded-[32px] animate-pulse" />
                ))}
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className={`
                ${selectedWeek 
                  ? "flex flex-col relative" 
                  : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 px-4" 
                }`}
              >
                {selectedWeek && (
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-slate-200 to-transparent -translate-x-1/2 hidden md:block" />
                )}

                {selectedWeek ? (
                  filteredTasks.map((task: any, index: number) => (
                    <TimelineCard 
                      key={task.uniqueId}
                      task={task}
                      index={index}
                      isLeft={index % 2 === 0}
                      onToggle={() => onToggleTask(task.week, task.id)}
                      showWeekBadge={false}
                      isActive={selectedTask?.uniqueId === task.uniqueId}
                      onSelect={() => setSelectedTask(task)}
                    />
                  ))
                ) : (
                  roadmapData?.weeks?.map((week: any) => (
                    <div key={week.week} className="flex flex-col gap-6 col-span-full mb-12 last:mb-0">
                      <div className="flex items-center gap-4 px-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm">
                          W{week.week}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-xl font-black text-slate-800 leading-tight">
                            {week.title}
                          </h3>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                             {week.tasks.length} Action Items
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-slate-100 ml-4" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {week.tasks.map((task: any, tIdx: number) => {
                          const uniqueId = `${week.week}-${task.id || tIdx}`;
                          const normalizedTask = {
                            ...task,
                            week: week.week,
                            weekTitle: week.title,
                            id: task.id || tIdx,
                            uniqueId
                          };
                          return (
                            <TimelineCard 
                              key={uniqueId}
                              task={normalizedTask}
                              index={tIdx}
                              isLeft={false}
                              onToggle={() => onToggleTask(week.week, normalizedTask.id)}
                              showWeekBadge={false}
                              isActive={selectedTask?.uniqueId === uniqueId}
                              onSelect={() => setSelectedTask(normalizedTask)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
                <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No tasks found for this selection.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
