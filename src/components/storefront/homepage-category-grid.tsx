/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { StorefrontCategory } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

function getSeriesCardLayout(index: number, total: number) {
  if (index === 0) {
    return 'sm:col-span-2 lg:col-span-2 lg:row-span-2';
  }

  if (total > 2 && index === 1) {
    return 'lg:col-span-2';
  }

  return '';
}

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

  const visibleCategories = categories.slice(0, 4);

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--mk-text)]">
            {title}
          </h2>
          <div className="mt-3 h-1 w-12 rounded-full bg-[var(--mk-accent)]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]">
          {visibleCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/${locale}/products?category=${category.slug}`}
              className={`group relative min-h-[260px] overflow-hidden rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_16px_38px_rgba(29,126,234,0.08)] sm:min-h-[320px] lg:min-h-0 ${getSeriesCardLayout(index, visibleCategories.length)}`}
            >
              {category.iconImageUrl ? (
                <img
                  src={category.iconImageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-[var(--mk-bg-muted)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061b38]/84 via-[#0f63ce]/14 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                {category.description ? (
                  <p className="line-clamp-2 text-xs font-semibold leading-5 text-[#bfe1ff]">
                    {category.description}
                  </p>
                ) : null}
                <h3 className="mt-1 text-sm font-bold">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
