"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { SettingsCard } from "../ui/SettingsCard";
import { SectionHeader } from "../ui/SectionHeader";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Bot, Wand2, MessageCircle, RefreshCw, Layers, Save, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AIPreferencesSection = () => {
  const { 
    roadmapStyle, taskComplexity, regenerateFrequency,
    aiExplanationDepth, aiCustomInstructions,
    saveAI, resetAIPreferences, isSaving, setField, isDirty
  } = useSettingsStore();

  const handleSave = async () => {
    await saveAI({
        roadmapStyle,
        taskComplexity,
        regenerateFrequency,
        aiExplanationDepth,
        aiCustomInstructions
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="AI Preferences" 
        subtitle="Fine-tune how our AI generates your roadmap and explains concepts to you." 
      />

      <SettingsCard className={isSaving ? "opacity-70 pointer-events-none" : ""}>
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Bot size={20} />
             </div>
             <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active AI Model</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">LLaMA 3 via Groq</p>
             </div>
           </div>
           <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-200">
             Pro Engine
           </div>
        </div>

        <div className="space-y-10">
           <div className="space-y-6">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Roadmap Generation style</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['aggressive', 'balanced', 'relaxed'].map((style) => (
                   <button
                    key={style}
                    onClick={() => setField('roadmapStyle', style as any)}
                    className={`py-6 rounded-2xl border-2 transition-all group ${
                      roadmapStyle === style 
                      ? "border-indigo-600 bg-indigo-50/20 shadow-xl shadow-indigo-50" 
                      : "border-slate-50 bg-white hover:border-slate-100"
                    }`}
                   >
                     <p className={`text-sm font-black uppercase ${roadmapStyle === style ? "text-indigo-600" : "text-slate-900"}`}>{style}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {style === 'aggressive' ? 'Max Intensity' : style === 'balanced' ? 'Optimal Pace' : 'Chill Learning'}
                     </p>
                   </button>
                ))}
              </div>
           </div>

           <div className="pt-8 border-t border-slate-50 space-y-6">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Layers size={18} className="text-slate-300" />
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Task Complexity</label>
                 </div>
                 <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">Level {taskComplexity}</span>
              </div>
              <input 
                type="range" 
                min="1" max="5" step="1"
                value={taskComplexity}
                onChange={(e) => setField('taskComplexity', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                 <span>Simple</span>
                 <span>Pro</span>
              </div>
           </div>
        </div>
      </SettingsCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <SettingsCard className={isSaving ? "opacity-70 pointer-events-none" : ""}>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
              <RefreshCw size={14} className="text-indigo-500" />
              Regenerate Frequency
            </h4>
            <div className="space-y-2">
              <select 
                value={regenerateFrequency}
                   onChange={(e) => setField('regenerateFrequency', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual only</option>
              </select>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">Controls how often AI refreshes your path</p>
            </div>
         </SettingsCard>

         <SettingsCard className={isSaving ? "opacity-70 pointer-events-none" : ""}>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
              <MessageCircle size={14} className="text-indigo-500" />
              Explanation Depth
            </h4>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{aiExplanationDepth}</span>
               <ToggleSwitch 
                  isOn={aiExplanationDepth === 'detailed'}
                  onToggle={() => setField('aiExplanationDepth', aiExplanationDepth === 'detailed' ? 'brief' : 'detailed')}
               />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 px-1">Detailed provides deep conceptual insights</p>
         </SettingsCard>
      </div>

      <SettingsCard className={isSaving ? "opacity-70 pointer-events-none" : ""}>
        <div className="flex items-center gap-3 mb-6">
           <Wand2 size={18} className="text-indigo-500" />
           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Custom Instructions</h4>
        </div>
        <textarea 
          value={aiCustomInstructions}
          onChange={(e) => setField('aiCustomInstructions', e.target.value.slice(0, 500))}
          rows={5}
          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all resize-none"
          placeholder="Tell the AI anything about how you learn best... e.g., I prefer hands-on projects over theory. Skip basics."
        />
        <div className="flex justify-between items-center mt-4">
           <button 
             onClick={resetAIPreferences}
             className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
           >
             <RotateCcw size={12} /> Reset to Defaults
           </button>
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{aiCustomInstructions.length}/500</span>
        </div>
      </SettingsCard>

      <AnimatePresence>
        {isDirty && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-10 right-10 md:left-auto md:right-32 z-50"
          >
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
              {isSaving ? 'Saving Changes...' : 'Save AI Preferences'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
