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
  User 
} from "@/lib/types";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { Loader2, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
  const { roadmap, skills, activity, isLoading, error, fetchDashboardData, updateTaskStatus } = useDashboardStore();
  const { name, role, avatar, xp, rank, fetchProfile: fetchProfileData, lastUpdated } = useProfileStore();

  useEffect(() => {
    fetchDashboardData();
    // Only fetch if stale
    if (!lastUpdated || Date.now() - lastUpdated > 5 * 60 * 1000) {
      fetchProfileData();
    }
  }, [fetchDashboardData, fetchProfileData, lastUpdated]);

  // Transform roadmap data for MainPanel and RightPanel
  const careerPath = useMemo<ReadonlyArray<CareerStage>>(() => {
    if (!roadmap) return [] as CareerStage[];
    const totalWeeks = roadmap.weeks.length;
    if (totalWeeks === 0) return [] as CareerStage[];
    
    const phaseSize = Math.ceil(totalWeeks / 3);
    const currentWeekInfo = roadmap.weeks.find(w => w.tasks.some(t => !t.completed)) || roadmap.weeks[roadmap.weeks.length - 1];
    const currentWeekNum = currentWeekInfo?.week || 1;

    return [
      { label: "Beginner", status: currentWeekNum <= phaseSize ? "current" : "completed" },
      { label: "Intermediate", status: currentWeekNum > phaseSize && currentWeekNum <= phaseSize * 2 ? "current" : (currentWeekNum > phaseSize * 2 ? "completed" : "upcoming") },
      { label: "Advanced", status: currentWeekNum > phaseSize * 2 ? "current" : "upcoming" },
    ] as CareerStage[];
  }, [roadmap]);

  const skillMatrix = useMemo<ReadonlyArray<Skill>>(() => {
    if (!skills) return [] as Skill[];
    return Object.keys(skills.current).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      A: skills.current[key],
      B: skills.target[key],
      fullMark: 100
    })) as Skill[];
  }, [skills]);

  const currentTasks = useMemo<ReadonlyArray<DashboardTask>>(() => {
    if (!roadmap) return [] as DashboardTask[];
    // Flatten all tasks but flag current week's ones
    const currentWeekInfo = roadmap.weeks.find(w => w.tasks.some(t => !t.completed)) || roadmap.weeks[0];
    if (!currentWeekInfo) return [] as DashboardTask[];

    return currentWeekInfo.tasks.map((t, idx) => ({
      id: `${currentWeekInfo.week}-${idx}`,
      week: currentWeekInfo.week,
      title: t.title,
      desc: t.description,
      tag: t.tag || "Goal",
      status: t.completed ? "Done" as const : "In Progress" as const
    })) as DashboardTask[];
  }, [roadmap]);

  const weeklyProgress = useMemo(() => {
    if (!roadmap) return 0;
    const allTasks = roadmap.weeks.flatMap(w => w.tasks);
    if (allTasks.length === 0) return 0;
    const completed = allTasks.filter(t => t.completed).length;
    return Math.round((completed / allTasks.length) * 100);
  }, [roadmap]);

  const userData = useMemo(() => ({
    name: name,
    role: role,
    avatar: avatar || "https://i.pravatar.cc/150?u=ritik",
    skills: [], // To be populated if needed, or fetched separately
    xp: Number(xp) || 12000,
    weeklyProgress: weeklyProgress,
  }), [name, role, avatar, xp, weeklyProgress]);

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
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900 selection:bg-blue-100">
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
