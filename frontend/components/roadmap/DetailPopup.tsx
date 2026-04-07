"use client";

import { motion } from "framer-motion";
import { User, Clock, MapPin, Share2, MoreHorizontal, CheckCircle2 } from "lucide-react";

export const DetailPopup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-80 bg-white rounded-[32px] shadow-2xl shadow-slate-400/30 p-8 z-50 border border-slate-100/50 pointer-events-auto"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
           <Clock className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <Share2 className="w-4 h-4 text-slate-400" />
           </button>
           <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
           </button>
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Project Research Phase</h3>
      <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
         <span>August 24th, 2026</span>
      </div>

      <div className="space-y-4 mb-8">
         <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
               <User className="w-4 h-4" />
            </div>
            <span>3 members assigned</span>
         </div>
         <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
               <MapPin className="w-4 h-4" />
            </div>
            <span>Meeting Room A</span>
         </div>
         <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <span>Pre-research checklist done</span>
         </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
         Join Meeting
      </button>
    </motion.div>
  );
};
