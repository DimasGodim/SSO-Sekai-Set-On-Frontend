'use client';
import React, { memo } from 'react';
import { Key } from 'lucide-react';

interface CreateApiKeyModalProps {
  keyForm: { title: string; description: string };
  setKeyForm: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
  onCreate: () => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

const CreateApiKeyModal = memo<CreateApiKeyModalProps>(({ 
  keyForm, 
  setKeyForm, 
  onCreate, 
  onClose, 
  loading 
}) => {
  const handleClose = () => {
    onClose();
    setKeyForm({ title: '', description: '' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-md space-y-4">
        <h3 className="text-xl text-white font-bold flex items-center space-x-2">
          <Key className="w-5 h-5 text-blue-400" />
          <span>Create New API Key</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter API key title"
              value={keyForm.title}
              onChange={(e) => setKeyForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400 placeholder-white/40"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Description <span className="text-white/40">(optional)</span>
            </label>
            <textarea
              placeholder="Enter description for this API key"
              value={keyForm.description}
              onChange={(e) => setKeyForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400 placeholder-white/40 resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors flex items-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Key className="w-4 h-4" />
            <span>{loading ? 'Creating...' : 'Create Key'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

CreateApiKeyModal.displayName = 'CreateApiKeyModal';

export default CreateApiKeyModal;
