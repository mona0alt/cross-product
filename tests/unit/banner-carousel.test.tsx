import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { BannerCarousel } from '@/components/storefront/banner-carousel';

describe('BannerCarousel', () => {
  it('renders the blue flagship hero copy and calls to action', () => {
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

    expect(html).toContain('AI ROBOTICS SHOWCASE');
    expect(html).toContain('Premium robotics for modern work');
    expect(html).toContain('Browse Products');
    expect(html).toContain('/en/products');
    expect(html).toContain('/show/robot_humanoid.png');
  });
});
