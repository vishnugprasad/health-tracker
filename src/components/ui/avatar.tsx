import React from 'react';

export function Avatar({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>;
}

export function AvatarImage({ src, alt }: { src: string; alt?: string }) {
  return <img src={src} alt={alt} className="object-cover w-full h-full rounded-full" />;
}

export function AvatarFallback({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>;
} 