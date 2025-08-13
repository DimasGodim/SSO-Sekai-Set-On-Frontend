'use client';
import React, { memo } from 'react';

interface DeleteApiKeyModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const DeleteApiKeyModal = memo<DeleteApiKeyModalProps>(({ 
  onConfirm, 
  onCancel, 
  loading 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4 text-center">
        <div className="text-red-400 text-2xl font-bold mb-2">Delete API Key</div>
        <div className="text-white text-base mb-2">
          Are you sure you want to delete this API key? This action cannot be undone.
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteApiKeyModal.displayName = 'DeleteApiKeyModal';

export default DeleteApiKeyModal;
