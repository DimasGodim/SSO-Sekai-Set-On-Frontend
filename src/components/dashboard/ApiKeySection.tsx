import React from 'react';
import { Key, Trash2, FileText, CalendarClock } from 'lucide-react';
import type { ApiKey } from '../../lib/types';
import { STYLES } from '../../lib/constants';

interface ApiKeySectionProps {
  apiKeys: ApiKey[];
  onCreateKey: () => void;
  onDeleteKey: (identifier: string) => void;
  deleteKeyLoading: string | null;
}

export function ApiKeySection({
  apiKeys,
  onCreateKey,
  onDeleteKey,
  deleteKeyLoading,
}: ApiKeySectionProps) {
  return (
    <div className={STYLES.CARD_BASE}>
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="flex items-center space-x-2 text-white text-lg font-semibold">
            <Key className="w-5 h-5" />
            <span>API Keys</span>
          </h3>
          
          <button
            onClick={onCreateKey}
            className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center space-x-2"
          >
            <Key className="w-4 h-4" />
            <span>Create New Key</span>
          </button>
        </div>
        
        <p className="text-white/60 text-sm mt-1">
          List of your generated API keys. You must generate them manually.
        </p>
      </div>
      
      <div className="p-6 pt-2">
        {apiKeys.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiKeys.map((key) => (
              <ApiKeyCard
                key={key.identifier}
                apiKey={key}
                onDelete={() => onDeleteKey(key.identifier)}
                isDeleting={deleteKeyLoading === key.identifier}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/60 mt-4 text-center">
            You have no API keys. Generate one to get started.
          </p>
        )}
      </div>
    </div>
  );
}

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onDelete: () => void;
  isDeleting: boolean;
}

function ApiKeyCard({ apiKey, onDelete, isDeleting }: ApiKeyCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 space-y-3 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="text-white font-medium text-lg flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>{apiKey.title}</span>
        </div>
        
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className={`p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isDeleting ? (
            <span className="text-xs">Loading...</span>
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <div className="text-sm text-white/60 flex items-center space-x-2">
        <CalendarClock className="w-4 h-4" />
        <span>
          Created: {apiKey.created_at?.slice(0, 16).replace('T', ' ') || 'Unknown'}
        </span>
      </div>
      
      {apiKey.detail && (
        <div className="space-y-2">
          <p className="text-sm text-white/70">{apiKey.detail}</p>
        </div>
      )}
    </div>
  );
}
