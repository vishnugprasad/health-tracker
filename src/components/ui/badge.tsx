import React from 'react';

export function Badge({ children, className }: React.PropsWithChildren<{ className?: string; variant?: string }>) {
  return <span className={className}>{children}</span>;
} 