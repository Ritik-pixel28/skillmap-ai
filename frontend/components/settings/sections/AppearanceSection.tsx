"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { SettingsCard } from "../ui/SettingsCard";
import { SectionHeader } from "../ui/SectionHeader";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Palette, Maximize2, Type, Check, Sun, Moon, Laptop } from "lucide-react";
import { useCallback } from "react";

const ACCENT_COLORS = [
  '#2563EB',
  '#7C3AED',
  '#059669',
  '#D97706',
  '#DC2626',
  '#0891B2',
  '#4F46E5',
  '#E11D48',
];

export const AppearanceSection = () => {
  const { 
    theme, accentColor, fontScale, compactMode, 
    saveAppearance, isSaving 
  } = useSettingsStore();

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    await saveAppearance({ theme: newTheme });
  };

  const handleAccentColor = async (color: string) => {
    await saveAppearance({ accentColor: color });
  };

  const handleFontScale = async (scale: 'small' | 'medium' | 'large' | 'xl') => {
    await saveAppearance({ fontScale: scale });
  };

  const handleCompactMode = async () => {
    const nextValue = !compactMode;
    await saveAppearance({ compactMode: nextValue });
    if (typeof document !== 'undefined') {
        document.body.classList.toggle('compact', nextValue);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Appearance" 
        subtitle="Make SkillMap AI look exactly how you want it with themes and accent colors." 
      />

      <SettingsCard className={isSaving ? "opacity-70 pointer-events-none transition-opacity" : ""}>
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
          <Palette size={14} className="text-blue-500" />
          Color Theme
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { id: 'light', icon: Sun, label: 'Light Mode' },
            { id: 'dark', icon: Moon, label: 'Dark Mode' },
            { id: 'system', icon: Laptop, label: 'System Mode' }
          ].map((item) => (
            <button
               key={item.id}
               onClick={() => handleThemeChange(item.id as any)}
               className={`relative flex flex-col p-2 rounded-2xl border-2 transition-all group overflow-hidden ${
                 theme === item.id 
                 ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-50" 
                 : "border-slate-50 bg-white hover:border-slate-200"
               }`}
            >
              <div className={`h-24 w-full rounded-xl mb-4 flex items-center justify-center ${
                item.id === 'light' ? "bg-slate-50" : 
                item.id === 'dark' ? "bg-slate-900" : 
                "bg-gradient-to-br from-slate-50 to-slate-900"
              }`}>
                <item.icon size={32} className={item.id === 'dark' ? "text-slate-700" : "text-slate-300"} />
              </div>
              <div className="px-3 pb-3 flex items-center justify-between">
                <span className={`text-xs font-black uppercase tracking-widest ${theme === item.id ? "text-blue-600" : "text-slate-500"}`}>
                  {item.label}
                </span>
                {theme === item.id && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <Check size={12} strokeWidth={4} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </SettingsCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard className={isSaving ? "opacity-70 pointer-events-none transition-opacity" : ""}>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
            <Palette size={14} className="text-blue-500" />
            Accent Color
          </h4>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map(color => (
              <button
                key={color}
                onClick={() => handleAccentColor(color)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                    accentColor === color ? "ring-4 ring-offset-2 ring-slate-100" : ""
                }`}
                style={{ backgroundColor: color }}
              >
                {accentColor === color && <Check size={18} className="text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Custom Hex Code</label>
             <div className="flex gap-2">
                <div className="w-10 h-10 rounded-xl border border-slate-100" style={{ backgroundColor: accentColor }} />
                <input 
                  type="text" 
                  value={accentColor}
                  onChange={(e) => handleAccentColor(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-900 uppercase"
                />
             </div>
          </div>
        </SettingsCard>

        <SettingsCard className={isSaving ? "opacity-70 pointer-events-none transition-opacity" : ""}>
           <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
            <Type size={14} className="text-blue-500" />
            FontSize & Layout
          </h4>
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Scaling</label>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{fontScale}</span>
              </div>
              <input 
                type="range" 
                min="0" max="3" step="1"
                value={['small', 'medium', 'large', 'xl'].indexOf(fontScale)}
                onChange={(e) => handleFontScale(['small', 'medium', 'large', 'xl'][parseInt(e.target.value)] as any)}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between px-1">
                <span className="text-[10px] font-black text-slate-300">A</span>
                <span className="text-lg font-black text-slate-300">A</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Maximize2 size={16} className="text-slate-300" />
                <span className="text-sm font-black text-slate-700 tracking-tight">Compact Mode</span>
              </div>
              <ToggleSwitch 
                isOn={compactMode}
                onToggle={handleCompactMode}
              />
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};
