"use client";

import { useEffect, useState, useMemo } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/roadmap/Sidebar";
import { XPOverviewCard } from "@/components/stats/XPOverviewCard";
import { XPGrowthChart } from "@/components/stats/XPGrowthChart";
import { CategoryPerformance } from "@/components/stats/CategoryPerformance";
import { StreakTracker } from "@/components/stats/StreakTracker";
import { SkillRadarChart } from "@/components/dashboard/SkillRadarChart";
import { CircularProgressRing } from "@/components/stats/CircularProgressRing";
import { ActivityHeatmap } from "@/components/stats/ActivityHeatmap";
import { InsightCard } from "@/components/stats/InsightCard";
import { GoalProgressTracker } from "@/components/stats/GoalProgressTracker";
import { useStatsStore } from "@/lib/store/useStatsStore";
import { Skill } from "@/lib/types";
import { Loader2, RefreshCcw, Filter, ChevronDown } from "lucide-react";

export default function StatsPage() {
  // Use granular selectors for better reactivity
  const overview = useStatsStore(state => state.overview);
  const xpHistory = useStatsStore(state => state.xpHistory);
  const heatmap = useStatsStore(state => state.heatmap);
  const insights = useStatsStore(state => state.insights);
  const skills = useStatsStore(state => state.skills);
  const categories = useStatsStore(state => state.categories);
  const isLoading = useStatsStore(state => state.isLoading);
  const error = useStatsStore(state => state.error);
  const historyRange = useStatsStore(state => state.historyRange);
  const fetchStatsData = useStatsStore(state => state.fetchStatsData);
  const setHistoryRange = useStatsStore(state => state.setHistoryRange);

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchStatsData();
  }, [fetchStatsData]);


  const skillMatrix = useMemo<Skill[]>(() => {
    if (!skills) return [] as Skill[];
    return Object.keys(skills).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
      A: skills[key].current,
      B: skills[key].target,
      fullMark: 100
    })) as Skill[];
  }, [skills]);

  // Transform data for weekly view if toggled
  const chartData = useMemo(() => {
    if (!xpHistory.length) return [];
    if (viewMode === 'daily') return xpHistory;
    
    // Simple rolling 7-day average for weekly momentum
    return xpHistory.map((day, i, arr) => {
      const window = arr.slice(Math.max(0, i - 6), i + 1);
      const avg = Math.round(window.reduce((sum, d) => sum + d.xp, 0) / window.length);
      return { ...day, xp: avg };
    });
  }, [xpHistory, viewMode]);

  if (isLoading && !overview) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">Syncing performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      <Sidebar />

      <div className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent">
        {/* Decorative background elements */}
        <div className="fixed top-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none z-0" />
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-20">
          {/* Header with Filter System */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-200">Live</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time performance engine</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight animate-[fadeIn_0.3s_ease-out]">
                Analytics <span className="text-blue-600">Hub</span>
              </h1>
            </div>

            <div className="relative flex items-center gap-4">
               {isLoading && <RefreshCcw className="w-4 h-4 text-blue-500 animate-spin" />}
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-sm text-slate-600"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                Range: Last {historyRange} Days
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    {[7, 14, 30].map((days) => (
                      <button
                        key={days}
                        onClick={() => {
                          setHistoryRange(days);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                          historyRange === days ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        Last {days} Days
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          <PageTransition className="flex flex-col gap-10">
            {/* Top Row: Aggregates */}
            <XPOverviewCard 
              totalXp={overview?.totalXp} 
              todayXp={overview?.todayXp} 
              weeklyXp={overview?.weeklyXp} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Deep Momentum */}
              <div className="lg:col-span-8 flex flex-col gap-10">
                <XPGrowthChart 
                  data={chartData} 
                  viewMode={viewMode} 
                  onToggleView={setViewMode} 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <ActivityHeatmap data={heatmap} />
                  <GoalProgressTracker achieved={overview?.weeklyXp || 0} target={500} />
                </div>
              </div>

              {/* Right Column: Interaction & Insights */}
              <div className="lg:col-span-4 flex flex-col gap-10">
                <StreakTracker 
                  currentStreak={overview?.currentStreak || 0} 
                  bestStreak={overview?.currentStreak || 0}
                  completionRate={overview?.completionRate || 0}
                  activityData={heatmap}
                />
                
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center hover:shadow-xl transition-all duration-500">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 self-start">Total Completion</h3>
                  <CircularProgressRing percentage={overview?.completionRate || 0} size={180} strokeWidth={16} color="#2563eb" label="Mastery" />
                </div>

                <InsightCard insights={insights} />
              </div>

              {/* Bottom Row: Detailed Mastery */}
              <div className="lg:col-span-4 bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 h-[500px]">
                <div className="mb-10">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Skill Landscape</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 italic">Comparison of current vs target proficiency</p>
                </div>
                <div className="h-[350px]">
                  <SkillRadarChart data={skillMatrix} />
                </div>
              </div>

              <div className="lg:col-span-8">
                <CategoryPerformance data={categories} />
              </div>
            </div>
          </PageTransition>
        </div>
      </div>
    </div>
  );
}
