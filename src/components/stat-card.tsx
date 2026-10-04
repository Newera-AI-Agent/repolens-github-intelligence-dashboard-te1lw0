import { ReactNode } from 'react';
import { formatNumber } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted uppercase tracking-wide mb-1">{label}</p>
          <p className="text-3xl font-bold text-text dark:text-text-dark truncate">{displayValue}</p>
          {trend && (
            <p className={`mt-2 text-sm font-medium flex items-center gap-1 ${trend.value >= 0 ? 'text-success' : 'text-danger'}`}>
              <span className="text-xs">{trend.value >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted">{trend.label}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
