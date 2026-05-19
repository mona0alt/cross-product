import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { BannerCarousel } from '@/components/storefront/banner-carousel';

describe('BannerCarousel', () => {
  it('renders a full-bleed image carousel with banner copy', () => {
    const html = renderToStaticMarkup(
      <BannerCarousel
        banners={[
          {
            id: 'banner-1',
            imageUrl: '/show/robot_humanoid.png',
            targetType: 'url',
            targetId: null,
            targetUrl: null,
            sortOrder: 1,
            title: 'Humanoid Robots',
            description: 'Configurable humanoid category description'
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
    expect(html).toContain('Humanoid Robots');
    expect(html).toContain('Configurable humanoid category description');
    expect(html).not.toContain('Premium robotics for modern work');
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

  it('uses banner-specific title and description when provided', () => {
    const html = renderToStaticMarkup(
      <BannerCarousel
        banners={[
          {
            id: 'banner-1',
            imageUrl: '/uploads/categories/drone.webp',
            targetType: 'category',
            targetId: 'cat-1',
            targetUrl: '/en/products?category=industrial-drones',
            sortOrder: 1,
            title: 'Industrial Drones',
            description: 'Configurable category description'
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

    expect(html).toContain('Industrial Drones');
    expect(html).toContain('Configurable category description');
    expect(html).not.toContain('AI ROBOTICS SHOWCASE');
    expect(html).not.toContain('Premium robotics for modern work');
    expect(html).not.toContain('Explore intelligent robots for global partners.');
  });

  it('does not render default hero copy when banner-specific text is missing', () => {
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

    expect(html).not.toContain('AI ROBOTICS SHOWCASE');
    expect(html).not.toContain('Premium robotics for modern work');
    expect(html).not.toContain('Explore intelligent robots for global partners.');
    expect(html).not.toContain('Browse Products');
    expect(html).not.toContain('Contact Us');
  });

  it('does not render banner copy when either title or description is missing', () => {
    const html = renderToStaticMarkup(
      <BannerCarousel
        banners={[
          {
            id: 'banner-1',
            imageUrl: '/uploads/categories/drone.webp',
            targetType: 'category',
            targetId: 'cat-1',
            targetUrl: '/en/products?category=industrial-drones',
            sortOrder: 1,
            title: 'Industrial Drones',
            description: null
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

    expect(html).not.toContain('Industrial Drones');
    expect(html).not.toContain('AI ROBOTICS SHOWCASE');
    expect(html).not.toContain('Premium robotics for modern work');
  });

  it('enables autoplay when multiple banners are available', () => {
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
          },
          {
            id: 'banner-2',
            imageUrl: '/show/robot_drone.png',
            targetType: 'url',
            targetId: null,
            targetUrl: null,
            sortOrder: 2
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

    expect(html).toContain('data-banner-autoplay="true"');
    expect(html).toContain('data-banner-autoplay-interval="5000"');
    expect(html).toContain('aria-label="prev-banner"');
    expect(html).toContain('aria-label="next-banner"');
  });
});
