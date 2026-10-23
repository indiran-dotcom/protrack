import React, { useState } from 'react';
import { Issue, IssueStatus, User } from '../../types/jira';
import { TypeIcon } from '../common/TypeIcon';
import { PriorityBadge } from '../common/PriorityBadge';
import { UserAvatar } from '../common/UserAvatar';
import { MessageSquare, CheckSquare, MoreHorizontal, ArrowRight } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  users: User[];
  onSelect: (issue: Issue) => void;
  onStatusChange: (issueId: string, status: IssueStatus) => void;
  onDragStart?: (e: React.DragEvent, issueId: string) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  users,
  onSelect,
  onStatusChange,
  onDragStart,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const assignee = users.find(u => u.id === issue.assigneeId);
  const completedSubtasks = issue.subtasks.filter(s => s.completed).length;

  const nextStatusMap: Record<IssueStatus, IssueStatus> = {
    OPEN: 'IN_PROGRESS',
    IN_PROGRESS: 'RESOLVED',
    RESOLVED: 'CLOSED',
    CLOSED: 'OPEN',
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, issue.id)}
      onClick={() => onSelect(issue)}
      className="group relative bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-md p-3 transition-all cursor-pointer select-none space-y-2.5"
    >
      {/* Card Header: Type + Key + Priority */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <TypeIcon type={issue.issueType} />
          <span className="font-mono font-semibold text-slate-700 hover:text-blue-600 transition-colors">
            {issue.key}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={issue.priority} showIconOnly />
          {/* Quick Transition Menu Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickMenu(!showQuickMenu);
            }}
            className="w-5 h-5 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Quick actions"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Title */}
      <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
        {issue.title}
      </h4>

      {/* Card Footer: Badges, Subtasks, Comments & Assignee */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Story Points */}
          {issue.storyPoints !== undefined && (
            <span
              title="Story Points"
              className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold tabular-nums text-[10px]"
            >
              {issue.storyPoints}
            </span>
          )}

          {/* Subtasks Progress */}
          {issue.subtasks.length > 0 && (
            <span
              title={`Subtasks: ${completedSubtasks} of ${issue.subtasks.length} completed`}
              className={`flex items-center gap-1 font-mono text-[10px] ${
                completedSubtasks === issue.subtasks.length ? 'text-emerald-600 font-semibold' : 'text-slate-500'
              }`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>{completedSubtasks}/{issue.subtasks.length}</span>
            </span>
          )}

          {/* Comments count */}
          {issue.comments.length > 0 && (
            <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500" title="Comments">
              <MessageSquare className="w-3 h-3" />
              <span>{issue.comments.length}</span>
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        <div title={assignee ? `Assigned to ${assignee.fullName}` : 'Unassigned'}>
          <UserAvatar user={assignee} size="sm" />
        </div>
      </div>

      {/* Quick Move Popover */}
      {showQuickMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2 top-8 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-20 text-xs"
        >
          <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Move To Status
          </div>
          {(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as IssueStatus[]).map((st) => (
            <button
              key={st}
              disabled={issue.status === st}
              onClick={() => {
                onStatusChange(issue.id, st);
                setShowQuickMenu(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer ${
                issue.status === st ? 'text-slate-300 font-normal cursor-not-allowed' : 'text-slate-700'
              }`}
            >
              <span>{st.replace('_', ' ')}</span>
              {issue.status === st && <span className="text-[10px] font-mono text-slate-400">Current</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
