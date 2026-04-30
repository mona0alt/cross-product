/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';
import type { StorefrontProductCard } from '@/features/catalog/types';

function formatPrice(priceUsd: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(priceUsd);
}

export function ProductCard({
  locale,
  product,
  ctaLabel,
  stockLabel,
  discountBadgeTemplate,
  discountPercent
}: {
  locale: Locale;
  product: StorefrontProductCard;
  ctaLabel: string;
  stockLabel: string;
  discountBadgeTemplate?: string;
  discountPercent?: number;
}) {
  const discountBadgeLabel =
    discountPercent && discountBadgeTemplate
      ? discountBadgeTemplate.replace('{percent}', String(discountPercent))
      : null;

  return (
    <article className="group flex w-[200px] flex-col sm:w-[220px]">
      {/* Image */}
      <div className="relative overflow-hidden rounded-md border border-[var(--mk-border)] bg-white">
        <img
          src={product.coverImageUrl}
          alt={product.name}
          className="h-[200px] w-full object-cover transition duration-300 group-hover:scale-105 sm:h-[220px]"
        />
        {discountBadgeLabel ? (
          <span className="absolute left-2 top-2 rounded-sm bg-[var(--mk-highlight)] px-2 py-1 text-xs font-bold text-white">
            {discountBadgeLabel}
          </span>
        ) : null}
      </div>

      {/* Info */}
      <div className="mt-2 flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-medium leading-snug text-black line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-[var(--mk-text-muted)]">{product.productCode}</p>
        <p className="text-xs text-[var(--mk-text-muted)]">{product.category?.name}</p>

        <div className="mt-1 flex items-baseline gap-2">
          {discountPercent ? (
            <>
              <span className="text-lg font-bold text-black">
                {formatPrice(product.priceUsd)}
              </span>
              <span className="text-sm text-[var(--mk-text-muted)] line-through">
                {formatPrice(Math.round(product.priceUsd * (1 + discountPercent / 100)))}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-black">
              {formatPrice(product.priceUsd)}
            </span>
          )}
        </div>

        <p className="text-xs text-[var(--mk-success)]">{stockLabel}</p>

        <Link
          href={`/${locale}/products/${product.slug}`}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-black px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[var(--mk-highlight)]"
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
