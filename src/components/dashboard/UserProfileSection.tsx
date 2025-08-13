import React from 'react';
import { User, Pencil, LogOut, XCircle } from 'lucide-react';
import type { User as UserType } from '../../lib/types';
import { STYLES } from '../../lib/constants';

interface UserProfileSectionProps {
  userInfo: UserType | null;
  onEditProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function UserProfileSection({
  userInfo,
  onEditProfile,
  onLogout,
  onDeleteAccount,
}: UserProfileSectionProps) {
  return (
    <div className={STYLES.CARD_BASE}>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 sm:p-6 pb-2 gap-4">
        <h3 className="flex items-center space-x-2 text-white text-lg font-semibold">
          <User className="w-5 h-5" />
          <span>Account Details</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
          <button
            onClick={onEditProfile}
            className="px-3 py-2 text-sm border border-white/20 text-white/70 hover:text-white hover:border-blue-400 rounded transition-colors flex items-center justify-center sm:justify-start"
          >
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </button>
          
          <button
            onClick={onLogout}
            className="px-3 py-2 text-sm border border-yellow-500/40 text-yellow-400 hover:border-yellow-500 hover:bg-yellow-500/10 rounded transition-colors flex items-center justify-center sm:justify-start"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </button>
          
          <button
            onClick={onDeleteAccount}
            className="px-3 py-2 text-sm border border-red-500/40 text-red-400 hover:border-red-500 hover:bg-red-500/10 rounded transition-colors flex items-center justify-center sm:justify-start"
          >
            <XCircle className="w-4 h-4 mr-1" /> Delete Account
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 pt-2 text-white/80 space-y-3">
        <UserInfoRow label="Full Name" value={userInfo?.name} />
        <UserInfoRow label="Nickname" value={userInfo?.nickname} />
        <UserInfoRow label="Email" value={userInfo?.email} />
      </div>
    </div>
  );
}

interface UserInfoRowProps {
  label: string;
  value?: string;
}

function UserInfoRow({ label, value }: UserInfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
      <strong className="text-white/90 min-w-0 sm:min-w-[100px]">{label}:</strong>
      <span className="break-words">{value || 'N/A'}</span>
    </div>
  );
}
