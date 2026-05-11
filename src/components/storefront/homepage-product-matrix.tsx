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
    <section className="bg-[var(--mk-bg-muted)] py-10 sm:py-12">
      <div className="mk-container">
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

        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {visibleProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className={`group overflow-hidden rounded-xl border border-[var(--mk-border)] bg-white shadow-[0_16px_38px_rgba(29,126,234,0.08)] ${
                index === 0 ? 'md:row-span-2' : ''
              }`}
            >
              <div className="overflow-hidden">
                <img
                  src={product.coverImageUrl}
                  alt={product.name}
                  className={`w-full object-cover transition duration-300 group-hover:scale-105 ${
                    index === 0 ? 'h-full min-h-[280px] md:min-h-[420px]' : 'h-44'
                  }`}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[var(--mk-text)]">
                  {product.name}
                </h3>
                {product.category ? (
                  <p className="mt-1 text-xs text-[var(--mk-text-muted)]">
                    {product.category.name}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
