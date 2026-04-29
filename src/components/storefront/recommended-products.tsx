import React from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { StorefrontProductCard } from '@/features/catalog/types';
import { ProductCard } from '@/components/storefront/product-card';

export function RecommendedProducts({
  locale,
  products,
  title,
  emptyLabel,
  ctaLabel
}: {
  locale: Locale;
  products: StorefrontProductCard[];
  title: string;
  emptyLabel: string;
  ctaLabel: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      {products.length === 0 ? (
        <p className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500">
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
            />
          ))}
        </div>
      )}
    </section>
  );
}
