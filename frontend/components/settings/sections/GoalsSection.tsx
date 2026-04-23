"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { SettingsCard } from "../ui/SettingsCard";
import { SectionHeader } from "../ui/SectionHeader";
import { Target, Zap, Clock, Brain, X } from "lucide-react";
import { useState, useCallback, useRef } from "react";

export const GoalsSection = () => {
  const { 
    weeklyXpTarget, dailyStudyMinutes, learningStyle, difficulty, 
    skillFocusAreas, saveGoals, setField, isSaving 
  } = useSettingsStore();
  
  const [newSkill, setNewSkill] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSave = useCallback((data: any) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveGoals(data);
    }, 800);
  }, [saveGoals]);

  const handleXPTarget = (val: number) => {
    setField('weeklyXpTarget', val);
    debouncedSave({ weeklyXpTarget: val });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skillFocusAreas.includes(newSkill.trim())) {
      const updated = [...skillFocusAreas, newSkill.trim()];
      setField('skillFocusAreas', updated);
      saveGoals({ skillFocusAreas: updated });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    const updated = skillFocusAreas.filter(s => s !== skill);
    setField('skillFocusAreas', updated);
    saveGoals({ skillFocusAreas: updated });
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Goals & Learning" 
        subtitle="Customize your learning pace, preferred styles, and target milestones." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard className={isSaving ? "opacity-70 transition-opacity" : ""}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Weekly XP Target</h4>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Commitment level</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Chill</span>
              <span className="text-3xl font-black text-blue-600 tracking-tighter">{weeklyXpTarget}<span className="text-xs text-slate-300 ml-1 uppercase">XP</span></span>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Elite</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="1000" 
              step="50"
              value={weeklyXpTarget}
              onChange={(e) => handleXPTarget(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </SettingsCard>

        <SettingsCard className={isSaving ? "opacity-70 transition-opacity" : ""}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Daily Study Time</h4>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ideal session length</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[15, 30, 60, 120].map((mins) => (
              <button
                key={mins}
                onClick={() => saveGoals({ dailyStudyMinutes: mins })}
                className={`py-3 rounded-xl text-sm font-black border transition-all ${
                  dailyStudyMinutes === mins 
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
                }`}
              >
                {mins < 60 ? `${mins} min` : `${mins / 60} hr`}
              </button>
            ))}
          </div>
        </SettingsCard>
      </div>

      <SettingsCard className={isSaving ? "opacity-70 transition-opacity" : ""}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Brain size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Learning Style</h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">How you absorb knowledge best</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'visual', icon: '🧠', desc: 'Videos & Charts' },
            { id: 'practical', icon: '🔨', desc: 'Code & Projects' },
            { id: 'theoretical', icon: '📖', desc: 'Docs & Principles' }
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => saveGoals({ learningStyle: style.id as any })}
              className={`p-6 rounded-2xl border-2 text-left transition-all group ${
                learningStyle === style.id 
                ? "border-blue-600 bg-blue-50/30 shadow-xl shadow-blue-50" 
                : "border-slate-50 bg-white hover:border-slate-100"
              }`}
            >
              <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{style.icon}</span>
              <p className={`text-sm font-black uppercase ${learningStyle === style.id ? "text-blue-600" : "text-slate-900"}`}>{style.id}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{style.desc}</p>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard className={isSaving ? "opacity-70 transition-opacity" : ""}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Target size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Skill Focus Areas</h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Prioritize these topics in generated roadmaps</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {skillFocusAreas.map(skill => (
            <div key={skill} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest group">
              {skill}
              <button 
                onClick={() => removeSkill(skill)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {skillFocusAreas.length < 5 && (
            <form onSubmit={handleAddSkill}>
              <input 
                type="text"
                placeholder="+ Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 outline-none focus:border-blue-500 focus:text-blue-600 transition-all w-32"
              />
            </form>
          )}
        </div>
      </SettingsCard>
    </div>
  );
};
