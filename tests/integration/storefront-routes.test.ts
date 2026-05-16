import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getHomepagePayload = vi.fn();
const getProductListPayload = vi.fn();
const getProductDetailBySlug = vi.fn();

vi.mock('@/features/catalog/queries', () => ({
  getHomepagePayload,
  getProductListPayload,
  getProductDetailBySlug
}));

vi.mock('@/features/admin/system-settings-actions', () => ({
  getRuntimeSystemSettings: vi.fn().mockResolvedValue({
    contact: {
      whatsappNumber: '15551234567'
    },
    email: {
      mailFrom: 'support@fbgm.com',
      smtpHost: '',
      smtpPort: 465,
      smtpPassword: ''
    },
    llm: {
      provider: 'OpenAI compatible',
      model: 'gpt-4o-mini',
      apiBaseUrl: 'https://api.openai.com/v1',
      apiKey: ''
    },
    upload: {
      productSegment: 'products',
      categorySegment: 'categories',
      bannerSegment: 'banners'
    }
  })
}));

describe('storefront routes', () => {
  beforeEach(() => {
    getHomepagePayload.mockReset();
    getProductListPayload.mockReset();
    getProductDetailBySlug.mockReset();
  });

  it('renders the localized homepage', async () => {
    getHomepagePayload.mockResolvedValue({
      banners: [
        {
          id: 'banner-1',
          imageUrl: '/legacy-banner.jpg',
          targetType: 'product',
          targetId: 'product-1',
          targetUrl: null,
          sortOrder: 1
        }
      ],
      featuredCategories: [
        {
          id: 'cat-1',
          slug: 'electronics',
          iconImageUrl: '/electronics.svg',
          name: 'Electronics',
          description: 'Devices'
        },
        {
          id: 'cat-2',
          slug: 'drones',
          iconImageUrl: '/drones.svg',
          name: 'Drones',
          description: 'Flying robots'
        }
      ],
      recommendedProducts: [
        {
          id: 'product-1',
          slug: 'star-river-pro-phone',
          productCode: 'P-1001',
          coverImageUrl: '/phone.jpg',
          priceUsd: 699,
          isRecommended: true,
          name: 'Star River Pro Phone',
          intro: 'Flagship phone',
          detail: 'Full detail',
          images: ['/phone.jpg'],
          category: {
            slug: 'electronics',
            name: 'Electronics'
          }
        }
      ]
    });

    const HomePage = (await import('@/app/[locale]/page')).default;
    const html = renderToStaticMarkup(
      await HomePage({
        params: Promise.resolve({ locale: 'en' })
      })
    );

    expect(html).toContain('Star River Pro Phone');
    expect(html).toContain('Electronics');
    expect(html).toContain('/electronics.svg');
    expect(html).toContain('href="/en/products?category=electronics"');
    expect(html).not.toContain('/legacy-banner.jpg');
    expect(html).toContain('Product Series');
    expect(html).toContain('More Product Images');
    expect(html).toContain('Social Media #FBGM');
    expect(html).not.toContain('UNMISSABLE OFFERS');
    expect(html).not.toContain('Catalog: Window Cleaning Robots');
    expect(html).not.toContain('Catálogo Pisos y Muros');
    expect(html).not.toContain('VER LOS CATÁLOGOS');
    expect(html).not.toContain('Stock Disponible');
    expect(html).not.toContain('INSPÍRATE CON PROYECTOS REALES');
  });

  it('renders the localized product list page', async () => {
    getProductListPayload.mockResolvedValue({
      filters: {
        search: 'phone',
        sort: 'price-desc'
      },
      categoryGroups: [
        {
          id: 'cat-1',
          slug: 'electronics',
          iconImageUrl: '/electronics.svg',
          name: 'Electronics',
          description: 'Devices',
          children: [
            {
              id: 'cat-2',
              slug: 'electronics-phones',
              iconImageUrl: '/phones.svg',
              name: 'Phones',
              description: 'Phones'
            }
          ]
        }
      ],
      products: [
        {
          id: 'product-1',
          slug: 'star-river-pro-phone',
          productCode: 'P-1001',
          coverImageUrl: '/phone.jpg',
          priceUsd: 699,
          isRecommended: true,
          name: 'Star River Pro Phone',
          intro: 'Flagship phone',
          detail: 'Full detail',
          images: ['/phone.jpg'],
          category: {
            slug: 'electronics',
            name: 'Electronics'
          }
        }
      ]
    });

    const ProductsPage = (await import('@/app/[locale]/products/page')).default;
    const html = renderToStaticMarkup(
      await ProductsPage({
        params: Promise.resolve({ locale: 'en' }),
        searchParams: Promise.resolve({
          search: 'phone',
          sort: 'price-desc'
        })
      })
    );

    expect(html).toContain('Star River Pro Phone');
    expect(html).toContain('phone');
    expect(html).toContain('bg-[#f4f0ed] py-6 sm:py-8 lg:py-10');
    expect(html).toContain('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8');
    expect(html).toContain('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4');
    expect(html).toContain('rounded-[24px] border border-[#d8cec7] bg-white/90');
    expect(html).toContain('relative block aspect-[5/6] overflow-hidden rounded-[20px] bg-[#f3efec]');
    expect(html).toContain('class="flex flex-1 flex-col px-2 pb-2 pt-3');
    expect(html).toContain('href="/en/products/star-river-pro-phone"');
    expect(html).not.toContain('Filters');
    expect(html).not.toContain('Catalog');
    expect(html).not.toContain('Products');
    expect(html).not.toContain('View details');
    expect(html).not.toContain('Browse products');
    expect(html).not.toContain('Sort by');
    expect(html).not.toContain('name="sort"');
    expect(html).not.toContain('P-1001');
    expect(html).not.toContain('In stock');
    expect(html).not.toContain('$699');
    expect(getProductListPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'phone',
        sort: 'price-desc'
      }),
      'en'
    );
  });

  it('renders published product details and throws 404 for missing slug', async () => {
    getProductDetailBySlug.mockResolvedValueOnce({
      id: 'product-1',
      slug: 'star-river-pro-phone',
      productCode: 'P-1001',
      coverImageUrl: '/phone.jpg',
      priceUsd: 699,
      isRecommended: true,
      name: 'Star River Pro Phone',
      intro: 'Flagship phone',
      detail: 'Full detail',
      images: ['/phone.jpg', '/phone-2.jpg'],
      category: {
        slug: 'electronics',
        name: 'Electronics'
      }
    });
    getHomepagePayload.mockResolvedValue({
      banners: [],
      featuredCategories: [],
      recommendedProducts: [
        {
          id: 'product-2',
          slug: 'related-phone',
          productCode: 'P-1002',
          coverImageUrl: '/related.jpg',
          priceUsd: 499,
          isRecommended: true,
          name: 'Related Phone',
          intro: 'Related intro',
          detail: 'Related detail',
          images: ['/related.jpg'],
          category: {
            slug: 'electronics',
            name: 'Electronics'
          }
        }
      ]
    });

    const ProductDetailPage =
      (await import('@/app/[locale]/products/[slug]/page')).default;
    const html = renderToStaticMarkup(
      await ProductDetailPage({
        params: Promise.resolve({ locale: 'en', slug: 'star-river-pro-phone' })
      })
    );

    expect(html).toContain('Star River Pro Phone');
    expect(html).toContain('Flagship phone');
    expect(html).toContain('Full detail');
    expect(html).toContain('WhatsApp');
    expect(html).toContain('href="https://wa.me/15551234567?text=Star%20River%20Pro%20Phone"');
    expect(html).toContain('href="/en/subscribe"');
    expect(html).not.toContain('Gallery');
    expect(html).not.toContain('P-1001');
    expect(html).not.toContain('$699');
    expect(html).not.toContain('Recommended only');
    expect(html).not.toContain('View details');
    expect(html).not.toContain('Related Products');
    expect(html).not.toContain('Related Phone');
    expect(getHomepagePayload).not.toHaveBeenCalled();

    getProductDetailBySlug.mockResolvedValueOnce(null);

    await expect(
      ProductDetailPage({
        params: Promise.resolve({ locale: 'en', slug: 'missing-slug' })
      })
    ).rejects.toMatchObject({
      digest: 'NEXT_HTTP_ERROR_FALLBACK;404'
    });
  });

  it('renders contact, subscribe, and portal support pages', async () => {
    const ContactPage = (await import('@/app/[locale]/contact/page')).default;
    const SubscribePage = (await import('@/app/[locale]/subscribe/page')).default;
    const PortalPage = (await import('@/app/[locale]/portal/page')).default;

    const contactHtml = renderToStaticMarkup(
      await ContactPage({
        params: Promise.resolve({ locale: 'en' })
      })
    );
    const subscribeHtml = renderToStaticMarkup(
      await SubscribePage({
        params: Promise.resolve({ locale: 'en' })
      })
    );
    const portalHtml = renderToStaticMarkup(
      await PortalPage({
        params: Promise.resolve({ locale: 'en' })
      })
    );

    expect(contactHtml).toContain('Contact and message');
    expect(contactHtml).toContain('support@fbgm.com');
    expect(contactHtml).toContain('Send');
    expect(subscribeHtml).toContain('Subscribe for updates');
    expect(subscribeHtml).toContain('Subscribe');
    expect(portalHtml).toContain('Help Center');
    expect(portalHtml).toContain('support@fbgm.com');
    expect(portalHtml).toContain('Back to home');
  });
});
