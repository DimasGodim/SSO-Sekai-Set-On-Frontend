'use client';
import React, { memo } from 'react';
import { CheckCircle, AlertCircle, Copy } from 'lucide-react';

interface GeneratedKeyModalProps {
  generatedKey: string;
  copiedKey: boolean;
  onCopyKey: () => void;
  onClose: () => void;
}

const GeneratedKeyModal = memo<GeneratedKeyModalProps>(({ 
  generatedKey, 
  copiedKey, 
  onCopyKey, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-lg space-y-4">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl text-white font-bold">API Key Created Successfully!</h3>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">Important Security Notice:</p>
              <p>This is the only time you will be able to see this API key. Please copy it now and store it securely. Once you close this dialog, the key cannot be retrieved again.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-white/80 text-sm font-medium">
            Your API Key:
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={generatedKey}
              readOnly
              className="w-full px-3 py-3 bg-black/30 text-white border border-white/20 rounded font-mono text-sm pr-12 select-all focus:outline-none focus:border-blue-400" 
            />
            <button
              onClick={onCopyKey}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copiedKey && (
            <div className="text-green-400 text-sm font-semibold mt-2">Copied!</div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button 
            onClick={onCopyKey}
            className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:border-blue-400 rounded transition-colors flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Key</span>
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded transition-colors"
          >
            I Saved It
          </button>
        </div>
      </div>
    </div>
  );
});

GeneratedKeyModal.displayName = 'GeneratedKeyModal';

export default GeneratedKeyModal;
