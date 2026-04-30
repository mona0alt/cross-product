import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function AdminCard({ children, className = '', delay = 0, hover = true }: AdminCardProps) {
  const delayClass = delay > 0 && delay <= 8 ? `admin-stagger-${delay}` : '';
  const hoverClass = hover
    ? 'transition-all duration-300 hover:-translate-y-0.5 hover:border-admin-border-strong'
    : '';

  return (
    <div
      className={`rounded-xl border border-admin-border bg-admin-surface p-6 opacity-0 animate-fade-in-up ${delayClass} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
