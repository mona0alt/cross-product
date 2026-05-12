/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

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
  const visibleProducts = products.slice(0, 5);

  if (visibleProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--mk-accent)]">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--mk-text)]">
              {title}
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="rounded-full border border-[var(--mk-accent)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--mk-accent)] transition hover:bg-white"
          >
            {viewAllLabel}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]">
          {visibleProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className={`group relative min-h-[260px] overflow-hidden rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_16px_38px_rgba(29,126,234,0.08)] sm:min-h-[320px] lg:min-h-0 ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              {product.coverImageUrl ? (
                <img
                  src={product.coverImageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-[var(--mk-text-muted)]">
                  本地图片待上传
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061b38]/84 via-[#0f63ce]/14 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bfe1ff]">
                  {product.productCode}
                </p>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold">
                  {product.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
