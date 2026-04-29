/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';
import type { StorefrontCategory } from '@/features/catalog/types';

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
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/categories/${category.slug}`}
            className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
              {category.iconImageUrl ? (
                <img
                  src={category.iconImageUrl}
                  alt=""
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="text-lg text-slate-400">#</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-950">
              {category.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
