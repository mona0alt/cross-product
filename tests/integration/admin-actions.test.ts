import { beforeEach, describe, expect, it, vi } from 'vitest';

const productCreate = vi.fn();
const productUpdate = vi.fn();
const productUpdateMany = vi.fn();
const productFindUnique = vi.fn();
const productDelete = vi.fn();
const productImageDeleteMany = vi.fn();
const productImageCreateMany = vi.fn();
const categoryFindUnique = vi.fn();
const categoryCreate = vi.fn();
const categoryUpdate = vi.fn();
const categoryDelete = vi.fn();
const bannerCreate = vi.fn();
const bannerUpdate = vi.fn();
const messageFindMany = vi.fn();
const messageUpdate = vi.fn();
const messageDelete = vi.fn();
const transaction = vi.fn();
const revalidatePath = vi.fn();
const unlink = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    product: {
      create: productCreate,
      update: productUpdate,
      updateMany: productUpdateMany,
      findUnique: productFindUnique,
      delete: productDelete
    },
    productImage: {
      deleteMany: productImageDeleteMany,
      createMany: productImageCreateMany
    },
    category: {
      findUnique: categoryFindUnique,
      create: categoryCreate,
      update: categoryUpdate,
      delete: categoryDelete
    },
    banner: {
      create: bannerCreate,
      update: bannerUpdate
    },
    message: {
      findMany: messageFindMany,
      update: messageUpdate,
      delete: messageDelete
    },
    $transaction: transaction
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath
}));

vi.mock('node:fs/promises', () => ({
  unlink
}));

function createValidProductFormData() {
  const formData = new FormData();
  formData.set('categoryId', 'cat-1');
  formData.set('productCode', 'P-3001');
  formData.set('slug', 'cleaning-robot');
  formData.set('priceUsd', '199.99');
  formData.set('coverImageUrl', '/uploads/products/cover.png');
  formData.set('status', 'draft');
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

  return formData;
}

