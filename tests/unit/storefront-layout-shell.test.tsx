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
  it('renders the retail header utility bar and quick actions', () => {
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

    expect(html).toContain('Blog');
    expect(html).toContain('Phone sales +1 555 123 4567');
    expect(html).toContain('Track order');
    expect(html).toContain('Help Center');
    expect(html).toContain('Language:en');
    expect(html).toContain('Floors &amp; Walls');
    expect(html).toContain('Search products');
    expect(html).not.toContain('Sigue tu compra');
  });

  it('renders the expanded footer sections', () => {
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

    expect(html).toContain('Retail storefront.');
    expect(html).toContain('Help');
    expect(html).toContain('Portal');
    expect(html).toContain('WhatsApp');
    expect(html).toContain('Contact');
    expect(html).toContain('Phone sales: +1 555 123 4567');
    expect(html).toContain('Payment methods');
    expect(html).not.toContain('Medios de pago');
  });
});
