import { Issue, Project, User, IssueStatus, Priority, IssueType, Role } from '../types/jira';
import { INITIAL_ISSUES, INITIAL_PROJECT, INITIAL_USERS } from '../data/mockData';

const ISSUES_KEY = 'protrack_issues_v2';
const CURRENT_USER_KEY = 'protrack_user_v2';
const ALL_USERS_KEY = 'protrack_all_users_v2';
const TOKEN_KEY = 'protrack_jwt_token_v2';

export const STATUS_CONFIG: Record<IssueStatus, { label: string; bg: string; text: string; border: string }> = {
  OPEN: {
    label: 'Open',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  CLOSED: {
    label: 'Closed',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300',
  },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; badge: string; dotColor: string }> = {
  LOW: {
    label: 'Low',
    color: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: '#10B981',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: '#F59E0B',
  },
  HIGH: {
    label: 'High',
    color: 'text-orange-700',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    dotColor: '#F97316',
  },
  CRITICAL: {
    label: 'Critical',
    color: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
    dotColor: '#E11D48',
  },
};

export const StorageService = {
  getUsers(): User[] {
    const raw = localStorage.getItem(ALL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  getCurrentUser(): User {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    return INITIAL_USERS[0]; // Alex Chen
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    // Simulate JWT token generation
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      sub: user.username,
      userId: user.id,
      role: `ROLE_${user.role}`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    }))}.mockSignatureForLocalViteDev`;
    localStorage.setItem(TOKEN_KEY, mockJwt);
  },

  getJwtToken(): string {
    return localStorage.getItem(TOKEN_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.signature';
  },

  login(username: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase());
    if (user) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'User not found with provided username or email' };
  },

  register(username: string, fullName: string, email: string, role: Role): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username is already taken' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email is already registered' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      fullName,
      email,
      role,
      avatarUrl: '',
      initials: fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U',
    };

    const updated = [...users, newUser];
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(updated));
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  getProject(): Project {
    return INITIAL_PROJECT;
  },

  getIssues(): Issue[] {
    const raw = localStorage.getItem(ISSUES_KEY);
    if (!raw) {
      localStorage.setItem(ISSUES_KEY, JSON.stringify(INITIAL_ISSUES));
      return INITIAL_ISSUES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ISSUES;
    }
  },

  saveIssues(issues: Issue[]): void {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  },

  resetData(): void {
    localStorage.removeItem(ISSUES_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(ALL_USERS_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  createIssue(params: {
    title: string;
    description: string;
    issueType: IssueType;
    priority: Priority;
    assigneeId?: string;
    storyPoints?: number;
    labels?: string[];
  }): Issue {
    const issues = this.getIssues();
    const currentUser = this.getCurrentUser();
    const nextNum = issues.length + 101;
    const key = `PRO-${nextNum}`;
    const now = new Date().toISOString();

    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      key,
      projectId: INITIAL_PROJECT.id,
      title: params.title.trim(),
      description: params.description.trim(),
      issueType: params.issueType,
      status: 'OPEN',
      priority: params.priority,
      storyPoints: params.storyPoints ?? 3,
      assigneeId: params.assigneeId || undefined,
      reporterId: currentUser.id,
      labels: params.labels || ['feature'],
      comments: [],
      subtasks: [],
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newIssue, ...issues];
    this.saveIssues(updated);
    return newIssue;
  },

  updateIssue(id: string, updates: Partial<Issue>): Issue | null {
    const issues = this.getIssues();
    let updatedIssue: Issue | null = null;
    const now = new Date().toISOString();

    const updated = issues.map(issue => {
      if (issue.id === id) {
        updatedIssue = {
          ...issue,
          ...updates,
          updatedAt: now,
        };
        return updatedIssue;
      }
      return issue;
    });

    if (updatedIssue) {
      this.saveIssues(updated);
    }
    return updatedIssue;
  },

  updateStatus(issueId: string, status: IssueStatus): boolean {
    const issues = this.getIssues();
    const updated = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return issue;
    });
    this.saveIssues(updated);
    return true;
  },

  assignIssue(issueId: string, assigneeId: string | undefined): boolean {
    const issues = this.getIssues();
    const updated = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          assigneeId,
          updatedAt: new Date().toISOString(),
        };
      }
      return issue;
    });
    this.saveIssues(updated);
    return true;
  },

  addComment(issueId: string, content: string): boolean {
    if (!content.trim()) return false;
    const issues = this.getIssues();
    const currentUser = this.getCurrentUser();
    const now = new Date().toISOString();

    const updated = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          updatedAt: now,
          comments: [
            ...issue.comments,
            {
              id: `c-${Date.now()}`,
              authorId: currentUser.id,
              content: content.trim(),
              createdAt: now,
            },
          ],
        };
      }
      return issue;
    });

    this.saveIssues(updated);
    return true;
  },

  deleteIssue(issueId: string): boolean {
    const issues = this.getIssues();
    const filtered = issues.filter(i => i.id !== issueId);
    this.saveIssues(filtered);
    return true;
  },

  toggleSubtask(issueId: string, subtaskId: string): boolean {
    const issues = this.getIssues();
    const updated = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          subtasks: issue.subtasks.map(s => 
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return issue;
    });
    this.saveIssues(updated);
    return true;
  },

  addSubtask(issueId: string, title: string): boolean {
    if (!title.trim()) return false;
    const issues = this.getIssues();
    const updated = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          subtasks: [
            ...issue.subtasks,
            { id: `sub-${Date.now()}`, title: title.trim(), completed: false },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return issue;
    });
    this.saveIssues(updated);
    return true;
  },

  // Metrics and Reporting summaries
  getDashboardMetrics(): {
    total: number;
    pending: number; // OPEN + IN_PROGRESS
    resolved: number; // RESOLVED + CLOSED
    critical: number;
    openCount: number;
    inProgressCount: number;
    resolvedCount: number;
    closedCount: number;
  } {
    const issues = this.getIssues();
    const openCount = issues.filter(i => i.status === 'OPEN').length;
    const inProgressCount = issues.filter(i => i.status === 'IN_PROGRESS').length;
    const resolvedCount = issues.filter(i => i.status === 'RESOLVED').length;
    const closedCount = issues.filter(i => i.status === 'CLOSED').length;
    const critical = issues.filter(i => i.priority === 'CRITICAL' && (i.status === 'OPEN' || i.status === 'IN_PROGRESS')).length;

    return {
      total: issues.length,
      pending: openCount + inProgressCount,
      resolved: resolvedCount + closedCount,
      critical,
      openCount,
      inProgressCount,
      resolvedCount,
      closedCount,
    };
  },

  getDeveloperReport(): Array<{
    user: User;
    totalAssigned: number;
    pendingCount: number;
    resolvedCount: number;
    criticalCount: number;
    completionRate: number;
  }> {
    const issues = this.getIssues();
    const users = this.getUsers().filter(u => u.role === 'DEVELOPER' || u.role === 'PROJECT_LEAD' || u.role === 'ADMIN');

    return users.map(user => {
      const assigned = issues.filter(i => i.assigneeId === user.id);
      const pendingCount = assigned.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length;
      const resolvedCount = assigned.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
      const criticalCount = assigned.filter(i => i.priority === 'CRITICAL' && (i.status === 'OPEN' || i.status === 'IN_PROGRESS')).length;
      const completionRate = assigned.length > 0 ? Math.round((resolvedCount / assigned.length) * 100) : 0;

      return {
        user,
        totalAssigned: assigned.length,
        pendingCount,
        resolvedCount,
        criticalCount,
        completionRate,
      };
    });
  },

  getStatusReport(): Array<{
    status: IssueStatus;
    label: string;
    count: number;
    percentage: number;
    color: string;
  }> {
    const issues = this.getIssues();
    const total = issues.length || 1;
    const statuses: IssueStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

    return statuses.map(status => {
      const count = issues.filter(i => i.status === status).length;
      const percentage = Math.round((count / total) * 100);
      return {
        status,
        label: STATUS_CONFIG[status].label,
        count,
        percentage,
        color: status === 'OPEN' ? '#2563EB' : status === 'IN_PROGRESS' ? '#D97706' : status === 'RESOLVED' ? '#16A34A' : '#64748B',
      };
    });
  },

  getPriorityReport(): Array<{
    priority: Priority;
    label: string;
    count: number;
    percentage: number;
    color: string;
  }> {
    const issues = this.getIssues();
    const total = issues.length || 1;
    const priorities: Priority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

    return priorities.map(priority => {
      const count = issues.filter(i => i.priority === priority).length;
      const percentage = Math.round((count / total) * 100);
      return {
        priority,
        label: PRIORITY_CONFIG[priority].label,
        count,
        percentage,
        color: PRIORITY_CONFIG[priority].dotColor,
      };
    });
  },
};
