import { describe, expect, it } from 'vitest';

import { mapLocalizedProduct } from '@/features/catalog/mappers';

const baseProduct = {
  id: 'product-1',
  slug: 'survey-drone-x1',
  productCode: 'P-1001',
  coverImageUrl: '/uploads/products/x1.webp',
  priceUsd: 1299,
  isRecommended: true,
  images: [{ imageUrl: '/uploads/products/x1.webp', sortOrder: 0 }],
  nameZh: '测绘无人机 X1',
  nameEn: 'Survey Drone X1',
  nameEs: 'Dron de Inspeccion X1',
  namePt: 'Drone de Levantamento X1',
  introZh: '测绘简介',
  introEn: 'Survey intro',
  introEs: 'Intro de inspeccion',
  introPt: 'Intro de levantamento',
  detailZh: '测绘详情',
  detailEn: 'Survey detail',
  detailEs: 'Detalle de inspeccion',
  detailPt: 'Detalhe de levantamento'
};

const parentCategory = {
  slug: 'industrial-drones',
  nameZh: '工业无人机',
  nameEn: 'Industrial Drones',
  nameEs: 'Drones Industriales',
  namePt: 'Drones Industriais'
};

const leafCategory = {
  slug: 'survey-drones',
  nameZh: '测绘无人机',
  nameEn: 'Survey Drones',
  nameEs: 'Drones de inspeccion',
  namePt: 'Drones de levantamento'
};

describe('mapLocalizedProduct category parent', () => {
  it('maps the parent category with localized names', () => {
    const product = mapLocalizedProduct(
      {
        ...baseProduct,
        category: {
          ...leafCategory,
          parent: parentCategory
        }
      },
      'en'
    );

    expect(product.category).toEqual({
      slug: 'survey-drones',
      name: 'Survey Drones',
      parent: {
        slug: 'industrial-drones',
        name: 'Industrial Drones'
      }
    });
  });

  it('localizes the parent category name for the requested locale', () => {
    const product = mapLocalizedProduct(
      {
        ...baseProduct,
        category: {
          ...leafCategory,
          parent: parentCategory
        }
      },
      'zh-CN'
    );

    expect(product.category?.parent).toEqual({
      slug: 'industrial-drones',
      name: '工业无人机'
    });
  });

  it('maps parent as undefined when the category has no parent (homepage/list callers)', () => {
    const product = mapLocalizedProduct(
      {
        ...baseProduct,
        category: leafCategory
      },
      'en'
    );

    expect(product.category).toEqual({
      slug: 'survey-drones',
      name: 'Survey Drones',
      parent: undefined
    });
  });
});
