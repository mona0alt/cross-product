import React from 'react';
import Link from 'next/link';

import { BannerCarousel } from '@/components/storefront/banner-carousel';
import type { Locale } from '@/lib/i18n/config';

type BannerItem = {
  id: string;
  imageUrl: string;
  targetType: string;
  targetId: string | null;
  targetUrl: string | null;
  sortOrder: number;
};

type HeroShowcaseProps = {
  locale: Locale;
  banners: BannerItem[];
  copy: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    highlights: string[];
    emptyBannerLabel?: string;
  };
};

export function HeroShowcase({
  locale,
  banners,
  copy
}: HeroShowcaseProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="storefront-surface rounded-[var(--store-radius-xl)] px-6 py-7 sm:px-8 sm:py-9">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="storefront-eyebrow">{copy.eyebrow}</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-[var(--store-text)] sm:text-5xl">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--store-text-muted)]">
              {copy.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-full bg-[var(--store-accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              {copy.primaryCta}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full border border-[var(--store-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--store-accent)]"
            >
              {copy.secondaryCta}
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {copy.highlights.map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-[var(--store-border)] bg-[var(--store-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--store-accent)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BannerCarousel
        banners={banners}
        emptyLabel={copy.emptyBannerLabel ?? ''}
        copy={copy}
        primaryHref={`/${locale}/products`}
        secondaryHref={`/${locale}/contact`}
      />
    </section>
  );
}
