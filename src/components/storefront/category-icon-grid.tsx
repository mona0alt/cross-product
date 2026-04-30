/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';
import type { StorefrontCategory } from '@/features/catalog/types';
import { SectionShell } from '@/components/storefront/section-shell';

export function CategoryIconGrid({
  locale,
  categories,
  title
}: {
  locale: Locale;
  categories: StorefrontCategory[];
  title: string;
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <SectionShell title={title}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/categories/${category.slug}`}
            className="storefront-surface flex h-full flex-col rounded-[var(--store-radius-lg)] p-5 transition hover:-translate-y-1 hover:border-[var(--store-border-strong)]"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.15rem] bg-[var(--store-surface-muted)]">
              {category.iconImageUrl ? (
                <img
                  src={category.iconImageUrl}
                  alt=""
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="text-lg text-[var(--store-text-muted)]">#</span>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--store-text)]">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--store-text-muted)]">
                  {category.description}
                </p>
              </div>
              <span className="h-1.5 w-14 rounded-full bg-[var(--store-accent)]" />
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
