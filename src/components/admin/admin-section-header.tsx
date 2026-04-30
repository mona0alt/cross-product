import React from 'react';

interface AdminSectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminSectionHeader({ label, title, description, action }: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between opacity-0 animate-fade-in-up">
      <div>
        {label ? (
          <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
            {label}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-admin-text-primary font-display">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-admin-text-secondary font-body">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}
