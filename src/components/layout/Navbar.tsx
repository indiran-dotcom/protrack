import React, { useState } from 'react';
import { User, ActiveTab, Role } from '../../types/jira';
import { StorageService } from '../../services/storage';
import { Plus, Search, Layers, ChevronDown, Check, ShieldCheck, Download, Code2 } from 'lucide-react';
import { downloadStarterProjectZip } from '../../utils/exportProject';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenCreate: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  activeTab,
  onTabChange,
  onOpenCreate,
  searchQuery,
  onSearchChange,
}) => {
  const users = StorageService.getUsers();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadStarterProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'landing', label: 'Product Overview' },
    { id: 'board', label: 'Kanban Board' },
    { id: 'issues-list', label: 'All Issues' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'reports', label: 'Reports' },
    { id: 'backend-code', label: 'Backend Hub' },
    { id: 'local-setup', label: 'Setup Guide' },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-6 shrink-0 z-30 sticky top-0">
      {/* Zone 1: Brand & Project Context */}
      <div className="flex items-center gap-6 shrink-0">
        <button
          onClick={() => onTabChange('landing')}
          className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-none">ProTrack</span>
            <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase leading-none mt-0.5">Enterprise Jira</span>
          </div>
        </button>

        <div className="h-4 w-px bg-slate-200 hidden md:block" />

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-blue-700 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Zone 3: Search, Create Action & User Role Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Search */}
        <div className="relative hidden sm:block w-48 xl:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search key, title, role..."
            className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Back to Web Page Button */}
        <button
          onClick={() => onTabChange('landing')}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-md transition-colors cursor-pointer whitespace-nowrap"
          title="Return to the full product website"
        >
          <span>Web Page</span>
        </button>

        {/* Create Issue Action Button */}
        <button
          onClick={onOpenCreate}
          className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create</span>
        </button>

        {/* Download Starter ZIP Button */}
        <button
          onClick={handleDownload}
          disabled={isExporting}
          title="Download complete Java Spring Boot & MySQL project ZIP"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>{isExporting ? 'Packaging...' : 'Starter ZIP'}</span>
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-1.5 rounded-md hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center uppercase">
                {currentUser.initials}
              </div>
            )}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.fullName}</span>
              <span className="text-[10px] font-medium text-slate-500 leading-tight">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Active Role</p>
                <p className="text-xs text-slate-600 mt-0.5">Test permissions as another teammate:</p>
              </div>
              <div className="py-1">
                {users.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        StorageService.setCurrentUser(u);
                        onUserChange(u);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                        isCurrent ? 'bg-blue-50/50 text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.fullName}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-[10px] font-bold flex items-center justify-center uppercase">
                            {u.initials}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 leading-none">{u.fullName}</p>
                          <p className="text-[10px] text-slate-500 leading-none mt-1">{u.role}</p>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="px-3 pt-2 pb-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  JWT Auth Active
                </span>
                <span className="text-slate-400 font-mono text-[10px]">HS256</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
