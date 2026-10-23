import React, { useState } from 'react';
import { Issue, IssueStatus, Priority, User } from '../../types/jira';
import { StorageService, PRIORITY_CONFIG, STATUS_CONFIG } from '../../services/storage';
import { TypeIcon } from '../common/TypeIcon';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { UserAvatar } from '../common/UserAvatar';
import { 
  X, 
  Trash2, 
  CheckSquare, 
  Plus, 
  MessageSquare, 
  Send, 
  Clock, 
  Calendar,
  AlertOctagon,
  UserCheck
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  users: User[];
  currentUser: User;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  isOpen,
  onClose,
  onUpdate,
  users,
  currentUser,
}) => {
  if (!isOpen || !issue) return null;

  const [commentText, setCommentText] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(issue.title);
  const [descriptionValue, setDescriptionValue] = useState(issue.description);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const assignee = users.find(u => u.id === issue.assigneeId);
  const reporter = users.find(u => u.id === issue.reporterId) || users[0];
  const developers = users.filter(u => u.role === 'DEVELOPER' || u.role === 'PROJECT_LEAD' || u.role === 'ADMIN');

  const handleStatusChange = (newStatus: IssueStatus) => {
    StorageService.updateStatus(issue.id, newStatus);
    onUpdate();
  };

  const handlePriorityChange = (newPriority: Priority) => {
    StorageService.updateIssue(issue.id, { priority: newPriority });
    onUpdate();
  };

  const handleAssigneeChange = (newAssigneeId: string) => {
    StorageService.assignIssue(issue.id, newAssigneeId || undefined);
    onUpdate();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    StorageService.addComment(issue.id, commentText);
    setCommentText('');
    onUpdate();
  };

  const handleToggleSubtask = (subtaskId: string) => {
    StorageService.toggleSubtask(issue.id, subtaskId);
    onUpdate();
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    StorageService.addSubtask(issue.id, newSubtaskTitle);
    setNewSubtaskTitle('');
    onUpdate();
  };

  const handleSaveTitle = () => {
    if (titleValue.trim()) {
      StorageService.updateIssue(issue.id, { title: titleValue.trim() });
      setIsEditingTitle(false);
      onUpdate();
    }
  };

  const handleSaveDescription = () => {
    StorageService.updateIssue(issue.id, { description: descriptionValue.trim() });
    setIsEditingDesc(false);
    onUpdate();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${issue.key}?`)) {
      StorageService.deleteIssue(issue.id);
      onClose();
      onUpdate();
    }
  };

  const canDelete = currentUser.role === 'ADMIN' || currentUser.role === 'PROJECT_LEAD';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFC] shrink-0">
          <div className="flex items-center gap-3">
            <TypeIcon type={issue.issueType} showLabel />
            <span className="text-slate-300">/</span>
            <span className="font-mono font-bold text-sm text-slate-800">{issue.key}</span>
          </div>

          <div className="flex items-center gap-2">
            {canDelete && (
              <button
                onClick={handleDelete}
                title="Delete Issue"
                className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Details (2/3) + Right Metadata (1/3) */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Main Discussion & Description Panel */}
          <div className="flex-1 p-6 space-y-6">
            {/* Title Section */}
            <div>
              {isEditingTitle ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    className="w-full px-3 py-2 text-base font-bold text-slate-900 border border-blue-500 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveTitle}
                      className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setTitleValue(issue.title);
                        setIsEditingTitle(false);
                      }}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-lg font-bold text-slate-900 hover:bg-slate-50 p-1.5 -m-1.5 rounded cursor-pointer leading-snug transition-colors"
                  title="Click to edit summary"
                >
                  {issue.title}
                </h1>
              )}
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</span>
              {isEditingDesc ? (
                <div className="space-y-2">
                  <textarea
                    rows={5}
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    className="w-full p-3 text-xs text-slate-800 border border-blue-500 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveDescription}
                      className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setDescriptionValue(issue.description);
                        setIsEditingDesc(false);
                      }}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDesc(true)}
                  className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 hover:bg-slate-50 border border-slate-200/60 p-3 rounded-md cursor-pointer whitespace-pre-wrap transition-colors min-h-[70px]"
                  title="Click to edit description"
                >
                  {issue.description || <span className="text-slate-400 italic">No description provided. Click to add details...</span>}
                </div>
              )}
            </div>

            {/* Subtasks Checklist */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-slate-600" />
                  <span>Subtask Checklist ({issue.subtasks.filter(s => s.completed).length}/{issue.subtasks.length})</span>
                </span>
              </div>

              {/* Progress bar */}
              {issue.subtasks.length > 0 && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{
                      width: `${(issue.subtasks.filter(s => s.completed).length / issue.subtasks.length) * 100}%`,
                    }}
                  />
                </div>
              )}

              {/* Subtask list */}
              <div className="space-y-1.5">
                {issue.subtasks.map(subtask => (
                  <label
                    key={subtask.id}
                    className="flex items-center gap-2.5 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                    />
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {subtask.title}
                    </span>
                  </label>
                ))}
              </div>

              {/* Add Subtask Form */}
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a new checklist step..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  Add Step
                </button>
              </form>
            </div>

            {/* Comments Discussion Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Discussion Panel ({issue.comments.length})
                </span>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-3">
                <UserAvatar user={currentUser} size="sm" />
                <div className="flex-1 space-y-2">
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a technical note or status update..."
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md disabled:opacity-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Comment Thread */}
              <div className="space-y-3 pt-2">
                {issue.comments.map(c => {
                  const author = users.find(u => u.id === c.authorId) || {
                    id: c.authorId,
                    fullName: 'Team Member',
                    username: 'user',
                    role: 'DEVELOPER' as const,
                    avatarUrl: '',
                    initials: 'TM',
                    email: '',
                  };

                  return (
                    <div key={c.id} className="flex gap-3 p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
                      <UserAvatar user={author} size="sm" />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{author.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({author.role})</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed mt-1">{c.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Attributes (1/3) */}
          <div className="w-full lg:w-80 bg-[#FAFBFC] p-6 space-y-5 text-xs">
            {/* Status Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={issue.status}
                onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="space-y-1">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Priority[]).map(pri => {
                  const cfg = PRIORITY_CONFIG[pri];
                  const isSelected = issue.priority === pri;
                  return (
                    <button
                      key={pri}
                      onClick={() => handlePriorityChange(pri)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? `${cfg.badge} border-current shadow-xs`
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                        <span>{cfg.label}</span>
                      </div>
                      {isSelected && <span className="text-[10px] font-mono">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Developer Assignment */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Assigned Developer
              </label>
              <select
                value={issue.assigneeId || ''}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-800 outline-none focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value="">Unassigned</option>
                {developers.map(dev => (
                  <option key={dev.id} value={dev.id}>
                    {dev.fullName} ({dev.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Reporter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Reporter
              </label>
              <div className="bg-white p-2.5 rounded-md border border-slate-200 flex items-center gap-2">
                <UserAvatar user={reporter} size="sm" />
                <div>
                  <p className="font-semibold text-slate-900 leading-tight">{reporter.fullName}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{reporter.role}</p>
                </div>
              </div>
            </div>

            {/* Story Points */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Story Points
              </label>
              <div className="font-mono font-bold text-sm text-slate-800 bg-white p-2 rounded-md border border-slate-200 tabular-nums">
                {issue.storyPoints || 3} Points
              </div>
            </div>

            {/* Timestamps */}
            <div className="pt-3 border-t border-slate-200 space-y-1 text-[11px] text-slate-500 font-mono">
              <div className="flex items-center justify-between">
                <span>Created:</span>
                <span className="tabular-nums">{new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Updated:</span>
                <span className="tabular-nums">{new Date(issue.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
