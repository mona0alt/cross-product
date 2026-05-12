'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { useState } from 'react';

export function ProductGallery({
  images,
  label
}: {
  images: string[];
  label: string;
}) {
  const visibleImages = images.filter(Boolean);
  const [active, setActive] = useState(visibleImages[0] ?? '');

  return (
    <div className="storefront-surface rounded-[var(--store-radius-lg)] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="storefront-eyebrow">{label}</p>
            <p className="text-sm font-semibold text-[var(--store-text)]">
              {visibleImages.length > 0 ? `1 / ${visibleImages.length}` : '0 / 0'}
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] bg-[var(--store-surface-muted)]">
          {active ? (
            <img src={active} alt="" className="h-[520px] w-full object-cover" />
          ) : (
            <div className="flex h-[520px] w-full items-center justify-center text-sm font-semibold text-[var(--store-text-muted)]">
              本地图片待上传
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {visibleImages.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(image)}
              className={`overflow-hidden rounded-[1.2rem] border p-1 ${
                active === image
                  ? 'border-[var(--store-accent)] bg-white'
                  : 'border-[var(--store-border)] bg-[var(--store-surface-muted)]'
              }`}
            >
              <img src={image} alt="" className="h-20 w-full rounded-xl object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
