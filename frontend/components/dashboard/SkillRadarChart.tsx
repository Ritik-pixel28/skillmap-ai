"use client";

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

interface SkillRadarChartProps {
  data: any[];
}

export const SkillRadarChart = ({ data }: SkillRadarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid 
          stroke="#f1f5f9" 
          strokeWidth={1.5}
        />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900, textAnchor: 'middle' }}
          dy={4}
        />
        <Radar
          name="Current"
          dataKey="A"
          stroke="#2563eb"
          fill="#3b82f6"
          fillOpacity={0.4}
          strokeWidth={3}
        />
        <Radar
          name="Target"
          dataKey="B"
          stroke="#818cf8"
          fill="#a5b4fc"
          fillOpacity={0.2}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
