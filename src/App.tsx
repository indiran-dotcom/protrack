import React, { useState, useEffect } from 'react';
import { Issue, User, ActiveTab, IssueStatus } from './types/jira';
import { StorageService } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { KanbanBoard } from './components/board/KanbanBoard';
import { IssuesListView } from './components/issues/IssuesListView';
import { DashboardView } from './components/dashboard/DashboardView';
import { ReportsView } from './components/reports/ReportsView';
import { BackendHub } from './components/backend/BackendHub';
import { ProductWebPage } from './components/website/ProductWebPage';
import { CreateIssueModal } from './components/issue/CreateIssueModal';
import { IssueDetailModal } from './components/issue/IssueDetailModal';

export default function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(StorageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] = useState<IssueStatus>('OPEN');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Load data on mount
  const refreshData = () => {
    setIssues(StorageService.getIssues());
    setUsers(StorageService.getUsers());
    setCurrentUser(StorageService.getCurrentUser());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update selected issue when issues change
  useEffect(() => {
    if (selectedIssue) {
      const fresh = StorageService.getIssues().find(i => i.id === selectedIssue.id);
      setSelectedIssue(fresh || null);
    }
  }, [issues]);

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    StorageService.updateStatus(issueId, newStatus);
    refreshData();
  };

  const handleOpenQuickCreate = (status: IssueStatus) => {
    setCreateDefaultStatus(status);
    setIsCreateOpen(true);
  };

  return (
    <div className="min-h-screen w-screen bg-[#F4F5F7] overflow-x-hidden text-[#172B4D]">
      {/* 1. Standalone Product Web Page Mode (Full Width, Zero Clutter) */}
      {activeTab === 'landing' ? (
        <ProductWebPage
          onLaunchApp={(tab) => setActiveTab(tab || 'board')}
          issues={issues}
          users={users}
          onSelectIssue={(issue) => setSelectedIssue(issue)}
        />
      ) : (
        /* 2. Interactive Jira Application Workspace Mode */
        <div className="flex flex-col h-screen w-screen overflow-hidden">
          {/* Top Bar */}
          <Navbar
            currentUser={currentUser}
            onUserChange={(user) => {
              setCurrentUser(user);
              refreshData();
            }}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            onOpenCreate={() => {
              setCreateDefaultStatus('OPEN');
              setIsCreateOpen(true);
            }}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (activeTab !== 'board' && activeTab !== 'issues-list') {
                setActiveTab('board');
              }
            }}
          />

          {/* Main Layout Canvas (Sidebar + Content Viewport) */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Jira Project Navigation */}
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              issueCount={issues.length}
            />

            {/* Central Viewport */}
            <main className="flex-1 flex flex-col overflow-hidden">
              {activeTab === 'board' && (
                <KanbanBoard
                  issues={issues}
                  users={users}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                  onStatusChange={handleStatusChange}
                  onQuickCreate={handleOpenQuickCreate}
                />
              )}

              {activeTab === 'issues-list' && (
                <IssuesListView
                  issues={issues}
                  users={users}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                  onStatusChange={handleStatusChange}
                  onOpenCreate={() => {
                    setCreateDefaultStatus('OPEN');
                    setIsCreateOpen(true);
                  }}
                />
              )}

              {activeTab === 'dashboard' && (
                <DashboardView
                  issues={issues}
                  users={users}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  issues={issues}
                  users={users}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                />
              )}

              {activeTab === 'backend-code' && (
                <BackendHub initialTab="code" />
              )}

              {activeTab === 'database-schema' && (
                <BackendHub initialTab="schema" />
              )}

              {activeTab === 'local-setup' && (
                <BackendHub initialTab="setup" />
              )}

              {activeTab === 'api-docs' && (
                <BackendHub initialTab="apis" />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Global Modals (Accessible everywhere) */}
      <CreateIssueModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={refreshData}
        users={users}
        defaultStatus={createDefaultStatus}
      />

      <IssueDetailModal
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdate={refreshData}
        users={users}
        currentUser={currentUser}
      />
    </div>
  );
}
