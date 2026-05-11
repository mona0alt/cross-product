import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HomepageCategoryGrid } from '@/components/storefront/homepage-category-grid';
import { HomepageProductMatrix } from '@/components/storefront/homepage-product-matrix';
import { SocialShowcase } from '@/components/storefront/social-showcase';

const categories = [
  {
    id: 'cat-1',
    slug: 'humanoids',
    iconImageUrl: '/show/robot_humanoid.png',
    name: 'Humanoids',
    description: 'Human-centered robots'
  },
  {
    id: 'cat-2',
    slug: 'drones',
    iconImageUrl: '/show/robot_drone.png',
    name: 'Drones',
    description: 'Flying robots'
  }
];

const products = [
  {
    id: 'product-1',
    slug: 'alpha',
    productCode: 'A-1',
    coverImageUrl: '/show/robot_humanoid.png',
    priceUsd: 100,
    isRecommended: true,
    name: 'Alpha Robot',
    intro: 'Intro',
    detail: 'Detail',
    images: [],
    category: { slug: 'humanoids', name: 'Humanoids' }
  },
  {
    id: 'product-2',
    slug: 'drone',
    productCode: 'D-1',
    coverImageUrl: '/show/robot_drone.png',
    priceUsd: 200,
    isRecommended: true,
    name: 'Drone Robot',
    intro: 'Intro',
    detail: 'Detail',
    images: [],
    category: { slug: 'drones', name: 'Drones' }
  }
];

describe('homepage showcase components', () => {
  it('renders category cards linked to product filters', () => {
    const html = renderToStaticMarkup(
      <HomepageCategoryGrid
        locale="en"
        title="Product Series"
        categories={categories}
      />
    );

    expect(html).toContain('Product Series');
    expect(html).toContain('Humanoids');
    expect(html).toContain('/en/products?category=humanoids');
    expect(html).toContain('/show/robot_humanoid.png');
    expect(html).toContain('w-full px-4 sm:px-6 lg:px-8');
    expect(html).not.toContain('class="mk-container"');
    expect(html).toContain('grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]');
    expect(html).toContain('group relative min-h-[260px] overflow-hidden rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_16px_38px_rgba(29,126,234,0.08)] sm:min-h-[320px] lg:min-h-0');
    expect(html).toContain('sm:col-span-2 lg:col-span-2 lg:row-span-2');
    expect(html).not.toContain('lg:col-span-2 lg:row-span-2&quot; href="/en/products?category=drones"');
    expect(html).toContain('h-full w-full object-cover transition duration-300 group-hover:scale-105');
    expect(html).toContain('absolute inset-0 bg-gradient-to-t from-[#061b38]/84 via-[#0f63ce]/14 to-transparent');
    expect(html).not.toContain('object-contain');
    expect(html).not.toContain('group-hover:scale-[1.02]');
    expect(html).toContain('absolute bottom-4 left-4 right-4 text-white');
    expect(html).toContain('line-clamp-2 text-xs font-semibold leading-5 text-[#bfe1ff]');
    expect(html).toContain('mt-1 text-sm font-bold');
    expect(html).not.toContain('aspect-[4/3]');
    expect(html).not.toContain('text-center text-base font-semibold text-[var(--mk-text)]');
  });

  it('renders a product image matrix without empty placeholders', () => {
    const html = renderToStaticMarkup(
      <HomepageProductMatrix
        locale="en"
        eyebrow="Product Gallery"
        title="More Product Images"
        viewAllLabel="View all"
        products={products}
      />
    );

    expect(html).toContain('More Product Images');
    expect(html).toContain('/en/products/alpha');
    expect(html).toContain('/show/robot_drone.png');
    expect(html).toContain('bg-white py-10 sm:py-12');
    expect(html).toContain('w-full px-4 sm:px-6 lg:px-8');
    expect(html).not.toContain('class="mk-container"');
    expect(html).toContain('grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]');
    expect(html).toContain('text-xs font-bold uppercase tracking-[0.16em] text-[var(--mk-accent)]');
    expect(html).toContain('mt-2 text-2xl font-bold text-[var(--mk-text)]');
    expect(html).toContain('rounded-full border border-[var(--mk-accent)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--mk-accent)] transition hover:bg-white');
    expect(html).toContain('group relative min-h-[260px] overflow-hidden rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_16px_38px_rgba(29,126,234,0.08)] sm:min-h-[320px] lg:min-h-0');
    expect(html).toContain('sm:col-span-2 lg:col-span-2 lg:row-span-2');
    expect(html).toContain('lg:min-h-0');
    expect(html).toContain('h-full w-full object-cover transition duration-300 group-hover:scale-105');
    expect(html).toContain('absolute inset-0 bg-gradient-to-t from-[#061b38]/84 via-[#0f63ce]/14 to-transparent');
    expect(html).toContain('absolute bottom-4 left-4 right-4 text-white');
    expect(html).toContain('text-xs font-semibold uppercase tracking-[0.12em] text-[#bfe1ff]');
    expect(html).toContain('mt-1 line-clamp-2 text-sm font-bold');
    expect(html).not.toContain('absolute left-4 right-4 top-4 flex justify-end');
    expect(html).not.toContain('rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--mk-text)]');
    expect(html).not.toContain('Humanoids');
    expect(html).not.toContain('Drones');
    expect(html).not.toContain('aspect-[9/13]');
    expect(html).not.toContain('md:grid-rows-2');
    expect(html).not.toContain('group/card');
    expect(html).not.toContain('bg-[#07111f] py-10 text-white sm:py-12');
    expect(html).not.toContain('bg-white/16');
    expect(html).not.toContain('p-4\"><h3 class=\"text-sm font-semibold text-[var(--mk-text)]');
    expect(html).not.toContain('empty-slot');
  });

  it('renders social media cards with platform tabs', () => {
    const html = renderToStaticMarkup(
      <SocialShowcase
        copy={{
          title: 'Social Media',
          handle: '@fbgm_robotics',
          tabs: {
            windowRobots: 'Window Robots',
            drones: 'Drones',
            humanoidRobots: 'Humanoids',
            vacuumRobots: 'Vacuum Robots',
            scenes: 'Highlights'
          }
        }}
      />
    );

    expect(html).toContain('Social Media');
    expect(html).toContain('@fbgm_robotics');
    expect(html).toContain('Window Robots');
    expect(html).toContain('w-full px-4 sm:px-6 lg:px-8');
    expect(html).not.toContain('class="mk-container"');
    expect(html).toContain('grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]');
    expect(html).toContain('group relative min-h-[260px] overflow-hidden rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_16px_38px_rgba(29,126,234,0.08)] sm:min-h-[320px] lg:min-h-0');
    expect(html).toContain('sm:col-span-2 lg:col-span-2 lg:row-span-2');
    expect(html).toContain('lg:col-span-2');
    expect(html).toContain('h-full w-full object-cover transition duration-300 group-hover:scale-105');
    expect(html).toContain('absolute inset-0 bg-gradient-to-t from-[#061b38]/84 via-[#0f63ce]/14 to-transparent');
    expect(html).toContain('absolute bottom-4 left-4 right-4 text-white');
    expect(html).toContain('text-xs font-semibold uppercase tracking-[0.12em] text-[#bfe1ff]');
    expect(html).toContain('mt-1 text-sm font-bold');
    expect(html).not.toContain('aspect-[9/13]');
    expect(html).not.toContain('absolute left-4 right-4 top-4 flex justify-end');
    expect(html).not.toContain('TikTok');
  });
});
