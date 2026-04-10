"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/roadmap/Sidebar";
import { ProjectPanel } from "@/components/roadmap/ProjectPanel";
import { TimelineView } from "@/components/roadmap/TimelineView";
import { generateRoadmap, getAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Roadmap() {
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const router = useRouter();

  const handleSetSelectedWeek = (week: number | null) => {
    setSelectedWeek(week);
    setSelectedTask(null);
  };

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const result = await generateRoadmap();

      if (result.success) {
        const rawData = result.data;
        const normalizedWeeks = rawData?.weeks?.map((w: any) => ({
          week: w.week || w.week_number,
          title: w.title || w.content,
          tasks: (w.tasks || []).map((t: any, tidx: number) => {
             if (typeof t === 'string') return { id: tidx, title: t, duration: "N/A", completed: false, subtopics: [] };
             return { ...t, id: t.id || tidx, completed: !!t.completed, subtopics: t.subtopics || [] };
          })
        })) || [];

        const normalizedData = {
          ...rawData,
          weeks: normalizedWeeks
        };

        setRoadmapData(normalizedData);
      } else {
        setError(result.message || "Failed to generate roadmap");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (weekNumber: number, taskId: any) => {
    setRoadmapData((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map((w: any) => {
          if (w.week !== weekNumber) return w;
          return {
            ...w,
            tasks: w.tasks.map((t: any) => {
              if (t.id !== taskId) return t;
              return { ...t, completed: !t.completed };
            })
          };
        })
      };
    });
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-50 to-white overflow-hidden font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Sidebar />

      <div className="flex flex-1 relative min-w-0">
        <ProjectPanel 
          roadmapData={roadmapData} 
          loading={loading} 
          selectedWeek={selectedWeek}
          setSelectedWeek={handleSetSelectedWeek}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />

        <TimelineView 
          roadmapData={roadmapData} 
          loading={loading} 
          error={error} 
          onRetry={fetchRoadmap}
          selectedWeek={selectedWeek}
          onToggleTask={toggleTaskCompletion}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />

        <div className="fixed top-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-400/10 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="fixed top-[30%] left-[40%] w-[300px] h-[300px] bg-pink-400/5 blur-[100px] rounded-full pointer-events-none z-0" />

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-red-100 max-w-md text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Connection Error</h3>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                  {error}
                </p>
                <button 
                  onClick={fetchRoadmap}
                  className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-black hover:scale-[1.02] transition-transform active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
