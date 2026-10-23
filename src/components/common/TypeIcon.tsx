import React from 'react';
import { IssueType } from '../../types/jira';
import { CircleDot, CheckSquare, Bookmark, ArrowUpRight } from 'lucide-react';

interface TypeIconProps {
  type: IssueType;
  showLabel?: boolean;
}

export const TypeIcon: React.FC<TypeIconProps> = ({ type, showLabel = false }) => {
  const getIcon = () => {
    switch (type) {
      case 'BUG':
        return (
          <span className="w-4 h-4 rounded bg-rose-600 flex items-center justify-center text-white" title="Bug">
            <CircleDot className="w-2.5 h-2.5" />
          </span>
        );
      case 'TASK':
        return (
          <span className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white" title="Task">
            <CheckSquare className="w-2.5 h-2.5" />
          </span>
        );
      case 'STORY':
        return (
          <span className="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center text-white" title="Story">
            <Bookmark className="w-2.5 h-2.5 fill-current" />
          </span>
        );
      case 'IMPROVEMENT':
        return (
          <span className="w-4 h-4 rounded bg-purple-600 flex items-center justify-center text-white" title="Improvement">
            <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.5]" />
          </span>
        );
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'BUG': return 'Bug';
      case 'TASK': return 'Task';
      case 'STORY': return 'Story';
      case 'IMPROVEMENT': return 'Improvement';
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      {getIcon()}
      {showLabel && <span className="text-xs font-medium text-slate-700">{getLabel()}</span>}
    </span>
  );
};
