"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
  const pathname = usePathname();

  const menuItems = [
    { icon: Layout, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Roadmap", path: "/roadmap" },
    { icon: BarChart2, label: "Stats", path: "/stats" },
    { icon: Layers, label: "Library", path: "/library" },
    { icon: MessageSquare, label: "Community", path: "/community" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
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
            <Link
              key={index}
              href={item.path}
              prefetch={true}
              title={item.label}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer
                ${isActive 
                  ? "bg-white text-blue-600 shadow-xl shadow-slate-200/50 scale-110" 
                  : "text-slate-400 hover:bg-white/50 hover:text-slate-600 hover:scale-105 active:scale-95"
                }`}
            >
              <item.icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <button
          className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:rotate-90 transition-transform duration-300"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
