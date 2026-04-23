"use client";

import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, AlertCircle, Info } from "lucide-react";

import { Insight } from "@/lib/types";

interface InsightCardProps {
  insights: Insight[];
}

export const InsightCard = ({ insights }: InsightCardProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "momentum": return <TrendingUp className="w-5 h-5" />;
      case "strength": return <Lightbulb className="w-5 h-5" />;
      case "warning": return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
        Learning Insights
        <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full">BETA</div>
      </h3>
      
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl flex gap-4 items-start ${
              insight.positive ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              insight.positive ? "bg-white/50 text-emerald-600" : "bg-white/50 text-blue-600"
            }`}>
              {getIcon(insight.type)}
            </div>
            <p className="text-sm font-bold leading-relaxed">{insight.text}</p>
          </motion.div>
        ))}
      </div>
      
      <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
        Insights update after every activity
      </p>
    </div>
  );
};
