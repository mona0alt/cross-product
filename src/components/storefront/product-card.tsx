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
    <article className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)]">
      <img
        src={product.coverImageUrl}
        alt={product.name}
        className="h-56 w-full object-cover"
      />
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-950">
              {product.name}
            </h3>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
              {formatPrice(product.priceUsd)}
            </span>
          </div>
          <p className="text-sm text-slate-500">{product.productCode}</p>
          <p className="text-sm leading-6 text-slate-600">{product.intro}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
            {product.category?.name}
          </span>
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
