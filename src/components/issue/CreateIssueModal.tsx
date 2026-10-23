import React, { useState } from 'react';
import { IssueType, Priority, User, IssueStatus } from '../../types/jira';
import { StorageService, PRIORITY_CONFIG } from '../../services/storage';
import { X, Check, AlertCircle } from 'lucide-react';
import { TypeIcon } from '../common/TypeIcon';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  users: User[];
  defaultStatus?: IssueStatus;
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  users,
  defaultStatus = 'OPEN',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('TASK');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [storyPoints, setStoryPoints] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Issue summary/title is required.');
      return;
    }

    try {
      const newIssue = StorageService.createIssue({
        title,
        description,
        issueType,
        priority,
        assigneeId: assigneeId || undefined,
        storyPoints,
      });

      if (defaultStatus !== 'OPEN') {
        StorageService.updateStatus(newIssue.id, defaultStatus);
      }

      onCreated();
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setIssueType('TASK');
      setPriority('MEDIUM');
      setAssigneeId('');
      setStoryPoints(3);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to create issue.');
    }
  };

  const developers = users.filter(u => u.role === 'DEVELOPER' || u.role === 'PROJECT_LEAD' || u.role === 'ADMIN');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFC]">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create Issue</h2>
            <p className="text-xs text-slate-500 mt-0.5">Project: ProTrack Enterprise System (PRO)</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Issue Type & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Issue Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Issue Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {(['BUG', 'TASK', 'STORY', 'IMPROVEMENT'] as IssueType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setIssueType(type)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                      issueType === type
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <TypeIcon type={type} />
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority (Low, Medium, High, Critical) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority Level *</label>
              <div className="grid grid-cols-2 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Priority[]).map((pri) => {
                  const cfg = PRIORITY_CONFIG[pri];
                  const isSelected = priority === pri;
                  return (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setPriority(pri)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? `${cfg.badge} border-current shadow-xs`
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dotColor }} />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Summary / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement RFC 7807 ProblemDetails error format"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, reproduction steps, technical acceptance criteria..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 transition-colors"
            />
          </div>

          {/* Assignee & Story Points Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assign Developer
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 bg-white cursor-pointer"
              >
                <option value="">Unassigned</option>
                {developers.map(dev => (
                  <option key={dev.id} value={dev.id}>
                    {dev.fullName} ({dev.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Story Points (Estimate)
              </label>
              <input
                type="number"
                min="1"
                max="34"
                value={storyPoints}
                onChange={(e) => setStoryPoints(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
