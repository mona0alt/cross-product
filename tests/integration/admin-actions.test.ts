import { beforeEach, describe, expect, it, vi } from 'vitest';

const productCreate = vi.fn();
const productUpdate = vi.fn();
const productFindUnique = vi.fn();
const productImageDeleteMany = vi.fn();
const productImageCreateMany = vi.fn();
const categoryFindUnique = vi.fn();
const categoryCreate = vi.fn();
const categoryUpdate = vi.fn();
const bannerCreate = vi.fn();
const bannerUpdate = vi.fn();
const messageUpdate = vi.fn();
const transaction = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    product: {
      create: productCreate,
      update: productUpdate,
      findUnique: productFindUnique
    },
    productImage: {
      deleteMany: productImageDeleteMany,
      createMany: productImageCreateMany
    },
    category: {
      findUnique: categoryFindUnique,
      create: categoryCreate,
      update: categoryUpdate
    },
    banner: {
      create: bannerCreate,
      update: bannerUpdate
    },
    message: {
      update: messageUpdate
    },
    $transaction: transaction
  }
}));

describe('admin actions', () => {
  beforeEach(() => {
    productCreate.mockReset();
    productUpdate.mockReset();
    productFindUnique.mockReset();
    productImageDeleteMany.mockReset();
    productImageCreateMany.mockReset();
    categoryFindUnique.mockReset();
    categoryCreate.mockReset();
    categoryUpdate.mockReset();
    bannerCreate.mockReset();
    bannerUpdate.mockReset();
    messageUpdate.mockReset();
    transaction.mockReset();
    transaction.mockImplementation(async (callback) =>
      callback({
        product: {
          update: productUpdate
        },
        productImage: {
          deleteMany: productImageDeleteMany,
          createMany: productImageCreateMany
        }
      })
    );
  });

  it('creates product drafts with draft status', async () => {
    productCreate.mockResolvedValue({
      id: 'product-1',
      status: 'draft'
    });

    const { createProductDraft } = await import('@/features/admin/product-actions');
    const result = await createProductDraft({
      categoryId: 'cat-1',
      productCode: 'P-3001',
      slug: 'new-product',
      priceUsd: 199,
      coverImageUrl: '/cover.jpg'
    });

    expect(productCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'draft'
        })
      })
    );
    expect(result.status).toBe('draft');
  });

  it('creates products from form data with localized fields', async () => {
    productCreate.mockResolvedValue({
      id: 'product-1',
      status: 'draft',
      nameEn: 'Cleaning Robot'
    });

    const formData = new FormData();
    formData.set('categoryId', 'cat-1');
    formData.set('productCode', 'P-3001');
    formData.set('slug', 'cleaning-robot');
    formData.set('priceUsd', '199.99');
    formData.set('coverImageUrl', '/uploads/products/cover.png');
    formData.set('status', 'draft');
    formData.set('isRecommended', 'on');
    formData.set('sortOrder', '7');
    formData.set('nameZh', '清洁机器人');
    formData.set('nameEn', 'Cleaning Robot');
    formData.set('nameEs', 'Robot de limpieza');
    formData.set('namePt', 'Robo de limpeza');
    formData.set('introZh', '简介');
    formData.set('introEn', 'Intro');
    formData.set('introEs', 'Intro ES');
    formData.set('introPt', 'Intro PT');
    formData.set('detailZh', '详情');
    formData.set('detailEn', 'Detail');
    formData.set('detailEs', 'Detalle');
    formData.set('detailPt', 'Detalhe');
    formData.set('galleryImageUrls', '/uploads/products/a.png\n/uploads/products/b.png');

    const { createProductFromForm } = await import('@/features/admin/product-actions');
    const result = await createProductFromForm(formData);

    expect(productCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        categoryId: 'cat-1',
        productCode: 'P-3001',
        slug: 'cleaning-robot',
        priceUsd: 199.99,
        coverImageUrl: '/uploads/products/cover.png',
        status: 'draft',
        isRecommended: true,
        sortOrder: 7,
        nameZh: '清洁机器人',
        nameEn: 'Cleaning Robot',
        images: {
          create: [
            { imageUrl: '/uploads/products/a.png', altText: 'Cleaning Robot', sortOrder: 0 },
            { imageUrl: '/uploads/products/b.png', altText: 'Cleaning Robot', sortOrder: 1 }
          ]
        }
      })
    });
    expect(result.nameEn).toBe('Cleaning Robot');
  });

  it('updates products from form data and replaces gallery images in order', async () => {
    productUpdate.mockResolvedValue({
      id: 'product-1',
      status: 'published'
    });

    const formData = new FormData();
    formData.set('categoryId', 'cat-1');
    formData.set('productCode', 'P-3001');
    formData.set('slug', 'cleaning-robot');
    formData.set('priceUsd', '249');
    formData.set('coverImageUrl', '/uploads/products/cover-new.png');
    formData.set('status', 'published');
    formData.set('sortOrder', '3');
    formData.set('nameZh', '清洁机器人');
    formData.set('nameEn', 'Cleaning Robot');
    formData.set('nameEs', 'Robot de limpieza');
    formData.set('namePt', 'Robo de limpeza');
    formData.set('introZh', '简介');
    formData.set('introEn', 'Intro');
    formData.set('introEs', 'Intro ES');
    formData.set('introPt', 'Intro PT');
    formData.set('detailZh', '详情');
    formData.set('detailEn', 'Detail');
    formData.set('detailEs', 'Detalle');
    formData.set('detailPt', 'Detalhe');
    formData.set('galleryImageUrls', '/uploads/products/one.png\n\n/uploads/products/two.png');

    const { updateProductFromForm } = await import('@/features/admin/product-actions');
    await updateProductFromForm('product-1', formData);

    expect(transaction).toHaveBeenCalled();
    expect(productUpdate).toHaveBeenCalledWith({
      where: { id: 'product-1' },
      data: expect.objectContaining({
        priceUsd: 249,
        status: 'published',
        isRecommended: false,
        sortOrder: 3
      })
    });
    expect(productImageDeleteMany).toHaveBeenCalledWith({
      where: { productId: 'product-1' }
    });
    expect(productImageCreateMany).toHaveBeenCalledWith({
      data: [
        {
          productId: 'product-1',
          imageUrl: '/uploads/products/one.png',
          altText: 'Cleaning Robot',
          sortOrder: 0
        },
        {
          productId: 'product-1',
          imageUrl: '/uploads/products/two.png',
          altText: 'Cleaning Robot',
          sortOrder: 1
        }
      ]
    });
  });

  it('blocks publishing when required fields are incomplete', async () => {
    productFindUnique.mockResolvedValue({
      id: 'product-1',
      categoryId: 'cat-1',
      productCode: 'P-3001',
      priceUsd: 199,
      coverImageUrl: '/cover.jpg',
      nameZh: '中文',
      nameEn: 'English',
      nameEs: 'Espanol',
      namePt: 'Portugues',
      introZh: 'ok',
      introEn: 'ok',
      introEs: 'ok',
      introPt: 'ok',
      detailZh: 'ok',
      detailEn: 'ok',
      detailEs: '',
      detailPt: 'ok'
    });
    categoryFindUnique.mockResolvedValue({ id: 'cat-1' });

    const { publishProduct } = await import('@/features/admin/product-actions');

    await expect(publishProduct('product-1')).rejects.toMatchObject({
      blockers: ['detailEs']
    });
  });

  it('marks messages as processed', async () => {
    messageUpdate.mockResolvedValue({
      id: 'message-1',
      status: 'processed'
    });

    const { markMessageProcessed } = await import('@/features/admin/banner-actions');
    const result = await markMessageProcessed('message-1');

    expect(messageUpdate).toHaveBeenCalled();
    expect(result.status).toBe('processed');
  });
});
