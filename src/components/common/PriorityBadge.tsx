import React from 'react';
import { Priority } from '../../types/jira';
import { PRIORITY_CONFIG } from '../../services/storage';
import { ArrowDown, ArrowUp, AlertCircle, AlertOctagon } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showIconOnly?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIconOnly = false }) => {
  const config = PRIORITY_CONFIG[priority];

  const renderIcon = () => {
    switch (priority) {
      case 'LOW':
        return <ArrowDown className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />;
      case 'MEDIUM':
        return <div className="w-2.5 h-1 bg-amber-500 rounded-sm" />;
      case 'HIGH':
        return <ArrowUp className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />;
      case 'CRITICAL':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />;
    }
  };

  if (showIconOnly) {
    return (
      <span title={`Priority: ${config.label}`} className="inline-flex items-center justify-center">
        {renderIcon()}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border ${config.badge}`}>
      {renderIcon()}
      <span>{config.label}</span>
    </span>
  );
};
