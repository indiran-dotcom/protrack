export type Role = 'ADMIN' | 'DEVELOPER' | 'TESTER' | 'PROJECT_LEAD';

export type IssueType = 'BUG' | 'TASK' | 'STORY' | 'IMPROVEMENT';

export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl: string;
  initials: string;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Issue {
  id: string;
  key: string; // e.g. PRO-101
  projectId: string;
  title: string;
  description: string;
  issueType: IssueType;
  status: IssueStatus;
  priority: Priority;
  storyPoints?: number;
  assigneeId?: string; // Developer assigned
  reporterId: string;
  labels: string[];
  comments: Comment[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  leadId: string;
  category: string;
}

export type ActiveTab = 
  | 'landing'
  | 'board' 
  | 'issues-list' 
  | 'dashboard' 
  | 'reports' 
  | 'backend-code' 
  | 'database-schema' 
  | 'api-docs' 
  | 'local-setup';
