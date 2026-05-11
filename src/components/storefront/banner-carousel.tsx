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
  copy: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  primaryHref: string;
  secondaryHref: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBanner = banners[activeIndex];

  return (
    <section className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[#07111f]">
      <div className="absolute inset-0">
        {activeBanner ? (
          <img
            src={activeBanner.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#07111f] px-6 text-center text-base font-semibold text-white/70">
            {emptyLabel}
          </div>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/50'
                }`}
                aria-label={`banner-${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#123b73] shadow hover:bg-white sm:flex"
            aria-label="prev-banner"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
            className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#123b73] shadow hover:bg-white sm:flex"
            aria-label="next-banner"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
