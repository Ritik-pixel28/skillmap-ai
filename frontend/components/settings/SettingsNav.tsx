"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Target, 
  Bell, 
  Palette, 
  Shield, 
  Bot, 
  Database, 
  Zap,
  ChevronRight
} from "lucide-react";

export type SettingsTabId = 'profile' | 'goals' | 'notifications' | 'appearance' | 'security' | 'ai' | 'privacy' | 'integrations';

interface SettingsNavProps {
  activeTab: SettingsTabId;
  onTabChange: (id: SettingsTabId) => void;
}

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'goals', label: 'Goals & Learning', icon: Target },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Account & Security', icon: Shield },
  { id: 'ai', label: 'AI Preferences', icon: Bot },
  { id: 'privacy', label: 'Data & Privacy', icon: Database },
  { id: 'integrations', label: 'Integrations', icon: Zap },
] as const;

export const SettingsNav = ({ activeTab, onTabChange }: SettingsNavProps) => {
  return (
    <nav className="flex flex-col gap-1 w-full relative">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`relative group flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 ${
            activeTab === item.id 
            ? "bg-white shadow-xl shadow-slate-200/50" 
            : "hover:bg-white/60"
          }`}
        >
          <div className="flex items-center gap-4">
             <div className={`p-2.5 rounded-xl transition-all duration-300 ${
               activeTab === item.id 
               ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
               : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
             }`}>
                <item.icon size={18} />
             </div>
             <span className={`text-sm font-black tracking-tight transition-colors ${
               activeTab === item.id ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
             }`}>
               {item.label}
             </span>
          </div>

          <div className={`transition-all duration-300 ${activeTab === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
             <ChevronRight size={16} className="text-blue-600" />
          </div>

          {/* Active indicator bar */}
          {activeTab === item.id && (
            <motion.div
              layoutId="nav-active-bar"
              className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
};
