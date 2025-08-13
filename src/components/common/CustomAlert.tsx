import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export function CustomAlert({ 
  isOpen, 
  onClose, 
  message, 
  type = 'info',
  title 
}: CustomAlertProps) {
  if (!isOpen) return null;
  
  const typeConfig = {
    info: {
      icon: Info,
      colors: 'text-blue-400 border-blue-400 bg-blue-500/10',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
    },
    success: {
      icon: CheckCircle,
      colors: 'text-green-400 border-green-400 bg-green-500/10',
      buttonColor: 'bg-green-500 hover:bg-green-600',
    },
    warning: {
      icon: AlertCircle,
      colors: 'text-yellow-400 border-yellow-400 bg-yellow-500/10',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
    },
    error: {
      icon: XCircle,
      colors: 'text-red-400 border-red-400 bg-red-500/10',
      buttonColor: 'bg-red-500 hover:bg-red-600',
    },
  };
  
  const config = typeConfig[type];
  const Icon = config.icon;
  const defaultTitle = title || type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className={`border p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4 text-center ${config.colors}`}>
        <div className="flex items-center justify-center mb-2">
          <Icon className="w-8 h-8 mr-2" />
          <div className="text-2xl font-bold">{defaultTitle}</div>
        </div>
        
        <div className="text-white text-base">{message}</div>
        
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 text-white rounded transition-colors ${config.buttonColor}`}
        >
          OK
        </button>
      </div>
    </div>
  );
}

// Hook for managing alert state
export function useAlert() {
  const [alert, setAlert] = React.useState<{
    isOpen: boolean;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title?: string;
  }>({
    isOpen: false,
    message: '',
    type: 'info',
  });
  
  const showAlert = React.useCallback((
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    title?: string
  ) => {
    setAlert({ isOpen: true, message, type, title });
  }, []);
  
  const hideAlert = React.useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);
  
  return {
    alert,
    showAlert,
    hideAlert,
  };
}
