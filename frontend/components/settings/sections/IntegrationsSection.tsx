"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { SettingsCard } from "../ui/SettingsCard";
import { SectionHeader } from "../ui/SectionHeader";
import { Github, Calendar, Zap, Lock, Slack } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { ApiResponse } from "@/lib/types";

export const IntegrationsSection = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    const res = await apiRequest<ApiResponse<any[]>>('/settings/integrations');
    if (res.success && res.data) setIntegrations(res.data);
  };

  const handleToggle = async (id: string, connected: boolean) => {
    setIsLoading(true);
    try {
      if (connected) {
        await apiRequest(`/settings/integrations/${id}`, { method: 'DELETE' });
        setIntegrations(prev => prev.map(item => 
          item.id === id ? { ...item, connected: false } : item
        ));
      } else {
        const res = await apiRequest<ApiResponse<{url: string}>>(`/settings/integrations/${id}/connect`, { method: 'POST' });
        if (res.success && res.data?.url) {
           window.location.href = res.data.url;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Integrations" 
        subtitle="Connect SkillMap AI with your favorite tools to sync progress and stay organized." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <SettingsCard key={item.id} className="group relative overflow-hidden">
             <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl shadow-sm border border-slate-50 transition-colors ${
                  item.connected ? "bg-white" : "bg-slate-50 filter grayscale"
                }`}>
                   {item.id === 'github' && <Github size={32} className={item.connected ? "text-slate-900" : "text-slate-300"} />}
                   {item.id === 'notion' && <Zap size={32} className={item.connected ? "text-slate-900" : "text-slate-300"} />}
                   {item.id === 'gcal' && <Calendar size={32} className={item.connected ? "text-blue-600" : "text-slate-300"} />}
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  item.connected 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-slate-50 text-slate-400 border-slate-100"
                }`}>
                   {item.connected ? "Connected" : "Disconnected"}
                </span>
             </div>

             <h4 className="text-base font-black text-slate-900 tracking-tight">{item.name}</h4>
             <p className="text-xs font-bold text-slate-400 mt-1 mb-8">{item.description}</p>

             <button 
               onClick={() => handleToggle(item.id, item.connected)}
               disabled={isLoading}
               className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                 item.connected 
                 ? "bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50/50" 
                 : "bg-blue-600 text-white shadow-lg shadow-blue-900/10 hover:bg-blue-700 active:scale-95"
               } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
             >
                {item.connected ? "Disconnect" : "Connect Setup"}
             </button>
          </SettingsCard>
        ))}

        <SettingsCard className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white rounded-xl text-slate-300">
                 <Slack size={24} />
              </div>
              <div className="px-2 py-0.5 bg-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                 <Lock size={10} />
                 Coming Soon
              </div>
           </div>
           <h4 className="text-sm font-black text-slate-400">Slack Integration</h4>
           <p className="text-xs font-bold text-slate-300 mt-1">Receive progress alerts directly in your team channels.</p>
        </SettingsCard>
      </div>
    </div>
  );
};
