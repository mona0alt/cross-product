import React from 'react';

type ResultsToolbarProps = {
  eyebrow: string;
  title: string;
  description: string;
  activeSummary?: string;
  sortLabel: string;
};

export function ResultsToolbar({
  eyebrow,
  title,
  description,
  activeSummary,
  sortLabel
}: ResultsToolbarProps) {
  return (
    <section className="storefront-surface rounded-[var(--store-radius-lg)] px-5 py-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="storefront-eyebrow">{eyebrow}</p>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-[var(--store-text)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--store-text-muted)]">
            {description}
          </p>
          {activeSummary ? (
            <p className="mt-4 text-sm font-medium text-[var(--store-text)]">
              {activeSummary}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[var(--store-border)] bg-[var(--store-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--store-text)]">
          {sortLabel}
        </div>
      </div>
    </section>
  );
}
