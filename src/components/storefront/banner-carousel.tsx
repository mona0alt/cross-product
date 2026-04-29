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
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-100 p-8 text-sm text-slate-500">
        Banner
      </div>
    );
  }

  const activeBanner = banners[activeIndex] ?? banners[0];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-3 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.7)]">
        <img
          src={activeBanner.imageUrl}
          alt=""
          className="h-[320px] w-full rounded-[1.5rem] object-cover"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition ${
              index === activeIndex ? 'w-12 bg-slate-950' : 'w-6 bg-slate-300'
            }`}
            aria-label={`banner-${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
