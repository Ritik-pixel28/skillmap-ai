"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useSettingsStore } from "@/lib/store/useSettingsStore";

interface SettingsLayoutProps {
  children: ReactNode;
  activeTabLabel: string;
}

export const SettingsLayout = ({ children, activeTabLabel }: SettingsLayoutProps) => {
  const { isSaving, isDirty, saveSettings } = useSettingsStore();
  const router = useRouter();
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors duration-150 w-fit group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
              <span>Back</span>
            </button>

            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               SETTINGS › <span className="text-blue-600 font-black">{activeTabLabel.toUpperCase()}</span>
            </p>

            <h1 className="hidden sm:block text-2xl font-black text-slate-900 tracking-tight leading-tight">
              System Settings
            </h1>
          </div>

          <div className="flex items-center gap-4">
             {!isDirty && !isSaving && (
                <div className="flex items-center gap-2 text-sm text-slate-500 border border-slate-100 rounded-xl px-3 py-1.5 bg-slate-50 shrink-0">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   <span className="font-bold">Up to date</span>
                </div>
             )}

             {isDirty && (
               <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 animate-pulse">Unsaved Changes</span>
             )}
             
             {(isDirty || isSaving) && (
               <button
                 onClick={saveSettings}
                 disabled={!isDirty || isSaving}
                 className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                   isDirty && !isSaving
                   ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95" 
                   : "bg-slate-100 text-slate-400 cursor-not-allowed"
                 }`}
               >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save All Changes"
                  )}
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 p-8">
        <aside className="relative">
           <div className="sticky top-32">
              {childrenArray[0]}
           </div>
        </aside>

        <section className="relative min-h-[800px]">
           {childrenArray[1]}
        </section>
      </main>
    </div>
  );
};
