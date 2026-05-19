/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { StorefrontCategory } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function HomepageCategoryCard({
  locale,
  category,
  className
}: {
  locale: Locale;
  category: StorefrontCategory;
  className?: string;
}) {
  return (
    <Link
      href={`/${locale}/products?category=${category.slug}`}
      className={`group rounded-[18px] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-3 shadow-[0_18px_44px_rgba(112,89,81,0.08)] transition duration-500 hover:-translate-y-1 ${className ?? ''}`}
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
  );
}
