/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';
import type { StorefrontProductCard } from '@/features/catalog/types';

function formatPrice(priceUsd: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(priceUsd);
}

export function ProductCard({
  locale,
  product,
  ctaLabel
}: {
  locale: Locale;
  product: StorefrontProductCard;
  ctaLabel: string;
}) {
  return (
    <article className="storefront-surface overflow-hidden rounded-[var(--store-radius-lg)] transition hover:-translate-y-1 hover:border-[var(--store-border-strong)]">
      <div className="relative">
        <img
          src={product.coverImageUrl}
          alt={product.name}
          className="h-64 w-full object-cover"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--store-accent)]">
          {product.category?.name ?? product.productCode}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[var(--store-text)]">
              {product.name}
            </h3>
            <p className="text-sm text-[var(--store-text-muted)]">
              {product.productCode}
            </p>
          </div>
          <span className="rounded-full bg-[var(--store-accent)] px-3 py-1.5 text-xs font-semibold text-white">
            {formatPrice(product.priceUsd)}
          </span>
        </div>
        <p className="text-sm leading-6 text-[var(--store-text-muted)]">
          {product.intro}
        </p>
        <div className="flex items-center justify-between gap-3 border-t border-[var(--store-border)] pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--store-text-muted)]">
            {product.category?.name}
          </span>
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="inline-flex items-center rounded-full border border-[var(--store-border-strong)] bg-white px-4 py-2 text-sm font-semibold text-[var(--store-accent)]"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
