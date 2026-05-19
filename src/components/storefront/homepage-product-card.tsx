/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { StorefrontProductCard } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function HomepageProductCard({
  locale,
  product,
  className
}: {
  locale: Locale;
  product: StorefrontProductCard;
  className?: string;
}) {
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className={`group/card relative min-h-[260px] overflow-hidden rounded-[22px] border border-[var(--mk-border)] bg-[var(--mk-surface)] shadow-[0_18px_44px_rgba(112,89,81,0.08)] transition duration-500 hover:-translate-y-1 ${className ?? ''}`}
    >
      {product.coverImageUrl ? (
        <img
          src={product.coverImageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover/card:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-[var(--mk-text-muted)]">
          本地图片待上传
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#201a19]/78 via-[#705951]/18 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 translate-y-0 text-white opacity-100 transition duration-300 ease-out md:bottom-6 md:left-6 md:right-6 md:translate-y-8 md:opacity-0 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100 md:group-focus-visible/card:translate-y-0 md:group-focus-visible/card:opacity-100 motion-reduce:transform-none motion-reduce:transition-none">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ffe088]">
          {product.category?.name}
        </p>
        <h3 className="mk-display-font mt-1.5 line-clamp-2 text-lg font-semibold leading-snug sm:text-xl">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
