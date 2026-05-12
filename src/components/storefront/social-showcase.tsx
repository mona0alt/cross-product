/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';

const tabs = [
  { key: 'windowRobots' },
  { key: 'drones' },
  { key: 'humanoidRobots' },
  { key: 'vacuumRobots' },
  { key: 'scenes' }
] as const;

const images: Record<string, string[]> = {
  windowRobots: [
    '/show/local-unsplash/photo-1581091226825-a6a2a5aee158.jpg',
    '/show/robot_window_cleaner.png',
    '/show/local-unsplash/photo-1581092160562-40aa08e78837.jpg',
    '/show/robot_window_cleaner.png'
  ],
  drones: [
    '/show/local-unsplash/photo-1473968512647-3e447244af8f.jpg',
    '/show/local-unsplash/photo-1507582020474-9a35b7d455d9.jpg',
    '/show/local-unsplash/photo-1527977966376-1c8408f9f108.jpg',
    '/show/local-unsplash/photo-1579829366248-204fe8413f31.jpg'
  ],
  humanoidRobots: [
    '/show/local-unsplash/photo-1485827404703-89b55fcc595e.jpg',
    '/show/local-unsplash/photo-1531746790731-6c087fecd65a.jpg',
    '/show/robot_humanoid.png',
    '/show/local-unsplash/photo-1581092160562-40aa08e78837.jpg'
  ],
  vacuumRobots: [
    '/show/local-unsplash/photo-1518640467707-6811f4a6ab73.jpg',
    '/show/robot_floor_cleaner.png',
    '/show/local-unsplash/photo-1581091226825-a6a2a5aee158.jpg',
    '/show/local-unsplash/photo-1600585154340-be6161a56a0c.jpg'
  ],
  scenes: [
    '/show/local-unsplash/photo-1550751827-4bd374c3f58b.jpg',
    '/show/local-unsplash/photo-1518770660439-4636190af475.jpg',
    '/show/local-unsplash/photo-1526374965328-7f61d4dc18c5.jpg',
    '/show/local-unsplash/photo-1451187580459-43490279c0fa.jpg'
  ]
};

export function SocialShowcase({
  copy
}: {
  copy: {
    title: string;
    handle: string;
    tabs: Record<(typeof tabs)[number]['key'], string>;
  };
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['key']>('windowRobots');
  const activeImages = images[activeTab] ?? images.windowRobots;

  function getSocialCardLayout(index: number) {
    if (index === 0) {
      return 'sm:col-span-2 lg:col-span-2 lg:row-span-2';
    }

    if (index === 1) {
      return 'lg:col-span-2';
    }

    return '';
  }

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--mk-accent)]">
              SOCIAL MEDIA
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--mk-text)]">
              {copy.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--mk-text-muted)]">{copy.handle}</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--mk-border-strong)] text-[var(--mk-accent)]"
              aria-label="previous-social-card"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mk-accent)] text-white"
              aria-label="next-social-card"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                activeTab === tab.key
                  ? 'bg-[var(--mk-accent)] text-white'
                  : 'border border-[var(--mk-border)] text-[var(--mk-text)] hover:bg-[var(--mk-bg-muted)]'
              }`}
            >
              {copy.tabs[tab.key]}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]">
          {activeImages.slice(0, 4).map((src, index) => (
            <div
              key={`${activeTab}-${index}`}
              className={`group relative min-h-[260px] overflow-hidden rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_16px_38px_rgba(29,126,234,0.08)] sm:min-h-[320px] lg:min-h-0 ${getSocialCardLayout(index)}`}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061b38]/84 via-[#0f63ce]/14 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bfe1ff]">
                  {copy.handle}
                </p>
                <h3 className="mt-1 text-sm font-bold">{copy.tabs[activeTab]}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
