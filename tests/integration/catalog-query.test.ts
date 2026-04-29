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

  it('returns null for an unpublished or missing product detail', async () => {
    productFindFirst.mockResolvedValue(null);

    const { getProductDetailBySlug } = await import('@/features/catalog/queries');
    const payload = await getProductDetailBySlug('missing-slug', 'zh-CN');

    expect(payload).toBeNull();
  });
});
