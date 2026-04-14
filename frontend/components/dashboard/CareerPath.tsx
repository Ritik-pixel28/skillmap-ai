"use client";

import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";

interface CareerPathProps {
  milestones: {
    label: string;
    status: 'completed' | 'current' | 'upcoming';
  }[];
}

export const CareerPath = ({ milestones }: CareerPathProps) => {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center justify-between min-w-[600px] px-4">
        {milestones.map((ms, idx) => (
          <div key={idx} className="flex items-center group">
            <div className="flex flex-col items-center gap-4 relative">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl
                  ${ms.status === 'completed' 
                    ? "bg-emerald-500 text-white shadow-emerald-200" 
                    : ms.status === 'current'
                    ? "bg-blue-600 text-white shadow-blue-200 ring-8 ring-blue-50"
                    : "bg-slate-50 text-slate-300 border-2 border-slate-100"
                  }`}
              >
                {ms.status === 'completed' ? (
                  <Check className="w-6 h-6 stroke-[3]" />
                ) : (
                  <span className="text-lg font-black">{idx + 1}</span>
                )}
              </motion.div>
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-0.5
                  ${ms.status === 'current' ? "text-blue-600" : "text-slate-400"}`}>
                  {ms.status === 'current' ? "Current Stage" : "Phase"}
                </p>
                <h4 className={`text-sm font-black transition-colors duration-300
                  ${ms.status === 'upcoming' ? "text-slate-300" : "text-slate-900"}`}>
                  {ms.label}
                </h4>
              </div>

              {/* Connector line for current stage */}
              {ms.status === 'current' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white animate-ping" />
              )}
            </div>

            {idx < milestones.length - 1 && (
              <div className="mx-10 flex items-center gap-2">
                <div className={`h-1 rounded-full transition-all duration-1000 w-16
                  ${ms.status === 'completed' ? "bg-emerald-500" : "bg-slate-100"}`} 
                />
                <ChevronRight className={`w-5 h-5 ${ms.status === 'completed' ? "text-emerald-500" : "text-slate-100"}`} />
                <div className={`h-1 rounded-full transition-all duration-1000 w-16
                  ${ms.status === 'completed' ? "bg-emerald-500" : "bg-slate-100"}`} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
