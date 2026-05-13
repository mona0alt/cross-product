import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { StorefrontFooter } from '@/components/storefront/footer';
import { StorefrontHeader } from '@/components/storefront/header';

vi.mock('@/components/storefront/language-switcher', () => ({
  LanguageSwitcher: ({
    currentLocale,
    label
  }: {
    currentLocale: string;
    label: string;
  }) => <div>{`${label}:${currentLocale}`}</div>
}));

describe('storefront layout shell', () => {
  it('renders a single dark enterprise header without storefront search', () => {
    const html = renderToStaticMarkup(
      <StorefrontHeader
        locale="en"
        whatsAppNumber="+1 555 123 4567"
        categoryGroups={[
          {
            id: 'group-1',
            slug: 'floors-walls',
            iconImageUrl: null,
            name: 'Floors & Walls',
            description: 'Flooring',
            children: [
              {
                id: 'child-1',
                slug: 'vinyl',
                iconImageUrl: null,
                name: 'Vinyl',
                description: 'Vinyl floors'
              }
            ]
          }
        ]}
        copy={{
          brand: 'Cross',
          nav: {
            home: 'Home',
            products: 'Products',
            contact: 'Contact',
            subscribe: 'Subscribe'
          },
          searchPlaceholder: 'Search products',
          portal: 'Portal',
          whatsApp: 'WhatsApp',
          languageLabel: 'Language',
          topLinks: {
            blog: 'Blog',
            studio: 'Studio MK',
            professionals: 'MK Pros'
          },
          phoneSales: 'Phone sales',
          utilityBar: {
            support: 'Support',
            service: 'Customer Service'
          },
          quickActions: {
            trackOrder: 'Track order',
            stores: 'Stores',
            helpCenter: 'Help Center',
            account: 'My account'
          },
          featuredNav: {
            inspiration: 'Inspiration',
            outlet: 'Outlet'
          },
          categoryPromo: {
            viewAll: 'View all',
            offerTitle: 'Offers',
            offerLink: 'Last chance',
            featuredTitle: 'Featured',
            featuredDescription: 'Discover best sellers'
          }
        }}
      />
    );

    expect(html).toContain('data-testid="storefront-header-shell"');
    expect(html).toContain('bg-[#07111f]');
    expect(html).not.toContain('bg-[#f0f6fd]');
    expect(html).toContain('Phone sales +1 555 123 4567');
    expect(html).not.toContain('Blog');
    expect(html).not.toContain('Studio MK');
    expect(html).not.toContain('MK Pros');
    expect(html).toContain('Language:en');
    expect(html).toContain('Floors &amp; Walls');
    expect(html).not.toContain('Portal');
    expect(html).toContain('WhatsApp');
    expect(html).not.toContain('Search products');
    expect(html).not.toContain('Track order');
    expect(html).not.toContain('Help Center');
    expect(html).not.toContain('Sigue tu compra');
  });

  it('renders desktop category navigation as a full-width hover mega menu', () => {
    const html = renderToStaticMarkup(
      <StorefrontHeader
        locale="en"
        whatsAppNumber="+1 555 123 4567"
        categoryGroups={[
          {
            id: 'group-1',
            slug: 'commercial',
            iconImageUrl: '/show/robot_industrial_arm.png',
            name: 'Commercial',
            description: 'Business robotics',
            children: [
              {
                id: 'child-1',
                slug: 'education',
                iconImageUrl: '/show/robot_humanoid.png',
                name: 'AI Education',
                description: 'Robots for classrooms'
              },
              {
                id: 'child-2',
                slug: 'cleaning',
                iconImageUrl: '/show/robot_floor_cleaner.png',
                name: 'Cleaning',
                description: 'Facility automation'
              }
            ]
          }
        ]}
        copy={{
          brand: 'Cross',
          nav: {
            home: 'Home',
            products: 'Products',
            contact: 'Contact',
            subscribe: 'Subscribe'
          },
          searchPlaceholder: 'Search products',
          portal: 'Portal',
          whatsApp: 'WhatsApp',
          languageLabel: 'Language',
          topLinks: {
            blog: 'Blog',
            studio: 'Studio MK',
            professionals: 'MK Pros'
          },
          phoneSales: 'Phone sales',
          utilityBar: {
            support: 'Support',
            service: 'Customer Service'
          },
          quickActions: {
            trackOrder: 'Track order',
            stores: 'Stores',
            helpCenter: 'Help Center',
            account: 'My account'
          },
          featuredNav: {
            inspiration: 'Inspiration',
            outlet: 'Outlet'
          },
          categoryPromo: {
            viewAll: 'View all',
            offerTitle: 'Offers',
            offerLink: 'Last chance',
            featuredTitle: 'Featured',
            featuredDescription: 'Discover best sellers'
          }
        }}
      />
    );

    expect(html).toContain('data-testid="desktop-mega-menu"');
    expect(html).toContain('left-1/2');
    expect(html).toContain('w-screen');
    expect(html).toContain('group-hover:opacity-100');
    expect(html).toContain('self-stretch');
    expect(html).toContain('items-center');
    expect(html).toContain('h-10');
    expect(html).toContain('text-[13px]');
    expect(html).toContain('tracking-[0.04em]');
    expect(html).toContain('bg-[#07111f] text-white');
    expect(html).toContain('lg:grid-cols-4');
    expect(html).toContain('absolute inset-x-0 bottom-0');
    expect(html).toContain('bg-transparent');
    expect(html).not.toContain('bg-gradient-to-t');
    expect(html).not.toContain('backdrop-blur');
    expect(html).not.toContain('bg-[#07111f]/76');
    expect(html).not.toContain('min-h-[104px]');
    expect(html).not.toContain('Business robotics');
    expect(html).not.toContain('View all Commercial');
    expect(html).not.toContain('bg-white text-[var(--mk-text)]');
    expect(html).toContain('AI Education');
    expect(html).toContain('Robots for classrooms');
  });

  it('keeps a hover dropdown for top-level categories without child items', () => {
    const html = renderToStaticMarkup(
      <StorefrontHeader
        locale="en"
        whatsAppNumber="+1 555 123 4567"
        categoryGroups={[
          {
            id: 'group-1',
            slug: 'industrial-drones',
            iconImageUrl: '/uploads/categories/drone.webp',
            name: 'Industrial Drones',
            description: 'Industrial drone systems',
            children: []
          }
        ]}
        copy={{
          brand: 'Cross',
          nav: {
            home: 'Home',
            products: 'Products',
            contact: 'Contact',
            subscribe: 'Subscribe'
          },
          searchPlaceholder: 'Search products',
          portal: 'Portal',
          whatsApp: 'WhatsApp',
          languageLabel: 'Language',
          topLinks: {
            blog: 'Blog',
            studio: 'Studio MK',
            professionals: 'MK Pros'
          },
          phoneSales: 'Phone sales',
          utilityBar: {
            support: 'Support',
            service: 'Customer Service'
          },
          quickActions: {
            trackOrder: 'Track order',
            stores: 'Stores',
            helpCenter: 'Help Center',
            account: 'My account'
          },
          featuredNav: {
            inspiration: 'Inspiration',
            outlet: 'Outlet'
          },
          categoryPromo: {
            viewAll: 'View all',
            offerTitle: 'Offers',
            offerLink: 'Last chance',
            featuredTitle: 'Featured',
            featuredDescription: 'Discover best sellers'
          }
        }}
      />
    );

    expect(html).toContain('data-testid="desktop-mega-menu"');
    expect(html).toContain('/en/categories/industrial-drones');
    expect(html).toContain('/uploads/categories/drone.webp');
    expect(html).toContain('Industrial Drones');
    expect(html).toContain('Industrial drone systems');
  });

  it('renders every configured backend category in the desktop navigation', () => {
    const html = renderToStaticMarkup(
      <StorefrontHeader
        locale="en"
        whatsAppNumber="+1 555 123 4567"
        categoryGroups={[
          {
            id: 'group-1',
            slug: 'window-cleaning-robots',
            iconImageUrl: null,
            name: 'Window Cleaning Robots',
            description: 'Windows',
            children: []
          },
          {
            id: 'group-2',
            slug: 'drones',
            iconImageUrl: null,
            name: 'Drones',
            description: 'Drones',
            children: []
          },
          {
            id: 'group-3',
            slug: 'humanoid-robots',
            iconImageUrl: null,
            name: 'Humanoid Robots',
            description: 'Humanoids',
            children: []
          },
          {
            id: 'group-4',
            slug: 'robot-vacuums',
            iconImageUrl: null,
            name: 'Vacuum Robots',
            description: 'Vacuum',
            children: []
          },
          {
            id: 'group-5',
            slug: 'robot-dogs',
            iconImageUrl: null,
            name: 'Robot Dogs',
            description: 'Robot dogs',
            children: []
          },
          {
            id: 'group-6',
            slug: 'industrial-arms',
            iconImageUrl: null,
            name: 'Industrial Arms',
            description: 'Industrial arms',
            children: []
          }
        ]}
        copy={{
          brand: 'Cross',
          nav: {
            home: 'Home',
            products: 'Products',
            contact: 'Contact',
            subscribe: 'Subscribe'
          },
          searchPlaceholder: 'Search products',
          portal: 'Portal',
          whatsApp: 'WhatsApp',
          languageLabel: 'Language',
          topLinks: {
            blog: 'Blog',
            studio: 'Studio MK',
            professionals: 'MK Pros'
          },
          phoneSales: 'Phone sales',
          utilityBar: {
            support: 'Support',
            service: 'Customer Service'
          },
          quickActions: {
            trackOrder: 'Track order',
            stores: 'Stores',
            helpCenter: 'Help Center',
            account: 'My account'
          },
          featuredNav: {
            inspiration: 'Inspiration',
            outlet: 'Outlet'
          },
          categoryPromo: {
            viewAll: 'View all',
            offerTitle: 'Offers',
            offerLink: 'Last chance',
            featuredTitle: 'Featured',
            featuredDescription: 'Discover best sellers'
          }
        }}
      />
    );

    expect(html).toContain('Window Cleaning Robots');
    expect(html).toContain('Drones');
    expect(html).toContain('Humanoid Robots');
    expect(html).toContain('Vacuum Robots');
    expect(html).toContain('Robot Dogs');
    expect(html).toContain('Industrial Arms');
    expect(html).toContain('/en/products?category=industrial-arms');
  });

  it('renders the dark enterprise footer sections', () => {
    const html = renderToStaticMarkup(
      <StorefrontFooter
        locale="en"
        whatsAppNumber="+1 555 123 4567"
        copy={{
          brand: 'Cross',
          nav: {
            home: 'Home',
            products: 'Products',
            contact: 'Contact',
            subscribe: 'Subscribe'
          },
          portal: 'Portal',
          whatsApp: 'WhatsApp',
          footer: {
            navigationTitle: 'Catalog',
            tagline: 'Retail storefront.',
            rights: 'Cross. All rights reserved.',
            supportTitle: 'Help',
            supportDescription: 'Talk with our team.',
            contactTitle: 'Contact',
            phoneSales: 'Phone sales',
            businessHours: 'Mon - Fri: 09:00 - 18:00',
            helpCenter: 'Help Center',
            paymentMethods: 'Payment methods'
          }
        }}
      />
    );

    expect(html).toContain('data-testid="storefront-footer-shell"');
    expect(html).toContain('bg-[#07111f]');
    expect(html).not.toContain('mt-12 border-t border-white/10 bg-[#07111f]');
    expect(html).toContain('Retail storefront.');
    expect(html).toContain('Help');
    expect(html).not.toContain('Portal');
    expect(html).toContain('WhatsApp');
    expect(html).toContain('Contact');
    expect(html).toContain('Phone sales: +1 555 123 4567');
    expect(html).not.toContain('Cross. All rights reserved.');
    expect(html).not.toContain('Payment methods');
    expect(html).not.toContain('Medios de pago');
  });
});
