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
  const [active, setActive] = useState(images[0]);

  return (
    <div className="storefront-surface rounded-[var(--store-radius-lg)] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="storefront-eyebrow">{label}</p>
            <p className="text-sm font-semibold text-[var(--store-text)]">
              {`1 / ${images.length}`}
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] bg-[var(--store-surface-muted)]">
          <img src={active} alt="" className="h-[520px] w-full object-cover" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => (
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
