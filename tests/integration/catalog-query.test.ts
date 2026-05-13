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
      slug: 'electronics',
      name: 'Electronics'
    });
    expect(payload.recommendedProducts[0]).toMatchObject({
      slug: 'star-river-pro-phone',
      name: 'Star River Pro Phone',
      priceUsd: 699
    });
  });

  it('promotes active child categories of inactive parents into storefront navigation groups', async () => {
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

    const { getStorefrontCategoryGroups } = await import('@/features/catalog/queries');
    const groups = await getStorefrontCategoryGroups('en');

    expect(groups).toMatchObject([
      {
        slug: 'residential-window-robots',
        name: 'Residential Window Robots',
        children: []
      },
      {
        slug: 'industrial-drones',
        name: 'Industrial Drones',
        children: []
      }
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
    expect(payload.featuredCategories[0]).toMatchObject({
      slug: 'residential-window-robots',
      name: 'Residential Window Robots',
      iconImageUrl: '/uploads/categories/window.webp'
    });
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
});
