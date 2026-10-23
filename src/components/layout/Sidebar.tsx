import React from 'react';
import { ActiveTab } from '../../types/jira';
import { StorageService } from '../../services/storage';
import { 
  Globe,
  Columns3, 
  ListOrdered, 
  LayoutDashboard, 
  BarChart3, 
  Code2, 
  Database, 
  Terminal, 
  Laptop, 
  FolderGit2, 
  Download,
  Server
} from 'lucide-react';
import { downloadStarterProjectZip } from '../../utils/exportProject';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  issueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, issueCount }) => {
  const project = StorageService.getProject();

  const handleDownload = async () => {
    await downloadStarterProjectZip();
  };

  const mainNavItems = [
    { id: 'landing' as ActiveTab, label: 'Product Website', icon: Globe },
    { id: 'board' as ActiveTab, label: 'Kanban Board', icon: Columns3, badge: issueCount },
    { id: 'issues-list' as ActiveTab, label: 'All Issues', icon: ListOrdered },
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports' as ActiveTab, label: 'Reports Summary', icon: BarChart3 },
  ];

  const backendNavItems = [
    { id: 'backend-code' as ActiveTab, label: 'Spring Boot Codebase', icon: Code2 },
    { id: 'database-schema' as ActiveTab, label: 'MySQL Schema & DDL', icon: Database },
    { id: 'api-docs' as ActiveTab, label: 'REST API Explorer', icon: Terminal },
    { id: 'local-setup' as ActiveTab, label: 'Local Setup Guide', icon: Laptop },
  ];

  return (
    <aside className="w-60 bg-[#FAFBFC] border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3">
        {/* Project Header Lockup */}
        <div className="flex items-center gap-3 px-2 py-2 mb-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs tracking-wider shrink-0 shadow-xs">
            {project.key}
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xs font-bold text-slate-900 truncate leading-tight">{project.name}</h2>
            <span className="text-[11px] text-slate-500 font-mono tracking-tight leading-tight">Key: {project.key} · Software</span>
          </div>
        </div>

        {/* Primary Jira Views */}
        <div className="space-y-0.5">
          <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Planning & Tracking</p>
          {mainNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-100/70 text-blue-800 font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 font-mono text-[11px] rounded tabular-nums ${
                    isActive ? 'bg-blue-200/70 text-blue-900 font-semibold' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Backend & Architecture Section */}
        <div className="mt-5 space-y-0.5">
          <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Architecture & Starter</p>
          {backendNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-100/70 text-blue-800 font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Local Laptop Export Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Local Laptop Target</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Java 21 Spring Boot + MySQL 8.0 ready to run with Docker Compose.
          </p>
          <button
            onClick={handleDownload}
            className="w-full mt-2.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Starter ZIP</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
