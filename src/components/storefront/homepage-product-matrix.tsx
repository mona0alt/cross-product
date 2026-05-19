import React from 'react';
import Link from 'next/link';

import { HomepageProductCard } from '@/components/storefront/homepage-product-card';
import { HomepageProductCarousel } from '@/components/storefront/homepage-product-carousel';
import type { StorefrontProductCard } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function HomepageProductMatrix({
  locale,
  eyebrow,
  title,
  viewAllLabel,
  products
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  viewAllLabel: string;
  products: StorefrontProductCard[];
}) {
  const shouldUseCarousel = products.length > 5;
  const visibleProducts = shouldUseCarousel ? products : products.slice(0, 5);

  if (visibleProducts.length === 0) {
    return null;
  }

  function getCardLayout(index: number) {
    if (index === 0) return 'md:col-span-8 md:row-span-2';
    if (index === 3) return 'md:col-span-8';
    return 'md:col-span-4';
  }

  return (
    <section className="bg-[var(--mk-bg-muted)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--mk-highlight)]">
              {eyebrow}
            </p>
            <h2 className="mk-display-font mt-2 text-3xl font-semibold text-[var(--mk-accent)]">
              {title}
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="rounded-full border border-[var(--mk-accent)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mk-accent)] transition hover:bg-[var(--mk-accent)] hover:text-white"
          >
            {viewAllLabel}
          </Link>
        </div>

        {shouldUseCarousel ? (
          <HomepageProductCarousel locale={locale} products={products} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[220px]">
            {visibleProducts.map((product, index) => (
              <HomepageProductCard
                key={product.id}
                locale={locale}
                product={product}
                className={`md:min-h-0 ${getCardLayout(index)}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
