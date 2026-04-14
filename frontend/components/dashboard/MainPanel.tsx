"use client";

import { CareerPath } from "./CareerPath";
import { SkillRadarChart } from "./SkillRadarChart";
import { LearningResources } from "./LearningResources";

interface MainPanelProps {
  careerPath: any[];
  skills: any[];
}

export const MainPanel = ({ careerPath, skills }: MainPanelProps) => {
  return (
    <div className="flex-1 flex flex-col gap-8 min-w-0">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill Matrix</h1>
        <p className="text-slate-500 font-medium">Track your expertise and identify growth areas.</p>
      </div>

      {/* Career Path Milestones */}
      <CareerPath milestones={careerPath} />

      {/* Radar Chart Section */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h3 className="text-lg font-black text-slate-900">Expertise Levels</h3>
            <p className="text-xs font-bold text-slate-400 mt-0.5">Updated live from your roadmaps</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              Current
            </span>
            <span className="flex items-center gap-1.5 text-xs font-black text-indigo-400 bg-indigo-50 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              Target
            </span>
          </div>
        </div>
        
        <div className="h-[400px] w-full relative z-10">
          <SkillRadarChart data={skills} />
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors duration-700" />
      </div>

      {/* Recommended Learning */}
      <LearningResources />
    </div>
  );
};
