import React from 'react';

type HeroMetric = {
  label: string;
  value: string;
  detail?: string;
};

export function AdminPageHero({
  eyebrow,
  title,
  description,
  metrics,
  actions,
  status
}: {
  eyebrow: string;
  title: string;
  description: string;
  metrics: HeroMetric[];
  actions?: React.ReactNode;
  status?: React.ReactNode;
}) {
  return (
    <section className="admin-hero-grid rounded-[28px] border border-admin-border bg-admin-surface px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:px-8">
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="admin-kicker">{eyebrow}</p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-admin-text-primary font-display">
                {title}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-admin-text-secondary">
                {description}
              </p>
            </div>
            {status ? <div className="shrink-0">{status}</div> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-admin-border bg-admin-elevated/70 px-4 py-4"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-admin-text-primary font-mono">
              {metric.value}
            </p>
            {metric.detail ? (
              <p className="mt-2 text-xs leading-6 text-admin-text-secondary">
                {metric.detail}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
