"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { SettingsCard } from "../ui/SettingsCard";
import { SectionHeader } from "../ui/SectionHeader";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Bell, Mail, Smartphone, Globe, Clock, MessageSquare, Award, Sparkles } from "lucide-react";

export const NotificationsSection = () => {
  const {
    notificationsEnabled, notifyDailyReminder, notifyWeeklySummary,
    notifyStreakWarning, notifyAiSuggestions, notifyXpMilestones,
    notifyChannelInapp, notifyChannelEmail, notifyChannelPush,
    saveNotifications, setField
  } = useSettingsStore();

  const handleMasterToggle = async () => {
    const nextValue = !notificationsEnabled;
    setField('notificationsEnabled', nextValue);
    await saveNotifications({ notificationsEnabled: nextValue });
  };

  const handleToggle = async (field: string, value: boolean) => {
    setField(field, value);
    await saveNotifications({ [field]: value });
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Notifications" 
        subtitle="Control how and when you receive updates about your progress and roadmaps." 
      />

      <SettingsCard className={!notificationsEnabled ? "opacity-70 transition-opacity" : ""}>
        <div className="flex items-center justify-between mb-10 pb-8 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[20px] transition-colors ${notificationsEnabled ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              <Bell size={24} />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight">Enable All Notifications</h4>
              <p className="text-xs font-bold text-slate-400 mt-0.5">Quickly toggle all alerts on or off</p>
            </div>
          </div>
          <ToggleSwitch 
            isOn={notificationsEnabled} 
            onToggle={handleMasterToggle} 
          />
        </div>

        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
             {[
               { id: 'notifyDailyReminder', title: 'Daily Reminders', desc: 'Stay consistent with daily pings', icon: Clock, value: notifyDailyReminder },
               { id: 'notifyWeeklySummary', title: 'Weekly Reports', desc: 'Detailed progress breakdown', icon: BarChart3, value: notifyWeeklySummary },
               { id: 'notifyStreakWarning', title: 'Streak Protection', desc: 'Warning before you lose progress', icon: Sparkles, value: notifyStreakWarning },
               { id: 'notifyAiSuggestions', title: 'AI Roadmap Updates', desc: 'Alerts when your path evolves', icon: MessageSquare, value: notifyAiSuggestions },
               { id: 'notifyXpMilestones', title: 'XP Milestones', desc: 'Celebrate your achievements', icon: Award, value: notifyXpMilestones },
             ].map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                      <item.icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{item.title}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    disabled={!notificationsEnabled}
                    isOn={item.value} 
                    onToggle={() => handleToggle(item.id, !item.value)} 
                  />
                </div>
             ))}
          </div>

          <div className="pt-10 border-t border-slate-50">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-8">Delivery Channels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'notifyChannelInapp', title: 'In-App', icon: Smartphone, value: notifyChannelInapp },
                { id: 'notifyChannelEmail', title: 'Email', icon: Mail, value: notifyChannelEmail },
                { id: 'notifyChannelPush', title: 'Browser', icon: Globe, value: notifyChannelPush }
              ].map((channel) => (
                <button
                  key={channel.id}
                  disabled={!notificationsEnabled}
                  onClick={() => handleToggle(channel.id, !channel.value)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 ${
                    channel.value
                    ? "border-blue-600 bg-blue-50/30 text-blue-600"
                    : "border-slate-50 bg-white text-slate-400 hover:border-slate-100"
                  } ${!notificationsEnabled ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <channel.icon size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">{channel.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};

const BarChart3 = ({ size, strokeWidth }: { size?: number; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
  </svg>
);
