'use client';
import React, { memo } from 'react';

interface EditProfileModalProps {
  editForm: { name: string; nickname: string };
  setEditForm: React.Dispatch<React.SetStateAction<{ name: string; nickname: string }>>;
  onEdit: () => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

const EditProfileModal = memo<EditProfileModalProps>(({ 
  editForm, 
  setEditForm, 
  onEdit, 
  onClose, 
  loading 
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4">
        <h3 className="text-xl text-white font-bold">Edit Account</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={editForm.name}
          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
          className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Nickname"
          value={editForm.nickname}
          onChange={e => setEditForm(f => ({ ...f, nickname: e.target.value }))}
          className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400"
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
            onClick={onEdit} 
            disabled={loading} 
            className={`px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
});

EditProfileModal.displayName = 'EditProfileModal';

export default EditProfileModal;
