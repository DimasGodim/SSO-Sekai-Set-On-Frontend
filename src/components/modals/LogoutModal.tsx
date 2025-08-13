'use client';
import React, { memo } from 'react';

interface LogoutModalProps {
  onLogout: () => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

const LogoutModal = memo<LogoutModalProps>(({ onLogout, onClose, loading }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4">
        <h3 className="text-xl text-white font-bold">Confirm Logout</h3>
        <p className="text-white/60">Do you really want to logout from your account?</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-yellow-500 text-black hover:bg-yellow-600 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
});

LogoutModal.displayName = 'LogoutModal';

export default LogoutModal;
