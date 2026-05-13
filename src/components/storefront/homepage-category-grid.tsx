/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { StorefrontCategory } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function HomepageCategoryGrid({
  locale,
  eyebrow,
  title,
  categories
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  categories: StorefrontCategory[];
}) {
  if (categories.length === 0) {
    return null;
  }

  const visibleCategories = categories.slice(0, 4);

  return (
    <section className="bg-[var(--mk-bg)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--mk-highlight)]">
            {eyebrow}
          </p>
          <h2 className="mk-display-font mt-2 text-3xl font-semibold text-[var(--mk-accent)]">
            {title}
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-[var(--mk-highlight)]" />
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/products?category=${category.slug}`}
              className="group rounded-[18px] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-3 shadow-[0_18px_44px_rgba(112,89,81,0.08)] transition duration-500 hover:-translate-y-1"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[14px] bg-[var(--mk-bg-muted)]">
                {category.iconImageUrl ? (
                  <img
                    src={category.iconImageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover mix-blend-multiply transition duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-full w-full bg-[var(--mk-bg-muted)]" />
                )}
              </div>
              <h3 className="mk-display-font mt-4 text-center text-xl font-semibold text-[var(--mk-accent)]">
                {category.name}
              </h3>
              <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--mk-text-muted)]">
                {category.description ?? category.slug}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
