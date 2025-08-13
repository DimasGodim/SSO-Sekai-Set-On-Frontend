import React from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import type { UsageStats } from '../../lib/types';
import { STYLES } from '../../lib/constants';

interface UsageStatsSectionProps {
  usageStats: UsageStats | null;
}

export function UsageStatsSection({ usageStats }: UsageStatsSectionProps) {
  const stats: StatCardProps[] = [
    {
      title: 'API Calls This Month',
      value: usageStats?.currentMonth?.toLocaleString() || '0',
      subtitle: `of ${usageStats?.limit?.toLocaleString() || '0'} limit`,
      icon: TrendingUp,
      color: 'blue' as const,
      progress: usageStats ? (usageStats.currentMonth / usageStats.limit) * 100 : 0,
    },
    {
      title: 'Successful Calls',
      value: usageStats?.successfulCalls?.toLocaleString() || '0',
      subtitle: usageStats ? `${usageStats.successRate}% success rate` : '',
      icon: CheckCircle,
      color: 'green' as const,
    },
    {
      title: 'Error Rate',
      value: `${usageStats?.errorRate || 0}%`,
      subtitle: 'Last 30 days',
      icon: AlertCircle,
      color: 'yellow' as const,
    },
    {
      title: 'Avg Response Time',
      value: usageStats?.averageResponseTime ? `${usageStats.averageResponseTime}ms` : '0ms',
      subtitle: '',
      icon: Zap,
      color: 'cyan' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'cyan';
  progress?: number;
}

function StatCard({ title, value, subtitle, icon: Icon, color, progress }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    cyan: 'text-cyan-400',
  };

  const subtitleColorClasses = {
    blue: 'text-white/60',
    green: 'text-green-400',
    yellow: 'text-white/60',
    cyan: 'text-cyan-400',
  };

  return (
    <div className={STYLES.CARD_BASE}>
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
      </div>
      
      <div className="p-6 pt-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        
        {subtitle && (
          <p className={`text-xs mt-1 ${subtitleColorClasses[color]}`}>
            {subtitle}
          </p>
        )}
        
        {typeof progress !== 'undefined' && (
          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
            <div
              className="bg-blue-400 h-2 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
