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
  });
});
