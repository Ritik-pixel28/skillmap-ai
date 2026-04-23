"use client";

import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { TrendingUp } from "lucide-react";

import { CategoryPerf } from "@/lib/types";

interface CategoryPerformanceProps {
  data: CategoryPerf[];
}

const getPerfColor = (percentage: number) => {
  if (percentage >= 80) return '#10b981'; // emerald-500
  if (percentage >= 50) return '#2563eb'; // blue-600
  if (percentage >= 30) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
};

export const CategoryPerformance = ({ data }: CategoryPerformanceProps) => {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-[450px] flex flex-col group">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Mastery by Domain</h3>
          <p className="text-xs font-bold text-slate-400 mt-1 italic">Performance distribution across categories</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 transition-colors">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 w-full translate-x-[-20px]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ left: 20, right: 40, top: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis 
              dataKey="category" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 900 }}
              width={120}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc', radius: 12 }}
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                borderRadius: '16px', 
                border: 'none',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                padding: '12px'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#fff' }}
              labelStyle={{ display: 'none' }}
              formatter={(value) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [`${numValue}% Mastery`, 'Score'];
              }}
            />
            <Bar 
              dataKey="percentage" 
              radius={[0, 12, 12, 0]} 
              barSize={28}
              animationDuration={2000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getPerfColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Expert</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600" /> Proficient</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Novice</div>
        </div>
      </div>
    </div>
  );
};
