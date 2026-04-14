"use client";

import { motion } from "framer-motion";
import { PlayCircle, FileText, Globe, ExternalLink } from "lucide-react";

const resources = [
  { id: 1, type: 'video', title: "Advanced React Patterns", source: "FrontendMasters", duration: "24m", status: "To Do", bg: "bg-blue-50", icon: PlayCircle, color: "text-blue-600" },
  { id: 2, type: 'article', title: "System Design Essentials", source: "Medium", status: "In Progress", bg: "bg-purple-50", icon: FileText, color: "text-purple-600" },
  { id: 3, type: 'course', title: "Full Stack Deployment", source: "SkillMap AI", status: "Done", bg: "bg-emerald-50", icon: Globe, color: "text-emerald-600" },
];

export const LearningResources = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recommended Resources</h3>
        <button className="text-xs font-black text-blue-600 hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((item, idx) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group cursor-pointer relative overflow-hidden"
          >
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}>
              <item.icon className="w-6 h-6" />
            </div>
            
            <div className="space-y-1 mb-6">
              <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
              <p className="text-xs font-bold text-slate-400">{item.source} • {item.type}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase
                ${item.status === 'Done' ? "bg-emerald-50 text-emerald-600" : item.status === 'In Progress' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"}`}>
                {item.status}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>

            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/0 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
