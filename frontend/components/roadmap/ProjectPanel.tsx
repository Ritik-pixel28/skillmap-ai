import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Calendar, ChevronRight, ChevronLeft, Clock } from "lucide-react";

export const ProjectPanel = ({ 
  roadmapData, 
  loading,
  selectedWeek,
  setSelectedWeek,
  selectedTask,
  setSelectedTask
}: { 
  roadmapData: any, 
  loading: boolean,
  selectedWeek: number | null,
  setSelectedWeek: (week: number | null) => void,
  selectedTask: any | null,
  setSelectedTask: (task: any | null) => void
}) => {
  const calculateProgress = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const weeks = roadmapData?.weeks?.map((w: any) => ({
    id: w.week,
    title: w.title,
    status: w.week === selectedWeek ? "In progress" : (calculateProgress(w.tasks) === 100 ? "Completed" : "Planned"),
    progress: calculateProgress(w.tasks),
    date: `Week ${w.week}`,
    active: w.week === selectedWeek
  })) || [];

  return (
    <div className="w-96 h-full border-r border-slate-100/50 flex flex-col pt-10 px-6 shrink-0 bg-white/40 backdrop-blur-sm z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedTask ? (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setSelectedTask(null)}
                className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Task Details</h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="p-8 rounded-[32px] bg-slate-900 text-white shadow-2xl shadow-slate-900/20 mb-8 border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-full text-white/70">
                    Week {selectedTask.week}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-full text-white/70">
                    {selectedTask.duration}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-4 leading-tight">{selectedTask.title}</h3>
                <div className="flex items-center gap-2 text-white/40 text-xs font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Interactive Learning Map</span>
                </div>
              </div>

              <div className="px-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-3">
                  Key Subtopics
                  <div className="flex-1 h-px bg-slate-100" />
                </h4>
                
                <div className="flex flex-col gap-4 pb-10">
                  {(selectedTask.subtopics || ["Fundamentals", "Practical Implementation", "Case Studies"]).map((topic: string, i: number) => (
                    <motion.div
                      key={topic + i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          0{i + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-700 leading-snug pt-1">
                          {topic}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Project Weeks</h2>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pb-10 custom-scrollbar">
        {!loading && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedWeek(null)}
            className={`p-5 rounded-[24px] cursor-pointer transition-all border flex items-center justify-between
              ${selectedWeek === null 
                ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/20" 
                : "bg-white border-slate-100 text-slate-900 hover:border-slate-200 shadow-sm"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${selectedWeek === null ? "bg-white/10" : "bg-slate-50 text-slate-400"}`}>
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-black text-sm tracking-tight">All Weeks</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${selectedWeek === null ? "rotate-90" : "opacity-30"}`} />
          </motion.div>
        )}

        <div className="h-px bg-slate-100 my-2 mx-2" />

        {loading ? (
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
          weeks.map((week: any, index: number) => (
            <motion.div
              key={week.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedWeek(week.id)}
              className={`p-6 rounded-[28px] cursor-pointer transition-all border group
                ${week.active 
                  ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/20" 
                  : "bg-white border-slate-100 text-slate-900 hover:border-slate-200 hover:shadow-xl shadow-slate-100/50 shadow-sm"
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors
                  ${week.active ? "bg-white/10 text-white/80" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"}`}>
                  {week.status}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-black opacity-60">
                  <Calendar className="w-3 h-3" />
                  {week.date}
                </div>
              </div>

              <h3 className="text-lg font-black leading-tight mb-6 pr-4">
                {week.title}
              </h3>

              <div className="flex items-center justify-between gap-4 mb-2">
                 <div className="flex -space-x-3">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center overflow-hidden">
                         <div className="w-full h-full bg-gradient-to-br from-blue-300 to-indigo-400" />
                      </div>
                    ))}
                 </div>
                 <span className={`text-xs font-black ${week.active ? "text-white/60" : "text-slate-400"}`}>
                   {week.progress}%
                 </span>
              </div>

              <div className={`w-full h-1.5 rounded-full overflow-hidden 
                ${week.active ? "bg-white/10" : "bg-slate-100"}`}>
                <motion.div 
                  className={`h-full ${week.active ? "bg-white" : "bg-blue-600"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${week.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))
        )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
};
