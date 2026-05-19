'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { HomepageCategoryCard } from '@/components/storefront/homepage-category-card';
import type { StorefrontCategory } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

type CarouselStyle = React.CSSProperties & {
  '--category-carousel-index': number;
};

function getVisibleCount() {
  if (typeof window === 'undefined') {
    return 4;
  }

  if (window.innerWidth >= 1024) {
    return 4;
  }

  if (window.innerWidth >= 640) {
    return 2;
  }

  return 1;
}

export function HomepageCategoryCarousel({
  locale,
  categories
}: {
  locale: Locale;
  categories: StorefrontCategory[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const [allowsMotion, setAllowsMotion] = useState(true);
  const maxIndex = useMemo(
    () => Math.max(categories.length - visibleCount, 0),
    [categories.length, visibleCount]
  );

  useEffect(() => {
    function syncVisibleCount() {
      setVisibleCount(getVisibleCount());
    }

    syncVisibleCount();
    window.addEventListener('resize', syncVisibleCount);

    return () => window.removeEventListener('resize', syncVisibleCount);
  }, []);

  useEffect(() => {
    setActiveIndex((currentIndex) => Math.min(currentIndex, maxIndex));
  }, [maxIndex]);

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
    if (isPaused || !allowsMotion || maxIndex === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex >= maxIndex ? 0 : currentIndex + 1
      );
    }, 3500);

    return () => window.clearInterval(timer);
  }, [allowsMotion, isPaused, maxIndex]);

  function showPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex <= 0 ? maxIndex : currentIndex - 1
    );
  }

  function showNext() {
    setActiveIndex((currentIndex) =>
      currentIndex >= maxIndex ? 0 : currentIndex + 1
    );
  }

  return (
    <div
      data-category-carousel="true"
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous product series"
          onClick={showPrevious}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--mk-border-strong)] bg-white text-[var(--mk-accent)] shadow-[0_12px_28px_rgba(112,89,81,0.1)] transition hover:border-[var(--mk-accent)] hover:bg-[var(--mk-bg-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mk-accent)]"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next product series"
          onClick={showNext}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--mk-border-strong)] bg-white text-[var(--mk-accent)] shadow-[0_12px_28px_rgba(112,89,81,0.1)] transition hover:border-[var(--mk-accent)] hover:bg-[var(--mk-bg-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mk-accent)]"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="-mx-2.5 overflow-hidden" aria-live="polite">
        <div
          className="flex [--category-carousel-visible:1] [transform:translateX(calc(var(--category-carousel-index)*-100%/var(--category-carousel-visible)))] transition-transform duration-700 ease-out motion-reduce:transition-none sm:[--category-carousel-visible:2] lg:[--category-carousel-visible:4]"
          style={{ '--category-carousel-index': activeIndex } as CarouselStyle}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="shrink-0 basis-full px-2.5 sm:basis-1/2 lg:basis-1/4"
            >
              <HomepageCategoryCard
                locale={locale}
                category={category}
                className="block h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
