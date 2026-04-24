"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/roadmap/Sidebar";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { useStatsStore } from "@/lib/store/useStatsStore";
import { 
  MapPin, 
  Globe, 
  Calendar, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Clock, 
  Zap,
  Edit2
} from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/settings/ui/SectionHeader";

export default function ProfilePage() {
  const { name, username, bio, role, location, website } = useProfileStore();
  const { overview, fetchStatsData } = useStatsStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetchStatsData();
    setIsReady(true);
  }, [fetchStatsData]);

  const totalXp = overview?.totalXp || 0;
  const currentLevel = Math.floor(totalXp / 1000) + 1;
  const nextLevelXp = currentLevel * 1000;
  const levelProgress = ((totalXp % 1000) / 1000) * 1000; // Actually simpler to just use raw XP for demo info
  const rank = 42; // Fallback or dynamic if added to store later

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1200px] mx-auto px-8 py-12">
          
          <div className="flex items-center justify-between mb-12">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                <span>SkillMap</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-blue-600">Public Profile</span>
              </nav>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personal Workspace</h1>
            </div>
            
            <Link 
              href="/settings#profile"
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95"
            >
              <Edit2 size={14} />
              Edit Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700" />
                
                <div className="relative mt-12 mb-6">
                   <div className="p-1.5 bg-white rounded-full shadow-xl">
                      <UserAvatar size="xl" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{name}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-4">@{username}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                   <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100/50">
                      {role || "Student"}
                   </span>
                </div>

                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[240px]">
                  {bio || "Building my learning journey on SkillMap AI. Focused on mastering the next generation of tech."}
                </p>

                <div className="w-full mt-10 pt-10 border-t border-slate-50 space-y-4">
                   <div className="flex items-center gap-3 text-slate-400">
                      <MapPin size={16} className="text-slate-300" />
                      <span className="text-xs font-bold">{location || "San Francisco, CA"}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-400">
                      <Globe size={16} className="text-slate-300" />
                      <span className="text-xs font-bold truncate max-w-[180px]">{website || "skillmap.ai"}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-400">
                      <Calendar size={16} className="text-slate-300" />
                      <span className="text-xs font-bold">Joined April 2024</span>
                   </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1e2235] rounded-[2rem] p-8 shadow-xl text-white overflow-hidden relative"
              >
                 <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
                 
                 <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-8 flex items-center gap-2">
                    <Award size={14} />
                    Current Standing
                 </h3>

                 <div className="space-y-8">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Total Experience</p>
                       <p className="text-4xl font-black tracking-tighter">{totalXp.toLocaleString()}<span className="text-blue-500 ml-1 text-base tracking-normal uppercase font-black">XP</span></p>
                    </div>

                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Global Rank</p>
                          <p className="text-xl font-black tracking-tight italic">#{rank}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Level</p>
                          <p className="text-xl font-black tracking-tight">{Math.floor(totalXp / 1000) + 1}</p>
                       </div>
                    </div>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: "65%" }}
                         className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                       />
                    </div>
                 </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Weekly Velocity', value: '84%', icon: TrendingUp, color: 'blue', desc: '+12% from last week' },
                    { label: 'Study Streak', value: '12 Days', icon: Zap, color: 'amber', desc: 'Personal best is 18' },
                    { label: 'Time Invested', value: '24.5h', icon: Clock, color: 'emerald', desc: '82% of weekly goal' },
                    { label: 'Certifications', value: '3', icon: Award, color: 'purple', desc: '1 pending verification' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + (i * 0.05) }}
                      className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 group hover:border-blue-100 transition-all hover:shadow-md"
                    >
                       <div className="flex items-start justify-between mb-8">
                          <div className={`p-4 rounded-2xl shadow-sm transition-colors ${
                              stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                              stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                              "bg-purple-50 text-purple-600"
                          }`}>
                             <stat.icon size={24} />
                          </div>
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                          <p className="text-3xl font-black text-slate-900 tracking-tight mb-2">{stat.value}</p>
                          <p className="text-[10px] font-bold text-slate-400">{stat.desc}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>

               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-50"
               >
                  <div className="flex items-center justify-between mb-10">
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Roadmap</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Fullstack Engineer Masterclass</p>
                     </div>
                     <Link href="/roadmap" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                        View Full Roadmap
                     </Link>
                  </div>

                  <div className="space-y-6">
                     {[
                        { title: 'Advanced React Patterns', progress: 100, status: 'Completed' },
                        { title: 'System Design Fundamentals', progress: 65, status: 'In Progress' },
                        { title: 'Node.js Performance Scaling', progress: 0, status: 'Upcoming' }
                     ].map((course) => (
                        <div key={course.title} className="p-6 bg-slate-50 rounded-2xl border border-slate-100/50">
                           <div className="flex justify-between mb-4">
                              <h4 className="text-sm font-black text-slate-800 tracking-tight">{course.title}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${
                                 course.status === 'Completed' ? "text-emerald-500" :
                                 course.status === 'In Progress' ? "text-blue-500" :
                                 "text-slate-400"
                              }`}>
                                 {course.status}
                              </span>
                           </div>
                           <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress}%` }}
                                className={`h-full rounded-full ${
                                   course.status === 'Completed' ? "bg-emerald-500" : "bg-blue-600"
                                }`}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
