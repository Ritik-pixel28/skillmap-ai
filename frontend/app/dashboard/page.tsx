"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/roadmap/Sidebar";
import { ProfilePanel } from "@/components/dashboard/ProfilePanel";
import { MainPanel } from "@/components/dashboard/MainPanel";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { 
  CareerStage, 
  Skill, 
  DashboardTask, 
  DashboardActivity, 
  User 
} from "@/lib/types";
import { Loader2, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
  const { roadmap, skills, activity, userProfile, isLoading, error, fetchDashboardData, updateTaskStatus } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Transform roadmap data for MainPanel and RightPanel
  const careerPath = useMemo<ReadonlyArray<CareerStage>>(() => {
    if (!roadmap) return [];
    const totalWeeks = roadmap.weeks.length;
    if (totalWeeks === 0) return [];
    
    const phaseSize = Math.ceil(totalWeeks / 3);
    const currentWeekInfo = roadmap.weeks.find(w => w.tasks.some(t => !t.completed)) || roadmap.weeks[roadmap.weeks.length - 1];
    const currentWeekNum = currentWeekInfo?.week || 1;

    return [
      { label: "Beginner", status: currentWeekNum <= phaseSize ? "current" : "completed" },
      { label: "Intermediate", status: currentWeekNum > phaseSize && currentWeekNum <= phaseSize * 2 ? "current" : (currentWeekNum > phaseSize * 2 ? "completed" : "upcoming") },
      { label: "Advanced", status: currentWeekNum > phaseSize * 2 ? "current" : "upcoming" },
    ];
  }, [roadmap]);

  const skillMatrix = useMemo<ReadonlyArray<Skill>>(() => {
    if (!skills) return [];
    return Object.keys(skills.current).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      A: skills.current[key],
      B: skills.target[key],
      fullMark: 100
    }));
  }, [skills]);

  const currentTasks = useMemo<ReadonlyArray<DashboardTask>>(() => {
    if (!roadmap) return [];
    // Flatten all tasks but flag current week's ones
    const currentWeekInfo = roadmap.weeks.find(w => w.tasks.some(t => !t.completed)) || roadmap.weeks[0];
    if (!currentWeekInfo) return [];

    return currentWeekInfo.tasks.map((t, idx) => ({
      id: `${currentWeekInfo.week}-${idx}`,
      week: currentWeekInfo.week,
      title: t.title,
      desc: t.description,
      tag: t.tag || "Goal",
      status: t.completed ? "Done" as const : "In Progress" as const
    }));
  }, [roadmap]);

  const weeklyProgress = useMemo(() => {
    if (!roadmap) return 0;
    const allTasks = roadmap.weeks.flatMap(w => w.tasks);
    if (allTasks.length === 0) return 0;
    const completed = allTasks.filter(t => t.completed).length;
    return Math.round((completed / allTasks.length) * 100);
  }, [roadmap]);

  const userData = useMemo<User>(() => ({
    name: userProfile?.name || "Ritik",
    role: userProfile?.role || "Aspiring Full Stack Engineer",
    avatar: userProfile?.avatar || "https://i.pravatar.cc/150?u=ritik",
    skills: userProfile?.skills || [],
    xp: activity.reduce((acc, curr) => acc + (curr.xp || 0), 0) + 12000,
    weeklyProgress: weeklyProgress,
  }), [userProfile, weeklyProgress, activity]);

  if (isLoading && !roadmap) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error && !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button 
          onClick={() => fetchDashboardData()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCcw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900 selection:bg-blue-100 italic-none">
      <Sidebar />

      <div className="flex-1 h-full overflow-y-auto relative scroll-smooth">
        <div className="fixed top-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-400/5 blur-[150px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto p-6 md:p-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-3">
              <ProfilePanel user={userData} />
            </div>

            <div className="lg:col-span-6">
              <MainPanel careerPath={careerPath} skills={skillMatrix} />
            </div>

            <div className="lg:col-span-3">
              <RightPanel 
                tasks={currentTasks} 
                activity={activity} 
                onToggleTask={(task) => updateTaskStatus(task.week, task.title, task.status !== "Done")}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
