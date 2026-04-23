"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { SettingsCard } from "../ui/SettingsCard";
import { SectionHeader } from "../ui/SectionHeader";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Database, Download, FileText, Eye, Users, BarChart } from "lucide-react";

export const DataPrivacySection = () => {
  const { 
    profilePublic, inLeaderboard, shareAnonymousData, 
    analyticsCookies, personalizationCookies,
    savePrivacy, exportData, isSaving, setField
  } = useSettingsStore();

  const handleToggle = async (field: string, value: boolean) => {
    setField(field, value);
    await savePrivacy({ [field]: value });
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Data & Privacy" 
        subtitle="Manage your personal data, export your progress, and control your visibility." 
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'Tasks Done', value: '428', icon: BarChart, color: 'blue' },
           { label: 'XP Earned', value: '1,240', icon: Database, color: 'emerald' },
           { label: 'Days Active', value: '52', icon: Users, color: 'indigo' },
           { label: 'Roadmaps', value: '8', icon: FileText, color: 'amber' },
         ].map((stat) => (
           <SettingsCard key={stat.label} className="!p-5 text-center flex flex-col items-center">
              <div className={`p-2.5 rounded-xl mb-3 ${
                stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                "bg-amber-50 text-amber-600"
              }`}>
                <stat.icon size={18} />
              </div>
              <p className="text-xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 border-none uppercase tracking-widest mt-1">{stat.label}</p>
           </SettingsCard>
         ))}
      </div>

      <SettingsCard className={isSaving ? "opacity-70 transition-opacity" : ""}>
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
          <Download size={14} className="text-blue-500" />
          Export Content
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <button 
             onClick={exportData}
             className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all text-left group"
           >
              <div className="p-3 bg-white shadow-sm rounded-xl text-slate-300 group-hover:text-blue-600 transition-colors">
                 <Database size={20} />
              </div>
              <div>
                 <p className="text-sm font-black text-slate-900 tracking-tight">Export as JSON</p>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full account data backup</p>
              </div>
           </button>
           <button className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all text-left group opacity-50 cursor-not-allowed">
              <div className="p-3 bg-white shadow-sm rounded-xl text-slate-300">
                 <FileText size={20} />
              </div>
              <div>
                 <p className="text-sm font-black text-slate-900 tracking-tight">Progress Report</p>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Coming Soon (PDF)</p>
              </div>
           </button>
        </div>
      </SettingsCard>

      <SettingsCard className={isSaving ? "opacity-70 transition-opacity" : ""}>
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
          <Eye size={14} className="text-blue-500" />
          Visibility & Analytics
        </h4>
        <div className="space-y-8">
           {[
             { id: 'profilePublic', title: 'Public Profile', desc: 'Allows others to discover your roadmap progress', value: profilePublic },
             { id: 'inLeaderboard', title: 'Leaderboards', desc: 'Compete globally in XP rankings', value: inLeaderboard },
             { id: 'shareAnonymousData', title: 'Anonymous Usage', desc: 'Help us improve AI roadmap generation', value: shareAnonymousData }
           ].map((item) => (
             <div key={item.id} className="flex items-center justify-between group">
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-800 tracking-tight">{item.title}</p>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 max-w-sm">{item.desc}</p>
                </div>
                <ToggleSwitch 
                  isOn={item.value}
                  onToggle={() => handleToggle(item.id, !item.value)}
                />
             </div>
           ))}
        </div>

        <div className="mt-10 pt-10 border-t border-slate-50">
           <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-6">Cookie Preferences</h5>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-100/50 rounded-2xl border border-slate-50">
                 <span className="text-xs font-black uppercase tracking-widest text-slate-400">Essential Cookies</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Always On</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50">
                 <span className="text-xs font-black uppercase tracking-widest text-slate-600">Analytics & Marketing</span>
                 <ToggleSwitch 
                    isOn={analyticsCookies}
                    onToggle={() => handleToggle('analyticsCookies', !analyticsCookies)}
                 />
              </div>
           </div>
        </div>
      </SettingsCard>
    </div>
  );
};
