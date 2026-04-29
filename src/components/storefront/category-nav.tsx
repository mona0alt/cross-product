import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';
import type { StorefrontCategory } from '@/features/catalog/types';

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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/categories/${category.slug}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
