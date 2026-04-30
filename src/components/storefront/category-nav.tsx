import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';
import type { StorefrontCategory } from '@/features/catalog/types';
import { SectionShell } from '@/components/storefront/section-shell';

export function CategoryNav({
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
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/categories/${category.slug}`}
            className="storefront-surface-muted rounded-[1.25rem] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[var(--store-border-strong)] hover:bg-white"
          >
            <h3 className="text-lg font-bold text-[var(--store-text)]">
              {category.name}
            </h3>
            <p className="mt-2 text-sm text-[var(--store-text-muted)]">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
