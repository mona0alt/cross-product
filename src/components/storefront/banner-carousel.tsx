'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { useState } from 'react';

type BannerItem = {
  id: string;
  imageUrl: string;
  targetType: string;
  targetId: string | null;
  targetUrl: string | null;
  sortOrder: number;
};

export function BannerCarousel({ banners }: { banners: BannerItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (banners.length === 0) {
    return (
      <div className="storefront-surface flex min-h-[420px] items-center justify-center rounded-[var(--store-radius-xl)] p-8">
        <div className="max-w-sm space-y-3 text-center">
          <p className="storefront-eyebrow">Showcase</p>
          <p className="text-lg font-semibold text-[var(--store-text)]">
            Hero banner will appear here once promotions are published.
          </p>
        </div>
      </div>
    );
  }

  const activeBanner = banners[activeIndex] ?? banners[0];

  return (
    <div className="storefront-surface overflow-hidden rounded-[var(--store-radius-xl)] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="storefront-eyebrow">Featured</p>
            <p className="text-sm font-semibold text-[var(--store-text)]">
              Scroll through active retail highlights
            </p>
          </div>
          <span className="rounded-full bg-[var(--store-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--store-text-muted)]">
            {activeIndex + 1} / {banners.length}
          </span>
        </div>
        <img
          src={activeBanner.imageUrl}
          alt=""
          className="h-[420px] w-full rounded-[1.5rem] object-cover"
        />
        <div className="flex flex-wrap gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${
                index === activeIndex
                  ? 'w-12 bg-[var(--store-accent)]'
                  : 'w-6 bg-[var(--store-border-strong)]'
              }`}
              aria-label={`banner-${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
