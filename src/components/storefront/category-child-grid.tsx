import React from 'react';

import { HomepageCategoryCard } from '@/components/storefront/homepage-category-card';
import { HomepageCategoryCarousel } from '@/components/storefront/homepage-category-carousel';
import type { StorefrontCategory } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function CategoryChildGrid({
  locale,
  categories
}: {
  locale: Locale;
  categories: StorefrontCategory[];
}) {
  if (categories.length === 0) {
    return null;
  }

  if (categories.length > 4) {
    return <HomepageCategoryCarousel locale={locale} categories={categories} />;
  }

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {categories.map((category) => (
        <HomepageCategoryCard
          key={category.id}
          locale={locale}
          category={category}
        />
      ))}
    </div>
  );
}
