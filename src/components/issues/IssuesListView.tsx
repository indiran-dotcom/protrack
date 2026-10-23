import React, { useState } from 'react';
import { Issue, IssueStatus, Priority, User } from '../../types/jira';
import { TypeIcon } from '../common/TypeIcon';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { UserAvatar } from '../common/UserAvatar';
import { Search, RotateCcw, ArrowUpDown, ChevronDown, Plus } from 'lucide-react';

interface IssuesListViewProps {
  issues: Issue[];
  users: User[];
  onSelectIssue: (issue: Issue) => void;
  onStatusChange: (issueId: string, status: IssueStatus) => void;
  onOpenCreate: () => void;
}

export const IssuesListView: React.FC<IssuesListViewProps> = ({
  issues,
  users,
  onSelectIssue,
  onStatusChange,
  onOpenCreate,
}) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'key' | 'priority' | 'status' | 'updated'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filtered = issues.filter(issue => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchKey = issue.key.toLowerCase().includes(q);
      const matchTitle = issue.title.toLowerCase().includes(q);
      if (!matchKey && !matchTitle) return false;
    }
    if (priorityFilter !== 'ALL' && issue.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && issue.status !== statusFilter) return false;
    if (assigneeFilter !== 'ALL') {
      if (assigneeFilter === 'UNASSIGNED') {
        if (issue.assigneeId) return false;
      } else if (issue.assigneeId !== assigneeFilter) {
        return false;
      }
    }
    return true;
  });

  const priorityWeight: Record<Priority, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  const statusWeight: Record<IssueStatus, number> = {
    OPEN: 1,
    IN_PROGRESS: 2,
    RESOLVED: 3,
    CLOSED: 4,
  };

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'key') {
      cmp = a.key.localeCompare(b.key);
    } else if (sortBy === 'priority') {
      cmp = priorityWeight[b.priority] - priorityWeight[a.priority];
    } else if (sortBy === 'status') {
      cmp = statusWeight[a.status] - statusWeight[b.status];
    } else {
      cmp = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return sortOrder === 'asc' ? -cmp : cmp;
  });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* List Header & Filters */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">All Issues</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tabular view with multi-attribute filtering and status updates
            </p>
          </div>

          <button
            onClick={onOpenCreate}
            className="self-start sm:self-auto px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Issue</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by ID or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-48 sm:w-60"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Assignees</option>
            <option value="UNASSIGNED">Unassigned</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>

          {(search || priorityFilter !== 'ALL' || statusFilter !== 'ALL' || assigneeFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setPriorityFilter('ALL');
                setStatusFilter('ALL');
                setAssigneeFilter('ALL');
              }}
              className="px-2 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-md flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <div className="ml-auto text-xs text-slate-500 font-mono tabular-nums">
            Showing {sorted.length} of {issues.length} issues
          </div>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#FAFBFC] border-b border-slate-200 sticky top-0 z-10 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
            <tr>
              <th className="py-2.5 px-4 w-12 text-center">Type</th>
              <th
                onClick={() => toggleSort('key')}
                className="py-2.5 px-3 w-28 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Key</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-4">Summary</th>
              <th
                onClick={() => toggleSort('priority')}
                className="py-2.5 px-4 w-32 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('status')}
                className="py-2.5 px-4 w-36 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-4 w-44">Assignee</th>
              <th
                onClick={() => toggleSort('updated')}
                className="py-2.5 px-4 w-32 text-right cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Updated</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sorted.map(issue => {
              const assignee = users.find(u => u.id === issue.assigneeId);
              return (
                <tr
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-4 text-center">
                    <TypeIcon type={issue.issueType} />
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {issue.key}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-slate-900 hover:underline">
                      {issue.title}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={issue.status}
                      onChange={(e) => onStatusChange(issue.id, e.target.value as IssueStatus)}
                      className="px-2 py-0.5 text-xs font-semibold rounded border border-slate-200 bg-white text-slate-700 hover:border-slate-300 outline-none cursor-pointer"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-4">
                    <UserAvatar user={assignee} showName size="sm" />
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[11px] text-slate-500 tabular-nums">
                    {new Date(issue.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-medium">No matching issues found.</p>
            <p className="text-xs mt-1">Try relaxing your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
