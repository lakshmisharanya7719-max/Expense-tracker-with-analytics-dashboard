import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  colorTheme?: 'emerald' | 'rose' | 'indigo' | 'amber' | 'cyan' | 'purple';
  progress?: {
    percentage: number;
    label?: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorTheme = 'emerald',
  progress,
}) => {
  const themeStyles = {
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)]',
      progressBg: 'bg-emerald-500',
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-500 dark:text-rose-400',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.2)]',
      progressBg: 'bg-rose-500',
    },
    indigo: {
      border: 'hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.2)]',
      progressBg: 'bg-indigo-500',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-500 dark:text-amber-400',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]',
      progressBg: 'bg-amber-500',
    },
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)]',
      progressBg: 'bg-cyan-500',
    },
    purple: {
      border: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-500 dark:text-purple-400',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.2)]',
      progressBg: 'bg-purple-500',
    },
  }[colorTheme];

  return (
    <div
      className={`group relative bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 ${themeStyles.border} ${themeStyles.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${themeStyles.iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium">
          <span
            className={`px-2 py-0.5 rounded-full font-semibold ${
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-gray-500 dark:text-gray-400">{trend.label || 'vs last period'}</span>
        </div>
      )}

      {progress && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{progress.label || 'Usage'}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${themeStyles.progressBg} ${
                progress.percentage > 100 ? 'bg-rose-500' : ''
              }`}
              style={{ width: `${Math.min(100, progress.percentage)}%` }}
            />
          </div>
        </div>
      )}

      {subtitle && !trend && !progress && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
      )}
    </div>
  );
};
