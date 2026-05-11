import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HeroShowcase } from '@/components/storefront/hero-showcase';

describe('HeroShowcase', () => {
  it('passes hero copy through to the banner carousel', () => {
    const html = renderToStaticMarkup(
      <HeroShowcase
        locale="en"
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
        copy={{
          eyebrow: 'AI ROBOTICS SHOWCASE',
          title: 'Premium robotics',
          description: 'Robotics for modern work.',
          primaryCta: 'Browse Products',
          secondaryCta: 'Contact Us',
          highlights: ['Drones', 'Humanoids'],
          emptyBannerLabel: 'No banners'
        }}
      />
    );

    expect(html).toContain('AI ROBOTICS SHOWCASE');
    expect(html).toContain('Premium robotics');
    expect(html).toContain('/en/products');
    expect(html).toContain('/en/contact');
  });
});