describe('admin actions', () => {
  beforeEach(() => {
    productCreate.mockReset();
    productUpdate.mockReset();
    productUpdateMany.mockReset();
    productFindUnique.mockReset();
    productDelete.mockReset();
    productImageDeleteMany.mockReset();
    productImageCreateMany.mockReset();
    categoryFindUnique.mockReset();
    categoryCreate.mockReset();
    categoryUpdate.mockReset();
    categoryDelete.mockReset();
    bannerCreate.mockReset();
    bannerUpdate.mockReset();
    messageFindMany.mockReset();
    messageUpdate.mockReset();
    messageDelete.mockReset();
    transaction.mockReset();
    revalidatePath.mockReset();
    unlink.mockReset();
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
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
  });

  it('rejects remote product image paths from product forms', async () => {
    const formData = createValidProductFormData();
    formData.set('coverImageUrl', 'https://images.example.com/cover.png');
    formData.set('galleryImageUrls', '/uploads/products/a.png');

    const { createProductFromForm } = await import('@/features/admin/product-actions');

    await expect(createProductFromForm(formData)).rejects.toThrow(
      'INVALID_LOCAL_coverImageUrl'
    );
    expect(productCreate).not.toHaveBeenCalled();
  });

  it('updates products from form data, including category changes, and refreshes admin products', async () => {
    productUpdate.mockResolvedValue({
      id: 'product-1',
      status: 'published'
    });

    const formData = new FormData();
    formData.set('categoryId', 'cat-drones');
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
        categoryId: 'cat-drones',
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
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
  });

  it('deletes products from the product center and removes uploaded local images', async () => {
    productFindUnique.mockResolvedValue({
      id: 'product-1',
      coverImageUrl: '/uploads/products/cover.png',
      images: [
        {
          imageUrl: '/uploads/products/gallery-a.png'
        },
        {
          imageUrl: '/uploads/products/gallery-a.png'
        },
        {
          imageUrl: '/logo.jpg'
        }
      ]
    });
    productDelete.mockResolvedValue({
      id: 'product-1'
    });
    unlink.mockResolvedValue(undefined);

    const { deleteProductFromListAction } = await import('@/features/admin/product-actions');
    await deleteProductFromListAction('product-1');

    expect(productFindUnique).toHaveBeenCalledWith({
      where: { id: 'product-1' },
      include: { images: true }
    });
    expect(productDelete).toHaveBeenCalledWith({
      where: { id: 'product-1' }
    });
    expect(productUpdate).not.toHaveBeenCalled();
    expect(unlink).toHaveBeenCalledTimes(2);
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('/public/uploads/products/cover.png')
    );
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('/public/uploads/products/gallery-a.png')
    );
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
  });

  it('batch updates product recommendations and archive status', async () => {
    productUpdateMany.mockResolvedValue({ count: 2 });

    const { bulkUpdateProductsFromListAction } = await import('@/features/admin/product-actions');
    await bulkUpdateProductsFromListAction(['product-1', 'product-2'], 'recommend');
    await bulkUpdateProductsFromListAction(['product-1', 'product-2'], 'unrecommend');
    await bulkUpdateProductsFromListAction(['product-1', 'product-2'], 'archive');

    expect(productUpdateMany).toHaveBeenNthCalledWith(1, {
      where: { id: { in: ['product-1', 'product-2'] } },
      data: { isRecommended: true }
    });
    expect(productUpdateMany).toHaveBeenNthCalledWith(2, {
      where: { id: { in: ['product-1', 'product-2'] } },
      data: { isRecommended: false }
    });
    expect(productUpdateMany).toHaveBeenNthCalledWith(3, {
      where: { id: { in: ['product-1', 'product-2'] } },
      data: { status: 'archived' }
    });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
  });

  it('creates categories from form data with localized fields', async () => {
    categoryCreate.mockResolvedValue({
      id: 'cat-humanoid',
      slug: 'humanoid-robots',
      nameZh: '人形机器人'
    });

    const formData = new FormData();
    formData.set('parentId', '');
    formData.set('slug', 'humanoid-robots');
    formData.set('sortOrder', '1');
    formData.set('iconImageUrl', '/show/robot_humanoid.png');
    formData.set('isActive', 'on');
    formData.set('nameZh', '人形机器人');
    formData.set('nameEn', 'Humanoid Robots');
    formData.set('nameEs', 'Robots humanoides');
    formData.set('namePt', 'Robos humanoides');
    formData.set('descriptionZh', '面向服务、研究与教育的人形机器人平台。');
    formData.set('descriptionEn', 'Humanoid robot platforms.');
    formData.set('descriptionEs', 'Robots humanoides.');
    formData.set('descriptionPt', 'Robos humanoides.');

    const { createCategoryFromForm } = await import('@/features/admin/category-actions');
    const result = await createCategoryFromForm(formData);

    expect(categoryCreate).toHaveBeenCalledWith({
      data: {
        parentId: null,
        slug: 'humanoid-robots',
        sortOrder: 1,
        iconImageUrl: '/show/robot_humanoid.png',
        isActive: true,
        nameZh: '人形机器人',
        nameEn: 'Humanoid Robots',
        nameEs: 'Robots humanoides',
        namePt: 'Robos humanoides',
        descriptionZh: '面向服务、研究与教育的人形机器人平台。',
        descriptionEn: 'Humanoid robot platforms.',
        descriptionEs: 'Robots humanoides.',
        descriptionPt: 'Robos humanoides.'
      }
    });
    expect(result.id).toBe('cat-humanoid');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/categories');
  });

  it('rejects remote category image paths from category forms', async () => {
    const formData = new FormData();
    formData.set('parentId', '');
    formData.set('slug', 'humanoid-robots');
    formData.set('sortOrder', '1');
    formData.set('iconImageUrl', 'https://images.example.com/category.png');
    formData.set('isActive', 'on');
    formData.set('nameZh', '人形机器人');
    formData.set('nameEn', 'Humanoid Robots');
    formData.set('nameEs', 'Robots humanoides');
    formData.set('namePt', 'Robos humanoides');
    formData.set('descriptionZh', '面向服务、研究与教育的人形机器人平台。');
    formData.set('descriptionEn', 'Humanoid robot platforms.');
    formData.set('descriptionEs', 'Robots humanoides.');
    formData.set('descriptionPt', 'Robos humanoides.');

    const { createCategoryFromForm } = await import('@/features/admin/category-actions');

    await expect(createCategoryFromForm(formData)).rejects.toThrow(
      'INVALID_LOCAL_iconImageUrl'
    );
    expect(categoryCreate).not.toHaveBeenCalled();
  });

  it('updates categories from form data and clears optional fields', async () => {
    categoryUpdate.mockResolvedValue({
      id: 'cat-drones',
      slug: 'drones',
      isActive: false
    });

    const formData = new FormData();
    formData.set('parentId', '');
    formData.set('slug', 'drones');
    formData.set('sortOrder', '2');
    formData.set('iconImageUrl', '');
    formData.set('nameZh', '无人机');
    formData.set('nameEn', 'Drones');
    formData.set('nameEs', 'Drones');
    formData.set('namePt', 'Drones');
    formData.set('descriptionZh', '');
    formData.set('descriptionEn', '');
    formData.set('descriptionEs', '');
    formData.set('descriptionPt', '');

    const { updateCategoryFromForm } = await import('@/features/admin/category-actions');
    const result = await updateCategoryFromForm('cat-drones', formData);

    expect(categoryUpdate).toHaveBeenCalledWith({
      where: { id: 'cat-drones' },
      data: {
        parentId: null,
        slug: 'drones',
        sortOrder: 2,
        iconImageUrl: null,
        isActive: false,
        nameZh: '无人机',
        nameEn: 'Drones',
        nameEs: 'Drones',
        namePt: 'Drones',
        descriptionZh: null,
        descriptionEn: null,
        descriptionEs: null,
        descriptionPt: null
      }
    });
    expect(result.isActive).toBe(false);
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/categories');
  });

  it('soft deletes categories from form actions by disabling them', async () => {
    categoryUpdate.mockResolvedValue({
      id: 'cat-drones',
      slug: 'drones',
      isActive: false
    });

    const { deleteCategoryFormAction } = await import('@/features/admin/category-actions');
    await deleteCategoryFormAction('cat-drones');

    expect(categoryDelete).not.toHaveBeenCalled();
    expect(categoryUpdate).toHaveBeenCalledWith({
      where: { id: 'cat-drones' },
      data: { isActive: false }
    });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/categories');
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

  it('reads admin messages ordered by newest first', async () => {
    messageFindMany.mockResolvedValue([
      {
        id: 'message-1',
        name: 'Alice',
        email: 'alice@example.com',
        content: 'Need a quote',
        status: 'new',
        createdAt: new Date('2026-05-15T08:00:00.000Z')
      }
    ]);

    const { getAdminMessages } = await import('@/features/admin/message-actions');
    const result = await getAdminMessages();

    expect(messageFindMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        content: true,
        status: true,
        createdAt: true
      }
    });
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('alice@example.com');
  });

  it('deletes admin messages', async () => {
    messageDelete.mockResolvedValue({
      id: 'message-1'
    });

    const { deleteAdminMessage } = await import('@/features/admin/message-actions');
    const result = await deleteAdminMessage('message-1');

    expect(messageDelete).toHaveBeenCalledWith({
      where: { id: 'message-1' }
    });
    expect(result.id).toBe('message-1');
  });

  it('creates banners from form data', async () => {
    bannerCreate.mockResolvedValue({
      id: 'banner-1',
      imageUrl: '/uploads/banners/hero.png',
      isActive: true
    });

    const formData = new FormData();
    formData.set('imageUrl', '/uploads/banners/hero.png');
    formData.set('targetType', 'product');
    formData.set('targetId', 'product-1');
    formData.set('targetUrl', '');
    formData.set('sortOrder', '5');
    formData.set('isActive', 'on');

    const { createBannerFromForm } = await import('@/features/admin/banner-actions');
    const result = await createBannerFromForm(formData);

    expect(bannerCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          imageUrl: '/uploads/banners/hero.png',
          targetType: 'product',
          targetId: 'product-1',
          targetUrl: null,
          sortOrder: 5,
          isActive: true
        }
      })
    );
    expect(result.id).toBe('banner-1');
  });

  it('updates banners from form data', async () => {
    bannerUpdate.mockResolvedValue({
      id: 'banner-1',
      isActive: false
    });

    const formData = new FormData();
    formData.set('imageUrl', '/uploads/banners/hero-new.png');
    formData.set('targetType', 'url');
    formData.set('targetId', '');
    formData.set('targetUrl', 'https://example.com');
    formData.set('sortOrder', '9');

    const { updateBannerFromForm } = await import('@/features/admin/banner-actions');
    await updateBannerFromForm('banner-1', formData);

    expect(bannerUpdate).toHaveBeenCalledWith({
      where: { id: 'banner-1' },
      data: {
        imageUrl: '/uploads/banners/hero-new.png',
        targetType: 'url',
        targetId: null,
        targetUrl: 'https://example.com',
        sortOrder: 9,
        isActive: false
      }
    });
  });
});
