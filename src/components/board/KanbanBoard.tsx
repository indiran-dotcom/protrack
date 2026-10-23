import React, { useState } from 'react';
import { Issue, IssueStatus, Priority, IssueType, User } from '../../types/jira';
import { IssueCard } from './IssueCard';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../services/storage';
import { Plus, Filter, RotateCcw, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface KanbanBoardProps {
  issues: Issue[];
  users: User[];
  onSelectIssue: (issue: Issue) => void;
  onStatusChange: (issueId: string, status: IssueStatus) => void;
  onQuickCreate: (status: IssueStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  issues,
  users,
  onSelectIssue,
  onStatusChange,
  onQuickCreate,
}) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<IssueStatus | null>(null);

  const columns: { status: IssueStatus; title: string; color: string }[] = [
    { status: 'OPEN', title: 'Open', color: 'border-t-blue-500' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-t-amber-500' },
    { status: 'RESOLVED', title: 'Resolved', color: 'border-t-emerald-500' },
    { status: 'CLOSED', title: 'Closed', color: 'border-t-slate-400' },
  ];

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchKey = issue.key.toLowerCase().includes(q);
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      if (!matchKey && !matchTitle && !matchDesc) return false;
    }
    // Priority
    if (priorityFilter !== 'ALL' && issue.priority !== priorityFilter) {
      return false;
    }
    // Assignee
    if (assigneeFilter !== 'ALL') {
      if (assigneeFilter === 'UNASSIGNED') {
        if (issue.assigneeId) return false;
      } else if (issue.assigneeId !== assigneeFilter) {
        return false;
      }
    }
    // Type
    if (typeFilter !== 'ALL' && issue.issueType !== typeFilter) {
      return false;
    }
    return true;
  });

  const hasActiveFilters = search !== '' || priorityFilter !== 'ALL' || assigneeFilter !== 'ALL' || typeFilter !== 'ALL';

  const resetFilters = () => {
    setSearch('');
    setPriorityFilter('ALL');
    setAssigneeFilter('ALL');
    setTypeFilter('ALL');
  };

  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    setDraggedIssueId(issueId);
    e.dataTransfer.setData('text/plain', issueId);
  };

  const handleDragOver = (e: React.DragEvent, status: IssueStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: IssueStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const issueId = draggedIssueId || e.dataTransfer.getData('text/plain');
    if (issueId) {
      onStatusChange(issueId, targetStatus);
      setDraggedIssueId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F5F7] overflow-hidden">
      {/* Board Subheader: Title, Filters & Search */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">ProTrack Board</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Active sprint workflow · Drag issues between lifecycle stages
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-36 sm:w-48 transition-all"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Assignee Filter */}
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Assignees</option>
              <option value="UNASSIGNED">Unassigned</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
              ))}
            </select>

            {/* Issue Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="BUG">Bug</option>
              <option value="TASK">Task</option>
              <option value="STORY">Story</option>
              <option value="IMPROVEMENT">Improvement</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="flex-1 p-6 overflow-x-auto overflow-y-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full min-w-[900px]">
          {columns.map(column => {
            const columnIssues = filteredIssues.filter(i => i.status === column.status);
            const totalPoints = columnIssues.reduce((acc, i) => acc + (i.storyPoints || 0), 0);
            const isDragOver = dragOverColumn === column.status;

            return (
              <div
                key={column.status}
                onDragOver={(e) => handleDragOver(e, column.status)}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={(e) => handleDrop(e, column.status)}
                className={`flex flex-col bg-[#EBECF0] rounded-lg border border-slate-200 shadow-xs overflow-hidden transition-all ${
                  column.color
                } border-t-4 ${
                  isDragOver ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
                }`}
              >
                {/* Column Header */}
                <div className="px-3 py-2.5 flex items-center justify-between bg-slate-100/60 border-b border-slate-200/80 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {column.title}
                    </span>
                    <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full font-mono font-semibold text-[11px] tabular-nums">
                      {columnIssues.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      title="Total Story Points in Column"
                      className="text-[11px] font-mono text-slate-500 tabular-nums"
                    >
                      {totalPoints} pts
                    </span>
                    <button
                      onClick={() => onQuickCreate(column.status)}
                      title={`Add issue to ${column.title}`}
                      className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Column Cards Container */}
                <div className="flex-1 p-2 space-y-2.5 overflow-y-auto">
                  {columnIssues.length > 0 ? (
                    columnIssues.map(issue => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        users={users}
                        onSelect={onSelectIssue}
                        onStatusChange={onStatusChange}
                        onDragStart={handleDragStart}
                      />
                    ))
                  ) : (
                    <div className="h-32 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <p className="text-xs font-medium">No issues in {column.title}</p>
                      <button
                        onClick={() => onQuickCreate(column.status)}
                        className="mt-1.5 text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                      >
                        + Create issue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
