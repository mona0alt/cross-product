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
  fullWidth,
  variant = 'standard',
  discountBadgeTemplate,
  discountPercent,
  hidePrice,
  minimal
}: {
  locale: Locale;
  product: StorefrontProductCard;
  ctaLabel: string;
  stockLabel: string;
  fullWidth?: boolean;
  variant?: 'standard' | 'premiumCatalog';
  discountBadgeTemplate?: string;
  discountPercent?: number;
  hidePrice?: boolean;
  minimal?: boolean;
}) {
  const discountBadgeLabel =
    discountPercent && discountBadgeTemplate
      ? discountBadgeTemplate.replace('{percent}', String(discountPercent))
      : null;

  if (variant === 'premiumCatalog') {
    return (
      <article
        className={`group flex min-w-0 ${
          fullWidth ? 'w-full' : 'w-[200px] sm:w-[220px]'
        } flex-col overflow-hidden rounded-[24px] border border-[#d8cec7] bg-white/90 p-2 shadow-[0_18px_48px_rgba(32,26,25,0.08)] transition duration-500 hover:-translate-y-1 hover:border-[#b9aaa4] hover:shadow-[0_28px_72px_rgba(32,26,25,0.14)]`}
      >
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="relative block aspect-[5/6] overflow-hidden rounded-[20px] bg-[#f3efec]"
          aria-label={product.name}
        >
          {product.coverImageUrl ? (
            <img
              src={product.coverImageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-[var(--mk-text-muted)]">
              本地图片待上传
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#201a19]/18 via-transparent to-white/10 opacity-80" />
        </Link>

        <Link
          href={`/${locale}/products/${product.slug}`}
          className="flex flex-1 flex-col px-2 pb-2 pt-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mk-accent)]"
        >
          {product.category?.name ? (
            <p className="mb-1 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--mk-text-muted)]">
              {product.category.name}
            </p>
          ) : null}
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-[var(--mk-accent)] transition group-hover:text-[var(--mk-highlight)]">
            {product.name}
          </h3>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={`group flex min-w-0 ${
        fullWidth ? 'w-full' : 'w-[200px] sm:w-[220px]'
      } flex-col rounded-[18px] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-3 shadow-[0_16px_40px_rgba(112,89,81,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(112,89,81,0.12)]`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[var(--mk-bg-muted)]">
        {product.coverImageUrl ? (
          <img
            src={product.coverImageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--mk-bg-muted)] text-xs font-semibold uppercase tracking-wide text-[var(--mk-text-muted)]">
            本地图片待上传
          </div>
        )}
        {discountBadgeLabel ? (
          <span className="absolute left-2 top-2 rounded-full bg-[var(--mk-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#241a00]">
            {discountBadgeLabel}
          </span>
        ) : null}
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <h3 className="mk-display-font line-clamp-2 text-lg font-semibold leading-snug text-[var(--mk-accent)]">
          {product.name}
        </h3>
        {minimal ? null : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--mk-highlight)]">
              {product.productCode}
            </p>
            <p className="text-xs text-[var(--mk-text-muted)]">{product.category?.name}</p>
          </>
        )}

        {hidePrice || minimal ? null : (
          <div className="mt-1 flex items-baseline gap-2">
            {discountPercent ? (
              <>
                <span className="text-lg font-bold text-[var(--mk-text)]">
                  {formatPrice(product.priceUsd)}
                </span>
                <span className="text-sm text-[var(--mk-text-muted)] line-through">
                  {formatPrice(Math.round(product.priceUsd * (1 + discountPercent / 100)))}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-[var(--mk-text)]">
                {formatPrice(product.priceUsd)}
              </span>
            )}
          </div>
        )}

        {minimal ? null : (
          <p className="text-xs text-[var(--mk-success)]">{stockLabel}</p>
        )}

        <Link
          href={`/${locale}/products/${product.slug}`}
          className="mt-3 inline-flex items-center justify-center rounded-full bg-[var(--mk-accent)] px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--mk-highlight)]"
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
