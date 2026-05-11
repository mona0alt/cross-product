import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { BannerCarousel } from '@/components/storefront/banner-carousel';

describe('BannerCarousel', () => {
  it('renders a full-bleed image carousel without hero copy', () => {
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
    expect(html).not.toContain('AI ROBOTICS SHOWCASE');
    expect(html).not.toContain('Premium robotics for modern work');
    expect(html).not.toContain('Browse Products');
    expect(html).not.toContain('Contact Us');
  });
});
