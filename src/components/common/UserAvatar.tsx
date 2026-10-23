import React from 'react';
import { User } from '../../types/jira';

interface UserAvatarProps {
  user?: User;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'sm', showName = false }) => {
  if (!user) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
        <span className="w-6 h-6 rounded-full bg-slate-200 border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-600 font-medium">
          ?
        </span>
        {showName && <span>Unassigned</span>}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }[size];

  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          referrerPolicy="no-referrer"
          className={`${sizeClasses} rounded-full object-cover border border-slate-200 shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full bg-blue-600 text-white font-medium flex items-center justify-center uppercase shadow-xs`}
          title={`${user.fullName} (${user.role})`}
        >
          {user.initials}
        </div>
      )}
      {showName && (
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-900 leading-tight">{user.fullName}</span>
          <span className="text-[10px] text-slate-500 leading-tight">{user.role}</span>
        </div>
      )}
    </div>
  );
};
