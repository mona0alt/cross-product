'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { useState } from 'react';

export function ProductGallery({ images }: { images: string[] }) {
  const visibleImages = images.filter(Boolean);
  const [active, setActive] = useState(visibleImages[0] ?? '');

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[var(--mk-radius-lg)] border border-[var(--mk-border)] bg-white shadow-[0_18px_44px_rgba(112,89,81,0.08)]">
      <div className="relative bg-[var(--mk-bg-muted)]">
        {active ? (
          <img
            src={active}
            alt=""
            className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[560px]"
          />
        ) : (
          <div className="flex h-[360px] w-full items-center justify-center text-sm font-semibold text-[var(--mk-text-muted)] sm:h-[460px] lg:h-[560px]">
            本地图片待上传
          </div>
        )}
      </div>

      {visibleImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 p-2 sm:grid-cols-6">
          {visibleImages.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(image)}
              className={`overflow-hidden rounded-[var(--mk-radius-md)] border p-1 transition ${
                active === image
                  ? 'border-[var(--mk-accent)] bg-white shadow-[0_8px_20px_rgba(112,89,81,0.14)]'
                  : 'border-[var(--mk-border)] bg-[var(--mk-bg-muted)] hover:border-[var(--mk-border-strong)]'
              }`}
            >
              <img
                src={image}
                alt=""
                className="h-14 w-full rounded-[calc(var(--mk-radius-md)-0.125rem)] object-cover sm:h-16"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
