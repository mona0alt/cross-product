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
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    '/show/robot_window_cleaner.png',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    '/show/robot_window_cleaner.png'
  ],
  drones: [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop'
  ],
  humanoidRobots: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=400&fit=crop',
    '/show/robot_humanoid.png',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop'
  ],
  vacuumRobots: [
    'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400&h=400&fit=crop',
    '/show/robot_floor_cleaner.png',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop'
  ],
  scenes: [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop'
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

  return (
    <section className="py-8">
      <div className="mk-container mb-5 text-center">
        <h2 className="mk-section-title">{copy.title}</h2>
        <p className="mt-2 text-sm text-[var(--mk-text-muted)]">{copy.handle}</p>
      </div>

      {/* Tabs */}
      <div className="mk-container mb-5">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                activeTab === tab.key
                  ? 'bg-black text-white'
                  : 'border border-[var(--mk-border)] text-black hover:bg-[var(--mk-bg-muted)]'
              }`}
            >
              {copy.tabs[tab.key]}
            </button>
          ))}
        </div>
      </div>

      {/* Image grid */}
      <div className="mk-container">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(images[activeTab] ?? images.windowRobots).map((src, index) => (
            <div key={`${activeTab}-${index}`} className="overflow-hidden rounded-md">
              <img
                src={src}
                alt=""
                className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
