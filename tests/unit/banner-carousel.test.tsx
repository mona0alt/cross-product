import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { BannerCarousel } from '@/components/storefront/banner-carousel';

describe('BannerCarousel', () => {
  it('renders a full-bleed image carousel with hero copy', () => {
    const html = renderToStaticMarkup(
      <BannerCarousel
        banners={[
          {
            id: 'banner-1',
            imageUrl: '/show/robot_humanoid.png',
            targetType: 'url',
            targetId: null,
            targetUrl: null,
            sortOrder: 1
          }
        ]}
        emptyLabel="No banners"
        copy={{
          eyebrow: 'AI ROBOTICS SHOWCASE',
          title: 'Premium robotics for modern work',
          description: 'Explore intelligent robots for global partners.',
          primaryCta: 'Browse Products',
          secondaryCta: 'Contact Us'
        }}
        primaryHref="/en/products"
        secondaryHref="/en/contact"
      />
    );

    expect(html).toContain('min-h-[calc(100vh-76px)]');
    expect(html).toContain('h-full w-full object-cover');
    expect(html).toContain('/show/robot_humanoid.png');
    expect(html).toContain('AI ROBOTICS SHOWCASE');
    expect(html).toContain('Premium robotics for modern work');
    expect(html).toContain('Browse Products');
    expect(html).toContain('Contact Us');
  });

  it('wraps the active banner with a link when a target url is provided', () => {
    const html = renderToStaticMarkup(
      <BannerCarousel
        banners={[
          {
            id: 'banner-1',
            imageUrl: '/uploads/categories/drone.webp',
            targetType: 'category',
            targetId: 'cat-1',
            targetUrl: '/en/products?category=industrial-drones',
            sortOrder: 1
          }
        ]}
        emptyLabel="No banners"
        copy={{
          eyebrow: 'AI ROBOTICS SHOWCASE',
          title: 'Premium robotics for modern work',
          description: 'Explore intelligent robots for global partners.',
          primaryCta: 'Browse Products',
          secondaryCta: 'Contact Us'
        }}
        primaryHref="/en/products"
        secondaryHref="/en/contact"
      />
    );

    expect(html).toContain('href="/en/products?category=industrial-drones"');
    expect(html).toContain('data-testid="banner-link"');
    expect(html).toContain('/uploads/categories/drone.webp');
  });
});
