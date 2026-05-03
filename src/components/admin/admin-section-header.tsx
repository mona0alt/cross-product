import React from 'react';

interface AdminSectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminSectionHeader({ label, title, description, action }: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-admin-border bg-admin-surface px-6 py-6 opacity-0 shadow-[0_14px_40px_rgba(15,23,42,0.04)] animate-fade-in-up xl:flex-row xl:items-end xl:justify-between">
      <div>
        {label ? <p className="admin-kicker">{label}</p> : null}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-admin-text-primary font-display">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-admin-text-secondary font-body">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}
