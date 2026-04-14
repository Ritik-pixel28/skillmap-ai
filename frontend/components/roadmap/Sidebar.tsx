"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { 
  BarChart2, 
  Calendar, 
  Layout, 
  Layers, 
  Settings, 
  User, 
  MessageSquare,
  Plus
} from "lucide-react";

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: Layout, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Roadmap", path: "/roadmap" },
    { icon: BarChart2, label: "Stats", path: "#" },
    { icon: Layers, label: "Library", path: "#" },
    { icon: MessageSquare, label: "Community", path: "#" },
    { icon: User, label: "Profile", path: "#" },
    { icon: Settings, label: "Settings", path: "#" },
  ];

  return (
    <div className="w-20 h-full bg-white/20 backdrop-blur-xl border-r border-white/20 flex flex-col items-center py-10 gap-10 shrink-0">
      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 cursor-pointer">
        <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center overflow-hidden">
           <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => item.path !== "#" && router.push(item.path)}
              title={item.label}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer
                ${isActive 
                  ? "bg-white text-blue-600 shadow-xl shadow-slate-200/50" 
                  : "text-slate-400 hover:bg-white/50 hover:text-slate-600"
                }`}
            >
              <item.icon className="w-6 h-6" />
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <motion.button
          whileHover={{ rotate: 90 }}
          className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
