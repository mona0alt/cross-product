import React from 'react';

import { HomepageCategoryCard } from '@/components/storefront/homepage-category-card';
import { HomepageCategoryCarousel } from '@/components/storefront/homepage-category-carousel';
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

  const shouldUseCarousel = categories.length > 4;

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
        {shouldUseCarousel ? (
          <HomepageCategoryCarousel locale={locale} categories={categories} />
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {categories.map((category) => (
              <HomepageCategoryCard
                key={category.id}
                locale={locale}
                category={category}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
