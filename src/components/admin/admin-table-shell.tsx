import React from 'react';

export function AdminTableShell({
  title,
  description,
  kicker = 'Data View',
  compact = false,
  fullHeight = false,
  toolbar,
  children
}: {
  title: string;
  description?: string;
  kicker?: string | null;
  compact?: boolean;
  fullHeight?: boolean;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const headerClassName = compact
    ? 'flex min-h-[73px] flex-col gap-4 border-b border-admin-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between'
    : 'flex flex-col gap-4 border-b border-admin-border px-6 py-5 lg:flex-row lg:items-end lg:justify-between';
  const shellClassName = fullHeight
    ? 'flex h-full min-h-0 flex-col rounded-[24px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]'
    : 'rounded-[24px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]';

  return (
    <section className={shellClassName}>
      <div className={headerClassName}>
        <div>
          {kicker ? <p className="admin-kicker">{kicker}</p> : null}
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
      <div className={fullHeight ? 'min-h-0 flex-1' : undefined}>{children}</div>
    </section>
  );
}
