'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useRef } from 'react';

import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

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

const catalogs = [
  {
    id: 'windowRobots',
    image: '/show/local-unsplash/photo-1581091226825-a6a2a5aee158.jpg'
  },
  {
    id: 'drones',
    image: '/show/local-unsplash/photo-1473968512647-3e447244af8f.jpg'
  },
  {
    id: 'humanoidRobots',
    image: '/show/local-unsplash/photo-1485827404703-89b55fcc595e.jpg'
  },
  {
    id: 'vacuumRobots',
    image: '/show/local-unsplash/photo-1518640467707-6811f4a6ab73.jpg'
  }
] as const;

export function CatalogCarousel({
  locale,
  title,
  copy
}: {
  locale: Locale;
  title: string;
  copy: {
    ctaLabel: string;
    items: Record<(typeof catalogs)[number]['id'], string>;
  };
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="py-6">
      <div className="mk-container mb-4 flex items-end justify-between">
        <h2 className="mk-section-title">{title}</h2>
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
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="mk-carousel-item w-[260px] sm:w-[300px]"
            >
              <div className="overflow-hidden rounded-md border border-[var(--mk-border)] bg-white">
                <img
                  src={catalog.image}
                  alt={copy.items[catalog.id]}
                  className="h-[180px] w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-black">{copy.items[catalog.id]}</h3>
                  <Link
                    href={`/${locale}/products`}
                    className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-[var(--mk-highlight)] hover:underline"
                  >
                    {copy.ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
