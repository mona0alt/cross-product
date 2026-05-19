'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { HomepageProductCard } from '@/components/storefront/homepage-product-card';
import type { StorefrontProductCard } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

const PRODUCT_AUTOPLAY_INTERVAL_MS = 4000;

type CarouselStyle = React.CSSProperties & {
  '--product-carousel-index': number;
};

function getCardLayout(index: number) {
  if (index === 0) return 'md:col-span-8 md:row-span-2';
  if (index === 3) return 'md:col-span-8';
  return 'md:col-span-4';
}

export function HomepageProductCarousel({
  locale,
  products
}: {
  locale: Locale;
  products: StorefrontProductCard[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [allowsMotion, setAllowsMotion] = useState(true);
  const slides = useMemo(
    () =>
      products.map((_, startIndex) =>
        Array.from({ length: 5 }, (_item, offset) => {
          const productIndex = (startIndex + offset) % products.length;

          return products[productIndex];
        })
      ),
    [products]
  );
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
    }, PRODUCT_AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [allowsMotion, isPaused, maxIndex]);

  return (
    <div
      data-product-carousel="true"
      data-product-autoplay-interval={PRODUCT_AUTOPLAY_INTERVAL_MS}
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
        className="flex [transform:translateX(calc(var(--product-carousel-index)*-100%))] transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ '--product-carousel-index': activeIndex } as CarouselStyle}
      >
        {slides.map((slideProducts, slideIndex) => (
          <div key={slideIndex} className="shrink-0 basis-full">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[220px]">
              {slideProducts.map((product, productIndex) => (
                <HomepageProductCard
                  key={`${slideIndex}-${product.id}`}
                  locale={locale}
                  product={product}
                  className={`md:min-h-0 ${getCardLayout(productIndex)}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
