'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import Link from 'next/link';

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
  emptyLabel,
  copy,
  primaryHref,
  secondaryHref
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#08275a] via-[#0f63ce] to-[#68b9ff]">
      <div className="mk-container grid min-h-[420px] items-center gap-8 py-12 lg:min-h-[540px] lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)] lg:py-16">
        <div className="relative z-10 max-w-2xl text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bfe1ff]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
            {copy.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#123b73] transition hover:bg-[#eef7ff]"
            >
              {copy.primaryCta}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              {copy.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="relative z-10">
          <div className="overflow-hidden rounded-[1.25rem] border border-white/35 bg-white/12 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur">
            <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-[1rem] bg-white/12 sm:min-h-[340px]">
              {activeBanner ? (
                <img
                  src={activeBanner.imageUrl}
                  alt=""
                  className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[400px]"
                />
              ) : (
                <p className="px-6 text-center text-base font-semibold text-white/78">
                  {emptyLabel}
                </p>
              )}
            </div>
          </div>
        </div>
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
