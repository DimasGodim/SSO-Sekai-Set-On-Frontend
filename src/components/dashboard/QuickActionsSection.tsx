import React from 'react';
import { Globe, Zap, Clock } from 'lucide-react';
import { STYLES, ROUTES } from '../../lib/constants';

interface QuickActionsSectionProps {
  onNavigateToUsage?: () => void;
}

export function QuickActionsSection({ onNavigateToUsage }: QuickActionsSectionProps) {
  const quickActions: QuickActionCardProps[] = [
    {
      title: 'API Documentation',
      description: 'View complete API reference',
      icon: Globe,
      color: 'blue' as const,
      onClick: () => window.location.href = ROUTES.DOCS,
    },
    {
      title: 'API Testing',
      description: 'Test endpoints in browser',
      icon: Zap,
      color: 'cyan' as const,
      onClick: () => window.location.href = ROUTES.DOCS,
    },
    {
      title: 'Usage History',
      description: 'View detailed analytics',
      icon: Clock,
      color: 'green' as const,
      onClick: onNavigateToUsage || (() => window.location.href = ROUTES.USAGE),
    },
  ];

  return (
    <div className={STYLES.CARD_BASE}>
      <div className="p-6 pb-2">
        <h3 className="text-white text-lg font-semibold">Quick Actions</h3>
        <p className="text-white/60 text-sm mt-1">
          Common tasks and useful links
        </p>
      </div>
      
      <div className="p-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'cyan' | 'green';
  onClick: () => void;
}

function QuickActionCard({ title, description, icon: Icon, color, onClick }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'text-blue-400 border-blue-400 hover:border-blue-400 hover:bg-blue-400/10',
    cyan: 'text-cyan-400 border-cyan-400 hover:border-cyan-400 hover:bg-cyan-400/10',
    green: 'text-green-400 border-green-400 hover:border-green-400 hover:bg-green-400/10',
  };

  return (
    <button
      className={`h-auto p-4 border border-white/20 text-left flex flex-col items-start space-y-2 rounded transition-colors ${colorClasses[color]}`}
      onClick={onClick}
    >
      <Icon className={`h-5 w-5 ${colorClasses[color].split(' ')[0]}`} />
      <div>
        <div className="font-medium text-white">{title}</div>
        <div className="text-sm text-white/60">{description}</div>
      </div>
    </button>
  );
}
