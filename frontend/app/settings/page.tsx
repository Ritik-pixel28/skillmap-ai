"use client";

import { useEffect, useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { SettingsNav, SettingsTabId } from "@/components/settings/SettingsNav";
import { ProfileSection } from "@/components/settings/sections/ProfileSection";
import { GoalsSection } from "@/components/settings/sections/GoalsSection";
import { NotificationsSection } from "@/components/settings/sections/NotificationsSection";
import { AppearanceSection } from "@/components/settings/sections/AppearanceSection";
import { SecuritySection } from "@/components/settings/sections/SecuritySection";
import { AIPreferencesSection } from "@/components/settings/sections/AIPreferencesSection";
import { DataPrivacySection } from "@/components/settings/sections/DataPrivacySection";
import { IntegrationsSection } from "@/components/settings/sections/IntegrationsSection";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { fetchSettings, isLoading } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as SettingsTabId;
    if (hash && [
        'profile', 'goals', 'notifications', 'appearance', 
        'security', 'ai', 'privacy', 'integrations'
    ].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (id: SettingsTabId) => {
    setActiveTab(id);
    window.location.hash = id;
  };

  const getTabLabel = () => {
    switch(activeTab) {
        case 'profile': return 'Profile';
        case 'goals': return 'Goals & Learning';
        case 'notifications': return 'Notifications';
        case 'appearance': return 'Appearance';
        case 'security': return 'Security';
        case 'ai': return 'AI Preferences';
        case 'privacy': return 'Data & Privacy';
        case 'integrations': return 'Integrations';
        default: return 'Settings';
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FB]">
        <div
           className="flex flex-col items-center gap-6 animate-[fadeIn_0.3s_ease-out]"
        >
           <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-50">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Initializing Engine</p>
        </div>
      </div>
    );
  }

  return (
    <SettingsLayout activeTabLabel={getTabLabel()}>
      <SettingsNav activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="w-full">
         <div
           key={activeTab}
           className="animate-[fadeIn_0.2s_ease-out]"
         >
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'goals' && <GoalsSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'appearance' && <AppearanceSection />}
            {activeTab === 'security' && <SecuritySection />}
            {activeTab === 'ai' && <AIPreferencesSection />}
            {activeTab === 'privacy' && <DataPrivacySection />}
            {activeTab === 'integrations' && <IntegrationsSection />}
         </div>
      </div>
    </SettingsLayout>
  );
}

