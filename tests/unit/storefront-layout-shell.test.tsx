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
          utilityBar: {
            support: 'Support',
            service: 'Customer Service'
          }
        }}
      />
    );

    expect(html).toContain('Support');
    expect(html).toContain('Customer Service');
    expect(html).toContain('Portal');
    expect(html).toContain('WhatsApp');
    expect(html).toContain('Search products');
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
            supportDescription: 'Talk with our team.'
          }
        }}
      />
    );

    expect(html).toContain('Retail storefront.');
    expect(html).toContain('Help');
    expect(html).toContain('Portal');
    expect(html).toContain('WhatsApp');
  });
});
