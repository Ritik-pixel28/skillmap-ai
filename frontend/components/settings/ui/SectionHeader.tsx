"use client";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export const SectionHeader = ({ title, subtitle, badge }: SectionHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
        {badge && (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-sm font-bold text-slate-400 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-6 h-px w-full bg-slate-50" />
    </div>
  );
};
