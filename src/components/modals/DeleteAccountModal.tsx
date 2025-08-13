'use client';
import React, { memo } from 'react';

interface DeleteAccountModalProps {
  userName: string;
  confirmText: string;
  setConfirmText: React.Dispatch<React.SetStateAction<string>>;
  onDelete: () => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

const DeleteAccountModal = memo<DeleteAccountModalProps>(({ 
  userName, 
  confirmText, 
  setConfirmText, 
  onDelete, 
  onClose, 
  loading 
}) => {
  const expectedText = `delete my account (${userName?.replace(/'/g, '&#39;')})`;
  const isConfirmValid = confirmText === expectedText;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4">
        <h3 className="text-xl text-white font-bold">Confirm Account Deletion</h3>
        <p className="text-white/60">
          Are you sure you want to delete your account? This action cannot be undone.<br />
          Please type <span className="font-bold text-red-400">{expectedText}</span> to confirm.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder={expectedText}
          className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-red-400 mt-2"
          disabled={loading}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={loading || !isConfirmValid}
            className={`px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded transition-colors ${
              loading || !isConfirmValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteAccountModal.displayName = 'DeleteAccountModal';

export default DeleteAccountModal;
