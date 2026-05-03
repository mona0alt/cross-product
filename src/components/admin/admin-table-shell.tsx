import React from 'react';

export function AdminTableShell({
  title,
  description,
  toolbar,
  children
}: {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 border-b border-admin-border px-6 py-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">Data View</p>
          <h3 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 text-sm leading-7 text-admin-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
        {toolbar ? <div className="flex flex-wrap gap-2">{toolbar}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}
