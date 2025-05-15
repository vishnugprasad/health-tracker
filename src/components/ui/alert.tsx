import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export function Alert({ children, type = 'info', className = '' }: AlertProps) {
  const bgColor = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800',
    info: 'bg-blue-50 text-blue-800'
  }[type];

  return (
    <div className={`rounded-lg p-4 ${bgColor} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = '' }: AlertProps) {
  return (
    <h5 className={`font-bold mb-1 ${className}`}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className = '' }: AlertProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
} 