import React from 'react';

export function Tabs({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={className} {...props}>{children}</div>;
}

export function TabsList({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={className} {...props}>{children}</div>;
}

export function TabsTrigger({ children, className, onClick, value }: React.PropsWithChildren<{ className?: string; onClick?: () => void; value?: string }>) {
  return <button className={className} onClick={onClick} data-value={value}>{children}</button>;
} 