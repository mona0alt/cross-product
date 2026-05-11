/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { StorefrontCategory } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function HomepageCategoryGrid({
  locale,
  title,
  categories
}: {
  locale: Locale;
  title: string;
  categories: StorefrontCategory[];
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mk-container">
        <h2 className="text-center text-2xl font-bold text-[var(--mk-text)]">
          {title}
        </h2>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[var(--mk-accent)]" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/products?category=${category.slug}`}
              className="group rounded-xl border border-[var(--mk-border)] bg-white p-3 shadow-[0_14px_36px_rgba(29,126,234,0.07)] transition hover:-translate-y-1 hover:border-[var(--mk-border-strong)]"
            >
              {category.iconImageUrl ? (
                <img
                  src={category.iconImageUrl}
                  alt={category.name}
                  className="aspect-[4/3] w-full rounded-lg bg-[var(--mk-bg-muted)] object-cover"
                />
              ) : (
                <div className="aspect-[4/3] w-full rounded-lg bg-[var(--mk-bg-muted)]" />
              )}
              <h3 className="mt-3 text-center text-base font-semibold text-[var(--mk-text)]">
                {category.name}
              </h3>
              {category.description ? (
                <p className="mt-1 line-clamp-2 text-center text-xs text-[var(--mk-text-muted)]">
                  {category.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
