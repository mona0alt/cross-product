import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn()
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}));

vi.mock('@/lib/i18n/get-dictionary', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    Storefront: {
      brand: 'Cross',
      nav: {
        home: 'Home',
        products: 'Products',
        contact: 'Contact',
        subscribe: 'Subscribe'
      },
      searchPlaceholder: 'Search',
      portal: 'Portal',
      whatsApp: 'WhatsApp',
      language: {
        label: 'Language'
      },
      header: {
        phoneSales: 'Phone sales',
        topLinks: {
          blog: 'Blog',
          studio: 'Studio',
          professionals: 'Pros'
        },
        quickActions: {
          trackOrder: 'Track order',
          stores: 'Stores',
          helpCenter: 'Help Center',
          account: 'Account'
        },
        featuredNav: {
          inspiration: 'Inspiration',
          outlet: 'Outlet'
        },
        categoryPromo: {
          viewAll: 'View all',
          offerTitle: 'Offers',
          offerLink: 'Shop now',
          featuredTitle: 'Featured',
          featuredDescription: 'Best sellers'
        }
      },
      utilityBar: {
        support: 'Support',
        service: 'Service'
      },
      footer: {
        navigationTitle: 'Navigation',
        tagline: 'Tagline',
        rights: 'Rights',
        supportTitle: 'Support',
        supportDescription: 'Description',
        contactTitle: 'Contact',
        phoneSales: 'Phone sales',
        businessHours: '24/7',
        helpCenter: 'Help Center',
        paymentMethods: 'Payments'
      }
    }
  })
}));

vi.mock('@/features/catalog/queries', () => ({
  getStorefrontCategoryGroups: vi.fn().mockResolvedValue([])
}));

vi.mock('@/components/storefront/header', () => ({
  StorefrontHeader: () => <div data-testid="mock-storefront-header" />
}));

vi.mock('@/components/storefront/footer', () => ({
  StorefrontFooter: () => <div data-testid="mock-storefront-footer" />
}));

vi.mock('@/components/storefront/floating-whatsapp-button', () => ({
  StorefrontFloatingWhatsAppButton: ({
    whatsAppLabel,
    whatsAppNumber
  }: {
    whatsAppLabel: string;
    whatsAppNumber: string;
  }) => (
    <div data-testid="mock-floating-whatsapp-button">
      {`${whatsAppLabel}:${whatsAppNumber}`}
    </div>
  )
}));

describe('storefront locale layout', () => {
  it('injects the floating WhatsApp CTA into the shared non-admin shell', async () => {
    const LocaleLayout = (await import('@/app/[locale]/layout')).default;
    const html = renderToStaticMarkup(
      await LocaleLayout({
        children: <div>page</div>,
        params: Promise.resolve({ locale: 'en' })
      })
    );

    expect(html).toContain('data-testid="mock-storefront-header"');
    expect(html).toContain('data-testid="mock-floating-whatsapp-button"');
    expect(html).toContain('WhatsApp:15551234567');
    expect(html).toContain('data-testid="mock-storefront-footer"');
  });
});
