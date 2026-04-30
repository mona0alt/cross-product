'use client';

import React, { useRef } from 'react';

import type { Locale } from '@/lib/i18n/config';
import type { StorefrontProductCard } from '@/features/catalog/types';
import { ProductCard } from '@/components/storefront/product-card';

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ProductCarousel({
  locale,
  products,
  title,
  subtitle,
  ctaLabel,
  emptyLabel,
  stockLabel,
  discountBadgeTemplate,
  discounts
}: {
  locale: Locale;
  products: StorefrontProductCard[];
  title: string;
  subtitle?: string;
  ctaLabel: string;
  emptyLabel: string;
  stockLabel: string;
  discountBadgeTemplate?: string;
  discounts?: Record<string, number>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) {
    return (
      <section className="py-6">
        <div className="mk-container mb-4">
          <h2 className="mk-section-title">{title}</h2>
        </div>
        <div className="mk-container">
          <p className="text-sm text-[var(--mk-text-muted)]">{emptyLabel}</p>
        </div>
      </section>
    );
  }

  const scroll = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -240 : 240;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="py-6">
      <div className="mk-container mb-4 flex items-end justify-between">
        <div>
          <h2 className="mk-section-title">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-[var(--mk-text-muted)]">{subtitle}</p> : null}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--mk-border)] text-black hover:bg-[var(--mk-bg-muted)]"
            aria-label="scroll-left"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--mk-border)] text-black hover:bg-[var(--mk-bg-muted)]"
            aria-label="scroll-right"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mk-container">
        <div ref={trackRef} className="mk-carousel-track pb-2">
          {products.map((product) => (
            <div key={product.id} className="mk-carousel-item">
              <ProductCard
                locale={locale}
                product={product}
                ctaLabel={ctaLabel}
                stockLabel={stockLabel}
                discountBadgeTemplate={discountBadgeTemplate}
                discountPercent={discounts?.[product.id]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
