import { Decimal } from '@prisma/client/runtime/library';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const bannerFindMany = vi.fn();
const categoryFindMany = vi.fn();
const productFindMany = vi.fn();
const productFindFirst = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    banner: {
      findMany: bannerFindMany
    },
    category: {
      findMany: categoryFindMany
    },
    product: {
      findMany: productFindMany,
      findFirst: productFindFirst
    }
  }
}));

describe('catalog queries', () => {
  beforeEach(() => {
    bannerFindMany.mockReset();
    categoryFindMany.mockReset();
    productFindMany.mockReset();
    productFindFirst.mockReset();
  });

  it('builds a localized homepage payload', async () => {
    bannerFindMany.mockResolvedValue([
      {
        id: 'banner-1',
        imageUrl: '/banner.jpg',
        targetType: 'product',
        targetId: 'product-1',
        targetUrl: null,
        sortOrder: 1
      }
    ]);

    categoryFindMany.mockResolvedValue([
      {
        id: 'cat-1',
        parentId: null,
        slug: 'electronics',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/electronics.svg',
        nameZh: '电子数码',
        nameEn: 'Electronics',
        nameEs: 'Electronica',
        namePt: 'Eletronicos',
        descriptionZh: '中文描述',
        descriptionEn: 'English description',
        descriptionEs: 'Descripcion',
        descriptionPt: 'Descricao'
      },
      {
        id: 'cat-1-phones',
        parentId: 'cat-1',
        slug: 'electronics-phones',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/phones.svg',
        nameZh: '手机',
        nameEn: 'Phones',
        nameEs: 'Telefonos',
        namePt: 'Telefones',
        descriptionZh: '手机描述',
        descriptionEn: 'Phones description',
        descriptionEs: 'Descripcion telefonos',
        descriptionPt: 'Descricao telefones'
      }
    ]);

    productFindMany.mockResolvedValue([
      {
        id: 'product-1',
        slug: 'star-river-pro-phone',
        productCode: 'P-1001',
        coverImageUrl: '/phone.jpg',
        priceUsd: new Decimal('699.00'),
        isRecommended: true,
        categoryId: 'cat-1',
        nameZh: '星河 Pro 手机',
        nameEn: 'Star River Pro Phone',
        nameEs: 'Telefono Star River Pro',
        namePt: 'Telefone Star River Pro',
        introZh: '中文简介',
        introEn: 'English intro',
        introEs: 'Intro ES',
        introPt: 'Intro PT',
        detailZh: '中文详情',
        detailEn: 'English detail',
        detailEs: 'Detalle ES',
        detailPt: 'Detalhe PT',
        images: [
          {
            imageUrl: '/phone-1.jpg',
            altText: 'phone',
            sortOrder: 0
          }
        ],
        category: {
          slug: 'electronics',
          nameZh: '电子数码',
          nameEn: 'Electronics',
          nameEs: 'Electronica',
          namePt: 'Eletronicos'
        }
      }
    ]);

    const { getHomepagePayload } = await import('@/features/catalog/queries');
    const payload = await getHomepagePayload('en');

    expect(payload.banners).toHaveLength(1);
    expect(payload.featuredCategories[0]).toMatchObject({
      slug: 'electronics-phones',
      name: 'Phones'
    });
    expect(payload.recommendedProducts[0]).toMatchObject({
      slug: 'star-river-pro-phone',
      name: 'Star River Pro Phone',
      priceUsd: 699
    });
  });

  it('hides active child categories of inactive parents from storefront navigation groups', async () => {
    categoryFindMany.mockResolvedValue([
      {
        id: 'root-window',
        parentId: null,
        slug: 'window-cleaning-robots',
        sortOrder: 1,
        isActive: false,
        iconImageUrl: null,
        nameZh: '擦窗机器人',
        nameEn: 'Window Cleaning Robots',
        nameEs: 'Robots Limpiacristales',
        namePt: 'Robôs de Limpeza de Vidros',
        descriptionZh: '擦窗',
        descriptionEn: 'Window cleaning',
        descriptionEs: 'Ventanas',
        descriptionPt: 'Janelas'
      },
      {
        id: 'child-window',
        parentId: 'root-window',
        slug: 'residential-window-robots',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/uploads/categories/window.webp',
        nameZh: '家用擦窗机器人',
        nameEn: 'Residential Window Robots',
        nameEs: 'Residencial',
        namePt: 'Residencial',
        descriptionZh: '家用',
        descriptionEn: 'Residential',
        descriptionEs: 'Residencial',
        descriptionPt: 'Residencial'
      },
      {
        id: 'root-drone',
        parentId: null,
        slug: 'industrial-drones',
        sortOrder: 2,
        isActive: true,
        iconImageUrl: '/uploads/categories/drone.webp',
        nameZh: '工业无人机',
        nameEn: 'Industrial Drones',
        nameEs: 'Drones Industriales',
        namePt: 'Drones Industriais',
        descriptionZh: '工业',
        descriptionEn: 'Industrial',
        descriptionEs: 'Industrial',
        descriptionPt: 'Industrial'
      }
    ]);
    productFindMany.mockResolvedValue([]);

    const { getStorefrontCategoryGroups } = await import('@/features/catalog/queries');
    const groups = await getStorefrontCategoryGroups('en');

    expect(groups).toMatchObject([
      {
        slug: 'industrial-drones',
        name: 'Industrial Drones',
        children: []
      }
    ]);
  });

  it('includes every published product under each storefront navigation category branch', async () => {
    categoryFindMany.mockResolvedValue([
      {
        id: 'root-drone',
        parentId: null,
        slug: 'industrial-drones',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/uploads/categories/drone.webp',
        nameZh: '工业无人机',
        nameEn: 'Industrial Drones',
        nameEs: 'Drones Industriales',
        namePt: 'Drones Industriais',
        descriptionZh: '工业无人机',
        descriptionEn: 'Industrial drones',
        descriptionEs: 'Drones industriales',
        descriptionPt: 'Drones industriais'
      },
      {
        id: 'child-survey',
        parentId: 'root-drone',
        slug: 'survey-drones',
        sortOrder: 2,
        isActive: true,
        iconImageUrl: '/uploads/categories/survey.webp',
        nameZh: '测绘无人机',
        nameEn: 'Survey Drones',
        nameEs: 'Drones de inspeccion',
        namePt: 'Drones de levantamento',
        descriptionZh: '测绘',
        descriptionEn: 'Survey',
        descriptionEs: 'Inspeccion',
        descriptionPt: 'Levantamento'
      }
    ]);
    productFindMany.mockResolvedValue([
      {
        id: 'product-root',
        slug: 'falcon-pro',
        productCode: 'DR-1001',
        coverImageUrl: '/uploads/products/falcon.webp',
        priceUsd: new Decimal('1299.00'),
        isRecommended: true,
        categoryId: 'root-drone',
        nameZh: '猎鹰 Pro',
        nameEn: 'Falcon Pro',
        nameEs: 'Falcon Pro',
        namePt: 'Falcon Pro',
        introZh: '工业巡检无人机',
        introEn: 'Industrial inspection drone',
        introEs: 'Drone de inspeccion industrial',
        introPt: 'Drone de inspeção industrial',
        detailZh: '详情',
        detailEn: 'Details',
        detailEs: 'Detalles',
        detailPt: 'Detalhes',
        images: [],
        category: {
          slug: 'industrial-drones',
          nameZh: '工业无人机',
          nameEn: 'Industrial Drones',
          nameEs: 'Drones Industriales',
          namePt: 'Drones Industriais'
        }
      },
      {
        id: 'product-child',
        slug: 'survey-mini',
        productCode: 'DR-2001',
        coverImageUrl: '/uploads/products/survey-mini.webp',
        priceUsd: new Decimal('899.00'),
        isRecommended: false,
        categoryId: 'child-survey',
        nameZh: '测绘 Mini',
        nameEn: 'Survey Mini',
        nameEs: 'Survey Mini',
        namePt: 'Survey Mini',
        introZh: '轻量测绘无人机',
        introEn: 'Lightweight survey drone',
        introEs: 'Drone ligero de inspeccion',
        introPt: 'Drone leve de levantamento',
        detailZh: '详情',
        detailEn: 'Details',
        detailEs: 'Detalles',
        detailPt: 'Detalhes',
        images: [],
        category: {
          slug: 'survey-drones',
          nameZh: '测绘无人机',
          nameEn: 'Survey Drones',
          nameEs: 'Drones de inspeccion',
          namePt: 'Drones de levantamento'
        }
      }
    ]);

    const { getStorefrontCategoryGroups } = await import('@/features/catalog/queries');
    const groups = await getStorefrontCategoryGroups('en');

    expect(groups[0]).toMatchObject({
      slug: 'industrial-drones',
      products: [
        {
          slug: 'falcon-pro',
          name: 'Falcon Pro'
        },
        {
          slug: 'survey-mini',
          name: 'Survey Mini'
        }
      ]
    });
  });

  it('excludes unpublished products from storefront navigation category branch products', async () => {
    categoryFindMany.mockResolvedValue([
      {
        id: 'root-drone',
        parentId: null,
        slug: 'industrial-drones',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/uploads/categories/drone.webp',
        nameZh: '工业无人机',
        nameEn: 'Industrial Drones',
        nameEs: 'Drones Industriales',
        namePt: 'Drones Industriais',
        descriptionZh: '工业无人机',
        descriptionEn: 'Industrial drones',
        descriptionEs: 'Drones industriales',
        descriptionPt: 'Drones industriais'
      }
    ]);
    productFindMany.mockResolvedValue([
      {
        id: 'product-published',
        status: 'published',
        slug: 'falcon-pro',
        productCode: 'DR-1001',
        coverImageUrl: '/uploads/products/falcon.webp',
        priceUsd: new Decimal('1299.00'),
        isRecommended: true,
        categoryId: 'root-drone',
        nameZh: '猎鹰 Pro',
        nameEn: 'Falcon Pro',
        nameEs: 'Falcon Pro',
        namePt: 'Falcon Pro',
        introZh: '工业巡检无人机',
        introEn: 'Industrial inspection drone',
        introEs: 'Drone de inspeccion industrial',
        introPt: 'Drone de inspeção industrial',
        detailZh: '详情',
        detailEn: 'Details',
        detailEs: 'Detalles',
        detailPt: 'Detalhes',
        images: [],
        category: {
          slug: 'industrial-drones',
          nameZh: '工业无人机',
          nameEn: 'Industrial Drones',
          nameEs: 'Drones Industriales',
          namePt: 'Drones Industriais'
        }
      },
      {
        id: 'product-draft',
        status: 'draft',
        slug: 'draft-drone',
        productCode: 'DR-DRAFT',
        coverImageUrl: '/uploads/products/draft.webp',
        priceUsd: new Decimal('799.00'),
        isRecommended: false,
        categoryId: 'root-drone',
        nameZh: '草稿无人机',
        nameEn: 'Draft Drone',
        nameEs: 'Draft Drone',
        namePt: 'Draft Drone',
        introZh: '草稿商品',
        introEn: 'Draft product',
        introEs: 'Producto borrador',
        introPt: 'Produto rascunho',
        detailZh: '详情',
        detailEn: 'Details',
        detailEs: 'Detalles',
        detailPt: 'Detalhes',
        images: [],
        category: {
          slug: 'industrial-drones',
          nameZh: '工业无人机',
          nameEn: 'Industrial Drones',
          nameEs: 'Drones Industriales',
          namePt: 'Drones Industriais'
        }
      }
    ]);

    const { getStorefrontCategoryGroups } = await import('@/features/catalog/queries');
    const groups = await getStorefrontCategoryGroups('en');

    expect(groups[0]?.products?.map((product) => product.slug)).toEqual([
      'falcon-pro'
    ]);
  });

  it('uses configured category images for homepage banners that target a category branch', async () => {
    bannerFindMany.mockResolvedValue([
      {
        id: 'banner-1',
        imageUrl: '/show/legacy-banner.png',
        targetType: 'category',
        targetId: 'root-window',
        targetUrl: null,
        sortOrder: 1
      }
    ]);

    categoryFindMany.mockResolvedValue([
      {
        id: 'root-window',
        parentId: null,
        slug: 'window-cleaning-robots',
        sortOrder: 1,
        isActive: false,
        iconImageUrl: null,
        nameZh: '擦窗机器人',
        nameEn: 'Window Cleaning Robots',
        nameEs: 'Robots Limpiacristales',
        namePt: 'Robôs de Limpeza de Vidros',
        descriptionZh: '擦窗',
        descriptionEn: 'Window cleaning',
        descriptionEs: 'Ventanas',
        descriptionPt: 'Janelas'
      },
      {
        id: 'child-window',
        parentId: 'root-window',
        slug: 'residential-window-robots',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/uploads/categories/window.webp',
        nameZh: '家用擦窗机器人',
        nameEn: 'Residential Window Robots',
        nameEs: 'Residencial',
        namePt: 'Residencial',
        descriptionZh: '家用',
        descriptionEn: 'Residential',
        descriptionEs: 'Residencial',
        descriptionPt: 'Residencial'
      }
    ]);

    productFindMany.mockResolvedValue([]);

    const { getHomepagePayload } = await import('@/features/catalog/queries');
    const payload = await getHomepagePayload('en');

    expect(payload.banners[0]).toMatchObject({
      imageUrl: '/uploads/categories/window.webp',
      targetType: 'category',
      targetId: 'root-window'
    });
    // 父类目未启用时，其子类目不再出现在精选类目中
    expect(payload.featuredCategories).toEqual([]);
  });

  it('exposes active root categories as rootCategories', async () => {
    bannerFindMany.mockResolvedValue([]);
    categoryFindMany.mockResolvedValue([
      {
        id: 'cat-root',
        parentId: null,
        slug: 'robots',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/uploads/category/robots.png',
        nameZh: '机器人',
        nameEn: 'Robots',
        nameEs: 'Robots',
        namePt: 'Robos',
        descriptionZh: '机器人大类',
        descriptionEn: 'Robot group',
        descriptionEs: 'Grupo de robots',
        descriptionPt: 'Grupo de robos'
      },
      {
        id: 'cat-leaf',
        parentId: 'cat-root',
        slug: 'bipedal',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/uploads/category/bipedal.png',
        nameZh: '双足',
        nameEn: 'Bipedal',
        nameEs: 'Bipedal',
        namePt: 'Bipedal',
        descriptionZh: null,
        descriptionEn: null,
        descriptionEs: null,
        descriptionPt: null
      },
      {
        id: 'cat-inactive-root',
        parentId: null,
        slug: 'inactive',
        sortOrder: 2,
        isActive: false,
        iconImageUrl: '/uploads/category/inactive.png',
        nameZh: '停用',
        nameEn: 'Inactive',
        nameEs: 'Inactive',
        namePt: 'Inactive',
        descriptionZh: null,
        descriptionEn: null,
        descriptionEs: null,
        descriptionPt: null
      }
    ]);
    productFindMany.mockResolvedValue([]);

    const { getHomepagePayload } = await import('@/features/catalog/queries');
    const payload = await getHomepagePayload('en');

    expect(payload.rootCategories).toEqual([
      {
        id: 'cat-root',
        slug: 'robots',
        iconImageUrl: '/uploads/category/robots.png',
        name: 'Robots',
        description: 'Robot group'
      }
    ]);
    // 二级分类仍在 featuredCategories,rootCategories 只含启用的一级分类
    expect(payload.featuredCategories.map((c) => c.id)).toEqual(['cat-leaf']);
  });

  it('returns null for an unpublished or missing product detail', async () => {
    productFindFirst.mockResolvedValue(null);

    const { getProductDetailBySlug } = await import('@/features/catalog/queries');
    const payload = await getProductDetailBySlug('missing-slug', 'zh-CN');

    expect(payload).toBeNull();
  });

  it('sorts product list payload by selected sort strategy', async () => {
    categoryFindMany.mockResolvedValue([]);
    productFindMany.mockResolvedValue([
      {
        id: 'product-1',
        slug: 'zeta-robot',
        productCode: 'P-3001',
        coverImageUrl: '/zeta.jpg',
        priceUsd: new Decimal('199.00'),
        isRecommended: true,
        categoryId: 'cat-1',
        nameZh: '泽塔机器人',
        nameEn: 'Zeta Robot',
        nameEs: 'Robot Zeta',
        namePt: 'Robo Zeta',
        introZh: '中文简介',
        introEn: 'English intro',
        introEs: 'Intro ES',
        introPt: 'Intro PT',
        detailZh: '中文详情',
        detailEn: 'English detail',
        detailEs: 'Detalle ES',
        detailPt: 'Detalhe PT',
        images: [],
        category: {
          slug: 'electronics',
          nameZh: '电子数码',
          nameEn: 'Electronics',
          nameEs: 'Electronica',
          namePt: 'Eletronicos'
        }
      },
      {
        id: 'product-2',
        slug: 'alpha-robot',
        productCode: 'P-1001',
        coverImageUrl: '/alpha.jpg',
        priceUsd: new Decimal('699.00'),
        isRecommended: true,
        categoryId: 'cat-1',
        nameZh: '阿尔法机器人',
        nameEn: 'Alpha Robot',
        nameEs: 'Robot Alpha',
        namePt: 'Robo Alpha',
        introZh: '中文简介',
        introEn: 'English intro',
        introEs: 'Intro ES',
        introPt: 'Intro PT',
        detailZh: '中文详情',
        detailEn: 'English detail',
        detailEs: 'Detalle ES',
        detailPt: 'Detalhe PT',
        images: [],
        category: {
          slug: 'electronics',
          nameZh: '电子数码',
          nameEn: 'Electronics',
          nameEs: 'Electronica',
          namePt: 'Eletronicos'
        }
      }
    ]);

    const { getProductListPayload } = await import('@/features/catalog/queries');

    const priceSortedPayload = await getProductListPayload(
      { sort: 'price-desc' },
      'en'
    );
    expect(priceSortedPayload.products.map((product) => product.name)).toEqual([
      'Alpha Robot',
      'Zeta Robot'
    ]);

    const nameSortedPayload = await getProductListPayload(
      { sort: 'name-asc' },
      'en'
    );
    expect(nameSortedPayload.products.map((product) => product.name)).toEqual([
      'Alpha Robot',
      'Zeta Robot'
    ]);
  });

  it('queries admin products by backend filters including recommendation and localized search fields', async () => {
    productFindMany.mockResolvedValue([]);

    const { getAdminProductList } = await import('@/features/catalog/queries');
    await getAdminProductList({
      search: 'drone',
      status: 'recommended',
      categoryId: 'cat-drones'
    });

    expect(productFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          categoryId: 'cat-drones',
          isRecommended: true,
          OR: [
            { productCode: { contains: 'drone', mode: 'insensitive' } },
            { slug: { contains: 'drone', mode: 'insensitive' } },
            { nameZh: { contains: 'drone', mode: 'insensitive' } },
            { nameEn: { contains: 'drone', mode: 'insensitive' } },
            { nameEs: { contains: 'drone', mode: 'insensitive' } },
            { namePt: { contains: 'drone', mode: 'insensitive' } },
            {
              category: {
                OR: [
                  { nameZh: { contains: 'drone', mode: 'insensitive' } },
                  { nameEn: { contains: 'drone', mode: 'insensitive' } },
                  { nameEs: { contains: 'drone', mode: 'insensitive' } },
                  { namePt: { contains: 'drone', mode: 'insensitive' } }
                ]
              }
            }
          ]
        }
      })
    );
  });
});
