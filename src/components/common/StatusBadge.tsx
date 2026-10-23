import React from 'react';
import { IssueStatus } from '../../types/jira';
import { STATUS_CONFIG } from '../../services/storage';

interface StatusBadgeProps {
  status: IssueStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};
