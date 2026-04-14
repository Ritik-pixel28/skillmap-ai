"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/roadmap/Sidebar";
import { ProfilePanel } from "@/components/dashboard/ProfilePanel";
import { MainPanel } from "@/components/dashboard/MainPanel";
import { RightPanel } from "@/components/dashboard/RightPanel";

const dashboardData = {
  user: {
    name: "Ritik",
    role: "Aspiring Full Stack Engineer",
    avatar: "https://i.pravatar.cc/150?u=ritik",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind", "Python"],
    weeklyProgress: 65,
  },
  careerPath: [
    { label: "Beginner", status: "completed" as const },
    { label: "Intermediate", status: "current" as const },
    { label: "Advanced", status: "upcoming" as const },
  ],
  skills: [
    { subject: 'Frontend', A: 120, B: 110, fullMark: 150 },
    { subject: 'Backend', A: 98, B: 130, fullMark: 150 },
    { subject: 'Database', A: 86, B: 130, fullMark: 150 },
    { subject: 'System Design', A: 99, B: 100, fullMark: 150 },
    { subject: 'DevOps', A: 85, B: 90, fullMark: 150 },
  ],
  tasks: [
    { id: 1, title: "Optimize Radar Chart", desc: "Refine gradients and labels", tag: "Frontend", status: "In Progress" },
    { id: 2, title: "Backend API Auth", desc: "Secure endpoints with JWT", tag: "Backend", status: "To Do" },
    { id: 3, title: "Responsive Layout", desc: "Test on mobile/tablet", tag: "UI/UX", status: "Done" },
  ],
  activity: [
    { id: 1, type: "completed", action: "Completed week 3 roadmap", time: "2h ago" },
    { id: 2, type: "started", action: "Started 'System Design' module", time: "5h ago" },
    { id: 3, type: "started", action: "Updated profile expertise", time: "1d ago" },
  ]
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900 selection:bg-blue-100 italic-none">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 h-full overflow-y-auto relative scroll-smooth">
        {/* Background Accents */}
        <div className="fixed top-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-400/5 blur-[150px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto p-6 md:p-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left Panel - Profile & Progress */}
            <div className="lg:col-span-3">
              <ProfilePanel user={dashboardData.user} />
            </div>

            {/* Center Panel - Skill Matrix & Path */}
            <div className="lg:col-span-6">
              <MainPanel careerPath={dashboardData.careerPath} skills={dashboardData.skills} />
            </div>

            {/* Right Panel - Tasks & Feed */}
            <div className="lg:col-span-3">
              <RightPanel tasks={dashboardData.tasks} activity={dashboardData.activity} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
