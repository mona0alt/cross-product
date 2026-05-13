'use client';

import React from 'react';

import type { ProductListSort } from '@/features/catalog/types';

type ResultsToolbarProps = {
  eyebrow: string;
  title: string;
  description?: string;
  activeSummary?: string;
  sort?: ProductListSort;
  sortLabel?: string;
  sortOptions?: Array<{
    value: ProductListSort;
    label: string;
  }>;
};

export function ResultsToolbar({
  eyebrow,
  title,
  description,
  activeSummary,
  sort,
  sortLabel,
  sortOptions
}: ResultsToolbarProps) {
  const showSortControl = Boolean(sort && sortLabel && sortOptions?.length);

  return (
    <section className="rounded-[24px] border border-[#d8cec7] bg-white/82 px-5 py-6 shadow-[0_18px_48px_rgba(32,26,25,0.08)] backdrop-blur sm:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="storefront-eyebrow">{eyebrow}</p>
          <h1 className="mk-display-font text-3xl font-semibold text-[var(--mk-accent)] sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-sm leading-7 text-[var(--store-text-muted)]">
              {description}
            </p>
          ) : null}
          {activeSummary ? (
            <p className="mt-4 text-sm font-medium text-[var(--store-text)]">
              {activeSummary}
            </p>
          ) : null}
        </div>

        {showSortControl ? (
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--store-text)]">
            <span>{sortLabel}</span>
            <select
              name="sort"
              aria-label={sortLabel}
              defaultValue={sort}
              onChange={(event) => event.currentTarget.form?.requestSubmit()}
              className="min-w-[220px] rounded-2xl border border-[var(--store-border)] bg-[var(--store-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--store-text)] outline-none transition focus:border-[var(--store-accent)]"
            >
              {sortOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </section>
  );
}
