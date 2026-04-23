"use client";

import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot
} from "recharts";

interface XPGrowthChartProps {
  data: { date: string; xp: number }[];
  viewMode: 'daily' | 'weekly';
  onToggleView: (mode: 'daily' | 'weekly') => void;
}

export const XPGrowthChart = ({ data, viewMode, onToggleView }: XPGrowthChartProps) => {
  // Find peak day
  const peak = data.reduce((max, obj) => (obj.xp > max.xp ? obj : max), data[0] || { xp: 0 });

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md bg-opacity-90">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">{payload[0].value} <span className="text-xs text-blue-400">XP</span></span>
          </div>
          <p className="text-[9px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            Handcrafted momentum
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-[450px] flex flex-col group">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Your learning momentum</h3>
          <p className="text-xs font-bold text-slate-400 mt-1 italic">Experience progression over time</p>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          {(['daily', 'weekly'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onToggleView(mode)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                viewMode === mode 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                <stop offset="60%" stopColor="#2563eb" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
              dx={-10}
            />
            <Tooltip 
              cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
              content={<CustomTooltip />}
            />
            <Area 
              type="monotone" 
              dataKey="xp" 
              stroke="#2563eb" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorXp)" 
              animationDuration={2500}
              activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#2563eb' }}
            />
            {peak && peak.xp > 0 && (
              <ReferenceDot 
                x={peak.date} 
                y={peak.xp} 
                r={4} 
                fill="#2563eb" 
                stroke="none" 
                label={{ position: 'top', value: 'Peak', fill: '#2563eb', fontSize: 10, fontWeight: 900 }} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
