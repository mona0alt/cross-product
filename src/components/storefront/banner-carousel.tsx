'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';

type BannerItem = {
  id: string;
  imageUrl: string;
  targetType: string;
  targetId: string | null;
  targetUrl: string | null;
  sortOrder: number;
  title?: string | null;
  description?: string | null;
};

const BANNER_AUTOPLAY_INTERVAL_MS = 5000;

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
  const [isPaused, setIsPaused] = useState(false);
  const [allowsMotion, setAllowsMotion] = useState(true);
  const activeBanner = banners[activeIndex];
  const hasMultipleBanners = banners.length > 1;
  const activeTitle = activeBanner?.title?.trim();
  const activeDescription = activeBanner?.description?.trim();
  const shouldRenderCopy = Boolean(activeTitle && activeDescription);

  useEffect(() => {
    setActiveIndex((currentIndex) =>
      banners.length === 0 ? 0 : Math.min(currentIndex, banners.length - 1)
    );
  }, [banners.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function syncMotionPreference() {
      setAllowsMotion(!mediaQuery.matches);
    }

    syncMotionPreference();
    mediaQuery.addEventListener('change', syncMotionPreference);

    return () => mediaQuery.removeEventListener('change', syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!hasMultipleBanners || isPaused || !allowsMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === banners.length - 1 ? 0 : currentIndex + 1
      );
    }, BANNER_AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [allowsMotion, banners.length, hasMultipleBanners, isPaused]);

  return (
    <section
      className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[#07111f]"
      data-banner-autoplay={hasMultipleBanners ? 'true' : undefined}
      data-banner-autoplay-interval={
        hasMultipleBanners ? BANNER_AUTOPLAY_INTERVAL_MS : undefined
      }
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="absolute inset-0">
        {activeBanner ? (
          activeBanner.targetUrl ? (
            <a
              href={activeBanner.targetUrl}
              data-testid="banner-link"
              className="block h-full w-full"
            >
              <img
                src={activeBanner.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </a>
          ) : (
            <img
              src={activeBanner.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#07111f] px-6 text-center text-base font-semibold text-white/70">
            {emptyLabel}
          </div>
        )}
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {shouldRenderCopy ? (
        <div className="absolute inset-0 flex items-center pb-16">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-16">
            <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {activeTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              {activeDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-[var(--mk-accent)] hover:text-white"
              >
                {copy.primaryCta}
              </a>
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                {copy.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {hasMultipleBanners && (
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
