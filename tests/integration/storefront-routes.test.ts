import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getHomepagePayload = vi.fn();
const getProductListPayload = vi.fn();
const getProductDetailBySlug = vi.fn();
const getRecommendedProducts = vi.fn();
const getSocialShowcasePosts = vi.fn();

vi.mock('@/features/catalog/queries', () => ({
  getHomepagePayload,
  getProductListPayload,
  getProductDetailBySlug,
  getRecommendedProducts,
  getSocialShowcasePosts
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
    getRecommendedProducts.mockReset();
    getSocialShowcasePosts.mockReset();
    getSocialShowcasePosts.mockResolvedValue([]);
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
      rootCategories: [
        {
          id: 'cat-1',
          slug: 'electronics',
          iconImageUrl: '/electronics.svg',
          name: 'Electronics',
          description: 'Configurable electronics hero copy'
        },
        {
          id: 'cat-2',
          slug: 'drones',
          iconImageUrl: '/drones.svg',
          name: 'Drones',
          description: 'Flying robots'
        }
      ],
      featuredCategories: [
        {
          id: 'cat-1',
          slug: 'electronics',
          iconImageUrl: '/electronics.svg',
          name: 'Electronics',
          description: 'Configurable electronics hero copy'
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
    getSocialShowcasePosts.mockResolvedValue([
      {
        id: 'social-1',
        platform: 'instagram',
        imageUrl: '/show/social.jpg',
        targetUrl: 'https://www.instagram.com/fbgm_decomaterial'
      }
    ]);
    const html = renderToStaticMarkup(
      await HomePage({
        params: Promise.resolve({ locale: 'en' })
      })
    );

    expect(html).toContain('Star River Pro Phone');
    expect(html).toContain('Electronics');
    expect(html).toContain('Configurable electronics hero copy');
    expect(html).toContain('/electronics.svg');
    expect(html).toContain('href="/en/categories/electronics"');
    expect(html).not.toContain('/legacy-banner.jpg');
    expect(html).not.toContain('Premium robotics for modern work');
    expect(html).toContain('Product Series');
    expect(html).toContain('More Product Images');
    expect(html).toContain('Social Media #FBGM');
    expect(html).toContain('href="https://www.instagram.com/fbgm_decomaterial"');
    expect(html).toContain('/show/social.jpg');
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
          category: 'electronics',
          subcategory: 'electronics-phones',
          sort: 'price-desc'
        })
      })
    );

    expect(html).toContain('Star River Pro Phone');
    expect(html).toContain('phone');
    expect(html).toContain('flex-1 bg-[var(--mk-bg)] py-6 sm:py-8 lg:py-10');
    expect(html).toContain('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8');
    expect(html).toContain('grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]');
    expect(html).toContain('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4');
    expect(html).toContain('rounded-[24px] border border-[#d8cec7] bg-white/90');
    expect(html).toContain('relative block aspect-[5/6] overflow-hidden rounded-[20px] bg-[#f3efec]');
    expect(html).toContain('class="flex flex-1 flex-col px-2 pb-2 pt-3');
    expect(html).toContain('href="/en/products/star-river-pro-phone"');
    expect(html).toContain('Filters');
    expect(html).toContain('name="search"');
    expect(html).toContain('value="phone"');
    expect(html).toContain('name="category"');
    expect(html).toContain('<input type="hidden" name="category" value="electronics"/>');
    expect(html).toContain('name="subcategory"');
    expect(html).toContain('<input type="hidden" name="subcategory" value="electronics-phones"/>');
    expect(html).toContain('Electronics');
    expect(html).toContain('Phones');
    expect(html).toContain('name="recommended"');
    expect(html).not.toContain('name="sort"');
    expect(html).not.toContain('Sort by');
    expect(html).not.toContain('Price: high to low');
    expect(html).not.toContain('Catalog');
    expect(html).not.toContain('View details');
    expect(html).not.toContain('Browse products');
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

  it('falls back to the primary category when subcategory is empty', async () => {
    getProductListPayload.mockResolvedValue({
      filters: {},
      categoryGroups: [],
      products: []
    });

    const ProductsPage = (await import('@/app/[locale]/products/page')).default;
    renderToStaticMarkup(
      await ProductsPage({
        params: Promise.resolve({ locale: 'en' }),
        searchParams: Promise.resolve({
          category: 'electronics',
          subcategory: ''
        })
      })
    );

    expect(getProductListPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        categorySlug: 'electronics'
      }),
      'en'
    );
  });

  it('does not render default homepage hero copy when category hero text is incomplete', async () => {
    getHomepagePayload.mockResolvedValue({
      banners: [],
      rootCategories: [
        {
          id: 'cat-1',
          slug: 'electronics',
          iconImageUrl: '/electronics.svg',
          name: 'Electronics',
          description: null
        }
      ],
      featuredCategories: [
        {
          id: 'cat-1',
          slug: 'electronics',
          iconImageUrl: '/electronics.svg',
          name: 'Electronics',
          description: null
        }
      ],
      recommendedProducts: []
    });

    const HomePage = (await import('@/app/[locale]/page')).default;
    const html = renderToStaticMarkup(
      await HomePage({
        params: Promise.resolve({ locale: 'en' })
      })
    );

    expect(html).toContain('/electronics.svg');
    expect(html).not.toContain('Premium robotics for modern work');
    expect(html).not.toContain('Explore intelligent robots, drones and automation products built for global partners.');
    expect(html).not.toContain('Browse Products');
    expect(html).not.toContain('Contact Us');
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
        name: 'Electronics',
        parent: {
          slug: 'industrial-drones',
          name: 'Industrial Drones'
        }
      }
    });
    getRecommendedProducts.mockResolvedValueOnce([
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
    ]);
    getHomepagePayload.mockResolvedValue({
      banners: [],
      rootCategories: [],
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

    const breadcrumbStart = html.indexOf('aria-label="breadcrumb"');
    expect(breadcrumbStart).toBeGreaterThan(-1);
    const breadcrumb = html.slice(breadcrumbStart, html.indexOf('</nav>'));
    expect(breadcrumb).toContain('href="/en"');
    expect(breadcrumb).toContain('href="/en/categories/industrial-drones"');
    expect(breadcrumb).toContain('href="/en/categories/electronics"');
    expect(breadcrumb.indexOf('Industrial Drones')).toBeLessThan(
      breadcrumb.indexOf('Electronics')
    );
    expect(breadcrumb.indexOf('Electronics')).toBeLessThan(
      breadcrumb.indexOf('Star River Pro Phone')
    );

    expect(html).not.toContain('Gallery');
    expect(html).not.toContain('P-1001');
    expect(html).not.toContain('$699');
    expect(html).not.toContain('Recommended only');
    expect(html).not.toContain('View details');
    expect(html).toContain('Recommended Products');
    expect(html).toContain('Related Phone');
    expect(html).toContain('href="/en/products/related-phone"');
    expect(getRecommendedProducts).toHaveBeenCalledWith('en', 'product-1');
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

  it('renders a root category page with breadcrumbs and a child category grid instead of products', async () => {
    getProductListPayload.mockResolvedValue({
      filters: {
        categorySlug: 'electronics',
        sort: 'featured'
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
            },
            {
              id: 'cat-3',
              slug: 'electronics-tablets',
              iconImageUrl: '/tablets.svg',
              name: 'Tablets',
              description: 'Tablets'
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
            slug: 'electronics-phones',
            name: 'Phones'
          }
        }
      ]
    });

    const CategoryPage = (await import('@/app/[locale]/categories/[slug]/page'))
      .default;
    const html = renderToStaticMarkup(
      await CategoryPage({
        params: Promise.resolve({ locale: 'en', slug: 'electronics' }),
        searchParams: Promise.resolve({})
      })
    );

    expect(html).toContain('aria-label="breadcrumb"');
    expect(html).toContain('href="/en"');
    expect(html).toContain('Home');
    expect(html).toContain('Electronics');
    expect(html).toContain('Phones');
    expect(html).toContain('Tablets');
    expect(html).toContain('href="/en/categories/electronics-phones"');
    expect(html).toContain('href="/en/categories/electronics-tablets"');
    expect(html).toContain('mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8');
    // root pages show the child grid, not the product list or filters
    expect(html).not.toContain('Star River Pro Phone');
    expect(html).not.toContain('name="search"');
    expect(html).not.toContain('name="sort"');
    // no duplicate homepage section chrome around the child grid
    expect(html).not.toContain('SHOP BY CATEGORY');
    expect(html).not.toContain('Product Series');
    expect(html.match(/max-w-7xl/g)).toHaveLength(1);
    expect(getProductListPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        categorySlug: 'electronics',
        sort: 'featured'
      }),
      'en'
    );
  });

  it('renders a leaf category page with breadcrumbs and products', async () => {
    getProductListPayload.mockResolvedValue({
      filters: {
        categorySlug: 'electronics-phones',
        sort: 'featured'
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
            slug: 'electronics-phones',
            name: 'Phones'
          }
        }
      ]
    });

    const CategoryPage = (await import('@/app/[locale]/categories/[slug]/page'))
      .default;
    const html = renderToStaticMarkup(
      await CategoryPage({
        params: Promise.resolve({ locale: 'en', slug: 'electronics-phones' }),
        searchParams: Promise.resolve({})
      })
    );

    expect(html).toContain('aria-label="breadcrumb"');
    expect(html).toContain('Star River Pro Phone');
    expect(html).toContain('href="/en/products/star-river-pro-phone"');
    expect(html).not.toContain('name="search"');
    expect(html).not.toContain('name="sort"');

    const breadcrumb =
      html.match(/aria-label="breadcrumb"[\s\S]*?<\/nav>/)?.[0] ?? '';
    expect(breadcrumb).toContain('href="/en"');
    expect(breadcrumb).toContain('Home');
    expect(breadcrumb).toContain('href="/en/categories/electronics"');
    expect(breadcrumb).toContain('Electronics');
    expect(breadcrumb).toContain('Phones');
    expect(breadcrumb.indexOf('Electronics')).toBeLessThan(
      breadcrumb.indexOf('Phones')
    );
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
