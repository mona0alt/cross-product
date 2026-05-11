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
          imageUrl: '/banner.jpg',
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
    expect(html).toContain('Premium robotics for modern work');
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
        search: 'phone'
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
          search: 'phone'
        })
      })
    );

    expect(html).toContain('Star River Pro Phone');
    expect(html).toContain('phone');
    expect(html).toContain('Sort by');
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
      recommendedProducts: []
    });

    const ProductDetailPage =
      (await import('@/app/[locale]/products/[slug]/page')).default;
    const html = renderToStaticMarkup(
      await ProductDetailPage({
        params: Promise.resolve({ locale: 'en', slug: 'star-river-pro-phone' })
      })
    );

    expect(html).toContain('Star River Pro Phone');
    expect(html).toContain('P-1001');
    expect(html).toContain('Gallery');

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
    expect(contactHtml).toContain('Support');
    expect(contactHtml).toContain('Send');
    expect(subscribeHtml).toContain('Subscribe for updates');
    expect(subscribeHtml).toContain('Customer Service');
    expect(subscribeHtml).toContain('Subscribe');
    expect(portalHtml).toContain('Client portal is coming soon');
    expect(portalHtml).toContain('Support');
    expect(portalHtml).toContain('Back to storefront');
  });
});
