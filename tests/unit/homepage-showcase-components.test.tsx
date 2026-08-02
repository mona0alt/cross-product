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

const carouselCategories = [
  ...categories,
  {
    id: 'cat-3',
    slug: 'cleaners',
    iconImageUrl: '/show/robot_window_cleaner.png',
    name: 'Cleaners',
    description: 'Glass robots'
  },
  {
    id: 'cat-4',
    slug: 'vacuums',
    iconImageUrl: '/show/robot_floor_cleaner.png',
    name: 'Vacuums',
    description: 'Floor robots'
  },
  {
    id: 'cat-5',
    slug: 'arms',
    iconImageUrl: '/show/robot_industrial_arm.png',
    name: 'Industrial Arms',
    description: 'Factory robots'
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
  },
  {
    id: 'product-3',
    slug: 'cleaner',
    productCode: 'C-1',
    coverImageUrl: '/show/robot_window_cleaner.png',
    priceUsd: 300,
    isRecommended: true,
    name: 'Cleaner Robot',
    intro: 'Intro',
    detail: 'Detail',
    images: [],
    category: { slug: 'cleaners', name: 'Cleaners' }
  },
  {
    id: 'product-4',
    slug: 'vacuum',
    productCode: 'V-1',
    coverImageUrl: '/show/robot_floor_cleaner.png',
    priceUsd: 400,
    isRecommended: true,
    name: 'Vacuum Robot',
    intro: 'Intro',
    detail: 'Detail',
    images: [],
    category: { slug: 'vacuums', name: 'Vacuums' }
  }
];

const carouselProducts = [
  ...products,
  {
    id: 'product-5',
    slug: 'arm',
    productCode: 'A-5',
    coverImageUrl: '/show/robot_industrial_arm.png',
    priceUsd: 500,
    isRecommended: true,
    name: 'Industrial Arm',
    intro: 'Intro',
    detail: 'Detail',
    images: [],
    category: { slug: 'arms', name: 'Arms' }
  },
  {
    id: 'product-6',
    slug: 'sensor',
    productCode: 'S-6',
    coverImageUrl: '/show/local-unsplash/photo-1518770660439-4636190af475.jpg',
    priceUsd: 600,
    isRecommended: true,
    name: 'Sensor Kit',
    intro: 'Intro',
    detail: 'Detail',
    images: [],
    category: { slug: 'sensors', name: 'Sensors' }
  }
];

