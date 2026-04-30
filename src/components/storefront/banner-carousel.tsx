'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';

type BannerItem = {
  id: string;
  imageUrl: string;
  targetType: string;
  targetId: string | null;
  targetUrl: string | null;
  sortOrder: number;
};

export function BannerCarousel({
  banners,
  emptyLabel
}: {
  banners: BannerItem[];
  emptyLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (banners.length === 0) {
    return (
      <div className="relative h-[280px] w-full bg-[var(--mk-bg-muted)] sm:h-[380px] lg:h-[460px]">
        <div className="flex h-full items-center justify-center">
          <p className="text-lg font-semibold text-[var(--mk-text-muted)]">{emptyLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative aspect-video max-h-[520px] w-full overflow-hidden">
        {banners.map((banner, index) => (
          <img
            key={banner.id}
            src={banner.imageUrl}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/60'
            }`}
            aria-label={`banner-${index + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow hover:bg-white"
            aria-label="prev-banner"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow hover:bg-white"
            aria-label="next-banner"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
