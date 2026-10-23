import React from 'react';
import { StorageService } from '../../services/storage';
import { Issue, ActiveTab, User } from '../../types/jira';
import { Layers, Clock, CheckCircle2, AlertOctagon, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { TypeIcon } from '../common/TypeIcon';
import { UserAvatar } from '../common/UserAvatar';

interface DashboardViewProps {
  issues: Issue[];
  users: User[];
  onSelectIssue: (issue: Issue) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  issues,
  users,
  onSelectIssue,
  onNavigateTab,
}) => {
  const metrics = StorageService.getDashboardMetrics();
  const developerWorkloads = StorageService.getDeveloperReport();

  const recentIssues = [...issues].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  const criticalIssues = issues.filter(
    i => i.priority === 'CRITICAL' && (i.status === 'OPEN' || i.status === 'IN_PROGRESS')
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F5F7] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time project health, issue lifecycle telemetry, and team assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>View Detailed Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Core Summary Cards (Total, Pending, Resolved) + Critical Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Issues Card */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Issues</span>
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {metrics.total}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Across all tracking stages</p>
          </div>
        </div>

        {/* Pending Issues Card (Open + In Progress) */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Issues</span>
            <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
              {metrics.pending}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
              <span>{metrics.openCount} Open</span>
              <span>·</span>
              <span>{metrics.inProgressCount} In Progress</span>
            </div>
          </div>
        </div>

        {/* Resolved Issues Card (Resolved + Closed) */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved Issues</span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {metrics.resolved}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
              <span>{metrics.resolvedCount} Resolved</span>
              <span>·</span>
              <span>{metrics.closedCount} Closed</span>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Blockers</span>
            <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-600 font-mono tabular-nums">
              {metrics.critical}
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-1">Requires immediate engineering triage</p>
          </div>
        </div>
      </div>

      {/* Grid: Developer Assignment Snapshot & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Developer Workload Snapshot (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Developer Assignment Snapshot</h2>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Full breakdown &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {developerWorkloads.map(dev => (
              <div key={dev.user.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar user={dev.user} size="md" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{dev.user.fullName}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{dev.user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">{dev.totalAssigned}</span>
                    <span className="text-[11px] text-slate-500 ml-1">assigned</span>
                  </div>

                  {/* Mini Progress */}
                  <div className="w-28 flex flex-col items-end">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${dev.completionRate}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                      {dev.completionRate}% resolved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Attention Box (1 Col) */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Active Critical Issues</h2>
          </div>

          <div className="flex-1 mt-3 space-y-2.5">
            {criticalIssues.length > 0 ? (
              criticalIssues.map(issue => (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="p-3 bg-rose-50/50 border border-rose-200 rounded-md hover:bg-rose-50 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-rose-700">{issue.key}</span>
                    <StatusBadge status={issue.status} />
                  </div>
                  <p className="text-xs font-semibold text-slate-900 line-clamp-2">{issue.title}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Zero Critical Blockers</p>
                <p className="text-[11px] text-slate-500 mt-0.5">All high severity tickets are currently mitigated.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Recently Updated Issues</h2>
          </div>
          <button
            onClick={() => onNavigateTab('issues-list')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
          >
            View all {issues.length} issues &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-1">
          {recentIssues.map(issue => {
            const assignee = users.find(u => u.id === issue.assigneeId);
            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="py-2.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-md transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TypeIcon type={issue.issueType} />
                  <span className="font-mono font-bold text-xs text-slate-700 shrink-0">{issue.key}</span>
                  <span className="text-xs font-semibold text-slate-900 truncate">{issue.title}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <PriorityBadge priority={issue.priority} />
                  <StatusBadge status={issue.status} />
                  <div className="hidden sm:block">
                    <UserAvatar user={assignee} size="sm" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums w-16 text-right">
                    {new Date(issue.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
