'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { useState } from 'react';

export function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[1.75rem] bg-slate-100">
        <img src={active} alt="" className="h-[420px] w-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(image)}
            className={`overflow-hidden rounded-2xl border ${
              active === image ? 'border-slate-950' : 'border-slate-200'
            }`}
          >
            <img src={image} alt="" className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
