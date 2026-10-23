import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { User, Issue, IssueStatus, Priority } from '../../types/jira';
import { UserAvatar } from '../common/UserAvatar';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { BarChart3, Users, PieChart, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ReportsViewProps {
  issues: Issue[];
  users: User[];
  onSelectIssue: (issue: Issue) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ issues, users, onSelectIssue }) => {
  const [activeReportTab, setActiveReportTab] = useState<'developer' | 'status' | 'priority'>('developer');

  const developerWorkloads = StorageService.getDeveloperReport();
  const statusSummaries = StorageService.getStatusReport();
  const prioritySummaries = StorageService.getPriorityReport();
  const metrics = StorageService.getDashboardMetrics();

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F5F7] p-6 space-y-6">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Analytics & Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive developer workload distributions, lifecycle velocity, and priority allocation
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-xs">
          <button
            onClick={() => setActiveReportTab('developer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeReportTab === 'developer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Developer-Wise
          </button>
          <button
            onClick={() => setActiveReportTab('status')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeReportTab === 'status'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Status-Wise
          </button>
          <button
            onClick={() => setActiveReportTab('priority')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeReportTab === 'priority'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Priority-Wise
          </button>
        </div>
      </div>

      {/* 1. Developer-Wise Summary Breakdown */}
      {activeReportTab === 'developer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-[#FAFBFC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Developer Workload & Completion Velocity</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {developerWorkloads.length} Engineers tracked
              </span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAFBFC] border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <tr>
                  <th className="py-3 px-5">Developer</th>
                  <th className="py-3 px-4 text-center">Total Assigned</th>
                  <th className="py-3 px-4 text-center">Pending (Open / In Prog)</th>
                  <th className="py-3 px-4 text-center">Resolved / Closed</th>
                  <th className="py-3 px-4 text-center">Critical Issues</th>
                  <th className="py-3 px-5 text-right w-52">Resolution Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {developerWorkloads.map(dev => (
                  <tr key={dev.user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5">
                      <UserAvatar user={dev.user} showName size="md" />
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 tabular-nums">
                      {dev.totalAssigned}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-amber-600 tabular-nums">
                      {dev.pendingCount}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-600 tabular-nums">
                      {dev.resolvedCount}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      {dev.criticalCount > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                          {dev.criticalCount}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${dev.completionRate}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-900 tabular-nums w-10 text-right">
                          {dev.completionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Developer Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {developerWorkloads.map(dev => {
              const assignedIssues = issues.filter(i => i.assigneeId === dev.user.id);
              return (
                <div key={dev.user.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <UserAvatar user={dev.user} showName size="sm" />
                    <span className="text-[11px] font-mono font-bold text-slate-500 tabular-nums">
                      {assignedIssues.length} issues
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {assignedIssues.length > 0 ? (
                      assignedIssues.map(issue => (
                        <div
                          key={issue.id}
                          onClick={() => onSelectIssue(issue)}
                          className="p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-100 flex items-center justify-between text-xs cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono font-bold text-[11px] text-slate-700 shrink-0">{issue.key}</span>
                            <span className="truncate font-medium text-slate-900">{issue.title}</span>
                          </div>
                          <StatusBadge status={issue.status} />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-3 text-center">No active issues assigned</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Status-Wise Breakdown */}
      {activeReportTab === 'status' && (
        <div className="space-y-6">
          {/* Proportional Stacked Bar */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Issue Lifecycle Progress Distribution</h2>
              <span className="text-xs text-slate-500 font-mono tabular-nums">Total: {metrics.total} issues</span>
            </div>

            <div className="h-6 w-full rounded-md overflow-hidden flex bg-slate-100 shadow-inner">
              {statusSummaries.map(st => (
                <div
                  key={st.status}
                  style={{ width: `${st.percentage}%`, backgroundColor: st.color }}
                  title={`${st.label}: ${st.count} issues (${st.percentage}%)`}
                  className="h-full transition-all hover:opacity-90 flex items-center justify-center text-[10px] text-white font-bold font-mono"
                >
                  {st.percentage > 10 ? `${st.percentage}%` : ''}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
              {statusSummaries.map(st => (
                <div key={st.status} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: st.color }} />
                  <span className="font-medium text-slate-700">{st.label}:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{st.count} ({st.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusSummaries.map(st => {
              const matched = issues.filter(i => i.status === st.status);
              return (
                <div key={st.status} className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{st.label}</span>
                      <StatusBadge status={st.status} />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{st.count}</span>
                      <span className="text-xs font-mono text-slate-500 tabular-nums">({st.percentage}% of total)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3 max-h-40 overflow-y-auto">
                    {matched.map(issue => (
                      <div
                        key={issue.id}
                        onClick={() => onSelectIssue(issue)}
                        className="p-1.5 rounded hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer"
                      >
                        <span className="font-mono font-semibold text-slate-700">{issue.key}</span>
                        <PriorityBadge priority={issue.priority} showIconOnly />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Priority-Wise Breakdown */}
      {activeReportTab === 'priority' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {prioritySummaries.map(p => (
              <div key={p.priority} className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{p.label} Priority</span>
                  <PriorityBadge priority={p.priority} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{p.count}</span>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">({p.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${p.percentage}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Issues Categorized by Severity Priority</h2>
            <div className="space-y-4">
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as Priority[]).map(pri => {
                const priIssues = issues.filter(i => i.priority === pri);
                return (
                  <div key={pri} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={pri} />
                        <span>({priIssues.length} issues)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {priIssues.map(issue => (
                        <div
                          key={issue.id}
                          onClick={() => onSelectIssue(issue)}
                          className="p-2.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-md flex items-center justify-between text-xs cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono font-bold text-slate-700">{issue.key}</span>
                            <span className="font-semibold text-slate-900 truncate">{issue.title}</span>
                          </div>
                          <StatusBadge status={issue.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
