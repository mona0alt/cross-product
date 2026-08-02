'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { HomepageProductCard } from '@/components/storefront/homepage-product-card';
import type { StorefrontProductCard } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

const AUTOPLAY_INTERVAL_MS = 4000;
const PAGE_SIZE = 4;

type CarouselStyle = React.CSSProperties & {
  '--recommendations-carousel-index': number;
};

export function ProductRecommendationsCarousel({
  locale,
  products
}: {
  locale: Locale;
  products: StorefrontProductCard[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [allowsMotion, setAllowsMotion] = useState(true);
  const slides = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    const slideCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

    return Array.from({ length: slideCount }, (_slide, slideIndex) =>
      Array.from(
        { length: PAGE_SIZE },
        (_item, offset) =>
          products[(slideIndex * PAGE_SIZE + offset) % products.length]
      )
    );
  }, [products]);
  const maxIndex = Math.max(slides.length - 1, 0);

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
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [allowsMotion, isPaused, maxIndex]);

  return (
    <div
      data-recommendations-carousel="true"
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div
        className="flex [transform:translateX(calc(var(--recommendations-carousel-index)*-100%))] transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={
          { '--recommendations-carousel-index': activeIndex } as CarouselStyle
        }
      >
        {slides.map((slideProducts, slideIndex) => (
          <div key={slideIndex} className="shrink-0 basis-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {slideProducts.map((product, productIndex) => (
                <HomepageProductCard
                  key={`${slideIndex}-${productIndex}`}
                  locale={locale}
                  product={product}
                  size="compact"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