describe('homepage showcase components', () => {
  it('renders category cards linked to product filters', () => {
    const html = renderToStaticMarkup(
      <HomepageCategoryGrid
        locale="en"
        eyebrow="Categories"
        title="Product Series"
        categories={categories}
      />
    );

    expect(html).toContain('Product Series');
    expect(html).toContain('Humanoids');
    expect(html).toContain('/en/categories/humanoids');
    expect(html).toContain('/show/robot_humanoid.png');
    expect(html).toContain('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8');
    expect(html).not.toContain('class="mk-container"');
    expect(html).toContain('bg-[var(--mk-bg)] py-12 sm:py-16');
    expect(html).toContain('grid grid-cols-2 gap-5 lg:grid-cols-4');
    expect(html).toContain('group rounded-[18px] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-3 shadow-[0_18px_44px_rgba(112,89,81,0.08)] transition duration-500 hover:-translate-y-1');
    expect(html).toContain('aspect-[4/5] overflow-hidden rounded-[14px] bg-[var(--mk-bg-muted)]');
    expect(html).toContain('h-full w-full object-cover mix-blend-multiply transition duration-700 group-hover:scale-[1.04]');
    expect(html).toContain('mk-display-font mt-4 text-center text-xl font-semibold text-[var(--mk-accent)]');
    expect(html).toContain('text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--mk-text-muted)]');
    expect(html).not.toContain('absolute inset-0 bg-gradient-to-t from-[#061b38]/84 via-[#0f63ce]/14 to-transparent');
    expect(html).not.toContain('shadow-[0_16px_38px_rgba(29,126,234,0.08)]');
  });

  it('renders product series as a one-card-step carousel when more than four categories exist', () => {
    const html = renderToStaticMarkup(
      <HomepageCategoryGrid
        locale="en"
        eyebrow="Categories"
        title="Product Series"
        categories={carouselCategories}
      />
    );

    expect(html).toContain('Product Series');
    expect(html).toContain('Industrial Arms');
    expect(html).toContain('/en/categories/arms');
    expect(html).toContain('data-category-carousel="true"');
    expect(html).toContain('aria-label="Previous product series"');
    expect(html).toContain('aria-label="Next product series"');
    expect(html).toContain('lg:basis-1/4');
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
    expect(html).toContain('bg-[var(--mk-bg-muted)] py-12 sm:py-16');
    expect(html).toContain('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8');
    expect(html).not.toContain('class="mk-container"');
    expect(html).toContain('grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[220px]');
    expect(html).toContain('text-xs font-semibold uppercase tracking-[0.22em] text-[var(--mk-highlight)]');
    expect(html).toContain('mk-display-font mt-2 text-3xl font-semibold text-[var(--mk-accent)]');
    expect(html).toContain('rounded-full border border-[var(--mk-accent)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mk-accent)] transition hover:bg-[var(--mk-accent)] hover:text-white');
    expect(html).toContain('group/card relative min-h-[260px] overflow-hidden rounded-[22px] border border-[var(--mk-border)] bg-[var(--mk-surface)] shadow-[0_18px_44px_rgba(112,89,81,0.08)] transition duration-500 hover:-translate-y-1 md:min-h-0');
    expect(html).toContain('md:col-span-8 md:row-span-2');
    expect(html).toContain('md:col-span-4');
    expect(html).toContain('md:col-span-8');
    expect(html).toContain('h-full w-full object-cover transition duration-700 group-hover/card:scale-[1.04]');
    expect(html).toContain('absolute inset-0 bg-gradient-to-t from-[#201a19]/78 via-[#705951]/18 to-transparent');
    expect(html).not.toContain('absolute left-4 right-4 top-4 flex items-center justify-between gap-3');
    expect(html).toContain('absolute bottom-4 left-4 right-4 translate-y-0 text-white opacity-100 transition duration-300 ease-out md:bottom-6 md:left-6 md:right-6 md:translate-y-8 md:opacity-0 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100 md:group-focus-visible/card:translate-y-0 md:group-focus-visible/card:opacity-100 motion-reduce:transform-none motion-reduce:transition-none');
    expect(html).toContain('text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ffe088]');
    expect(html).toContain('mk-display-font mt-1.5 line-clamp-2 text-lg font-semibold leading-snug sm:text-xl');
    expect(html).toContain('Humanoids');
    expect(html).toContain('Drones');
    expect(html).toContain('Cleaners');
    expect(html).toContain('Vacuums');
    expect(html).not.toContain('rounded-full bg-[var(--mk-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#241a00]');
    expect(html).not.toContain('rounded-full border border-white/50 bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur');
    expect(html).not.toContain('mk-display-font mt-2 line-clamp-2 text-2xl font-semibold leading-tight');
    expect(html).not.toContain('absolute left-4 right-4 top-4 flex justify-end');
    expect(html).not.toContain('object-contain p-6');
    expect(html).not.toContain('aspect-[9/13]');
    expect(html).not.toContain('bg-[#07111f] py-10 text-white sm:py-12');
    expect(html).not.toContain('bg-white/16');
    expect(html).not.toContain('p-4\"><h3 class=\"text-sm font-semibold text-[var(--mk-text)]');
    expect(html).not.toContain('empty-slot');
  });

  it('renders recommended products as autoplay matrix carousel without manual controls when more than five products exist', () => {
    const html = renderToStaticMarkup(
      <HomepageProductMatrix
        locale="en"
        eyebrow="Product Gallery"
        title="More Product Images"
        viewAllLabel="View all"
        products={carouselProducts}
      />
    );

    expect(html).toContain('Sensor Kit');
    expect(html).toContain('/en/products/sensor');
    expect(html).toContain('data-product-carousel="true"');
    expect(html).toContain('data-product-autoplay-interval="4000"');
    expect(html).toContain('grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[220px]');
    expect(html).toContain('md:col-span-8 md:row-span-2');
    expect(html).toContain('md:col-span-8');
    expect(html).not.toContain('xl:basis-1/5');
    expect(html).not.toContain('aria-label="Previous product"');
    expect(html).not.toContain('aria-label="Next product"');
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
    expect(html).toContain('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8');
    expect(html).not.toContain('class="mk-container"');
    expect(html).toContain('bg-[var(--mk-bg)] py-12 sm:py-16');
    expect(html).toContain('overflow-x-auto pb-2');
    expect(html).toContain('grid min-w-[940px] gap-5 md:grid-cols-4');
    expect(html).toContain('relative aspect-[9/16] overflow-hidden rounded-[22px] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_20px_48px_rgba(112,89,81,0.12)]');
    expect(html).toContain('absolute left-3 top-3 rounded-full bg-white/88 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mk-accent)] backdrop-blur');
    expect(html).toContain('absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#201a19]/88 via-[#705951]/35 to-transparent p-4 pt-16 text-white');
    expect(html).toContain('Instagram');
    expect(html).toContain('YouTube');
    expect(html).toContain('LinkedIn');
    expect(html).toContain('Facebook');
    expect(html).toContain('mk-display-font mt-2 text-lg font-semibold leading-tight');
    expect(html).not.toContain('previous-social-card');
    expect(html).not.toContain('next-social-card');
    expect(html).not.toContain('lg:auto-rows-[220px]');
    expect(html).not.toContain('sm:col-span-2 lg:col-span-2 lg:row-span-2');
    expect(html).not.toContain('absolute inset-0 bg-gradient-to-t from-[#061b38]/84 via-[#0f63ce]/14 to-transparent');
  });
});
