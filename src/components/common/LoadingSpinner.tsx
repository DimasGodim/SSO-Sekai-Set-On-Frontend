import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'yellow' | 'white' | 'green';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  text, 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };
  
  const colorClasses = {
    blue: 'border-blue-400',
    yellow: 'border-yellow-400',
    white: 'border-white',
    green: 'border-green-400',
  };
  
  const textColorClasses = {
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    white: 'text-white',
    green: 'text-green-400',
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-4 border-solid ${sizeClasses[size]} ${colorClasses[color]} mb-4`}
      />
      {text && (
        <span className={`text-lg font-semibold ${textColorClasses[color]}`}>
          {text}
        </span>
      )}
    </div>
  );
}

interface LoadingOverlayProps extends LoadingSpinnerProps {
  isVisible: boolean;
  backdrop?: boolean;
}

export function LoadingOverlay({ 
  isVisible, 
  backdrop = true, 
  text = 'Loading...', 
  ...spinnerProps 
}: LoadingOverlayProps) {
  if (!isVisible) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      backdrop ? 'bg-black/60' : ''
    }`}>
      <LoadingSpinner text={text} {...spinnerProps} />
    </div>
  );
}
