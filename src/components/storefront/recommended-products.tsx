import React from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { StorefrontProductCard } from '@/features/catalog/types';
import { ProductCard } from '@/components/storefront/product-card';
import { SectionShell } from '@/components/storefront/section-shell';

export function RecommendedProducts({
  locale,
  products,
  title,
  emptyLabel,
  ctaLabel,
  stockLabel
}: {
  locale: Locale;
  products: StorefrontProductCard[];
  title: string;
  emptyLabel: string;
  ctaLabel: string;
  stockLabel: string;
}) {
  return (
    <SectionShell title={title}>
      {products.length === 0 ? (
        <p className="storefront-surface rounded-[var(--store-radius-lg)] p-6 text-sm text-[var(--store-text-muted)]">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              locale={locale}
              product={product}
              ctaLabel={ctaLabel}
              stockLabel={stockLabel}
            />
          ))}
        </div>
      )}
    </SectionShell>
  );
}
