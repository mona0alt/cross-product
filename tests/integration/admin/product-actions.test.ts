import { beforeEach, describe, expect, it, vi } from 'vitest';

const productCreate = vi.fn();
const productUpdate = vi.fn();
const productFindUnique = vi.fn();
const productImageDeleteMany = vi.fn();
const productImageCreateMany = vi.fn();
const categoryFindUnique = vi.fn();
const transaction = vi.fn();
const revalidatePath = vi.fn();

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
      findUnique: categoryFindUnique
    },
    $transaction: transaction
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath
}));

function createValidProductFormData(categoryId = 'leaf-1') {
  const formData = new FormData();
  formData.set('categoryId', categoryId);
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
  formData.set('galleryImageUrls', '/uploads/products/a.png');

  return formData;
}

function createPublishableProduct(categoryId = 'leaf-1') {
  return {
    id: 'product-1',
    categoryId,
    productCode: 'P-3001',
    priceUsd: 199.99,
    coverImageUrl: '/uploads/products/cover.png',
    nameZh: '清洁机器人',
    nameEn: 'Cleaning Robot',
    nameEs: 'Robot de limpieza',
    namePt: 'Robo de limpeza',
    introZh: '简介',
    introEn: 'Intro',
    introEs: 'Intro ES',
    introPt: 'Intro PT',
    detailZh: '详情',
    detailEn: 'Detail',
    detailEs: 'Detalle',
    detailPt: 'Detalhe'
  };
}

describe('admin product actions leaf-category enforcement', () => {
  beforeEach(() => {
    productCreate.mockReset();
    productUpdate.mockReset();
    productFindUnique.mockReset();
    productImageDeleteMany.mockReset();
    productImageCreateMany.mockReset();
    categoryFindUnique.mockReset();
    transaction.mockReset();
    revalidatePath.mockReset();
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

  it('rejects createProductFromForm when the category is a root category', async () => {
    categoryFindUnique.mockResolvedValue({ parentId: null });

    const { createProductFromForm } = await import('@/features/admin/product-actions');

    await expect(createProductFromForm(createValidProductFormData('root-1'))).rejects.toThrow(
      'PRODUCT_CATEGORY_MUST_BE_LEAF'
    );
    expect(productCreate).not.toHaveBeenCalled();
  });

  it('rejects createProductFromForm when the category does not exist', async () => {
    categoryFindUnique.mockResolvedValue(null);

    const { createProductFromForm } = await import('@/features/admin/product-actions');

    await expect(createProductFromForm(createValidProductFormData('missing'))).rejects.toThrow(
      'PRODUCT_CATEGORY_MUST_BE_LEAF'
    );
    expect(productCreate).not.toHaveBeenCalled();
  });

  it('creates a product from form data when the category is a leaf', async () => {
    categoryFindUnique.mockResolvedValue({ parentId: 'root-1' });
    productCreate.mockResolvedValue({ id: 'product-1', status: 'draft' });

    const { createProductFromForm } = await import('@/features/admin/product-actions');
    const result = await createProductFromForm(createValidProductFormData('leaf-1'));

    expect(categoryFindUnique).toHaveBeenCalledWith({
      where: { id: 'leaf-1' },
      select: { parentId: true }
    });
    expect(productCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ categoryId: 'leaf-1' })
    });
    expect(result.id).toBe('product-1');
  });

  it('rejects updateProductFromForm when the category is a root category', async () => {
    categoryFindUnique.mockResolvedValue({ parentId: null });

    const { updateProductFromForm } = await import('@/features/admin/product-actions');

    await expect(
      updateProductFromForm('product-1', createValidProductFormData('root-1'))
    ).rejects.toThrow('PRODUCT_CATEGORY_MUST_BE_LEAF');
    expect(transaction).not.toHaveBeenCalled();
  });

  it('updates a product from form data when the category is a leaf', async () => {
    categoryFindUnique.mockResolvedValue({ parentId: 'root-1' });
    productUpdate.mockResolvedValue({ id: 'product-1', status: 'draft' });

    const { updateProductFromForm } = await import('@/features/admin/product-actions');
    await updateProductFromForm('product-1', createValidProductFormData('leaf-1'));

    expect(transaction).toHaveBeenCalled();
    expect(productUpdate).toHaveBeenCalledWith({
      where: { id: 'product-1' },
      data: expect.objectContaining({ categoryId: 'leaf-1' })
    });
  });

  it('rejects publishProduct when the product category is a root category', async () => {
    productFindUnique.mockResolvedValue(createPublishableProduct('root-1'));
    categoryFindUnique.mockResolvedValue({ parentId: null });

    const { publishProduct } = await import('@/features/admin/product-actions');

    await expect(publishProduct('product-1')).rejects.toThrow(
      'PRODUCT_CATEGORY_MUST_BE_LEAF'
    );
    expect(productUpdate).not.toHaveBeenCalled();
  });

  it('publishes a product when the product category is a leaf', async () => {
    productFindUnique.mockResolvedValue(createPublishableProduct('leaf-1'));
    categoryFindUnique.mockResolvedValue({ id: 'leaf-1', parentId: 'root-1' });
    productUpdate.mockResolvedValue({ id: 'product-1', status: 'published' });

    const { publishProduct } = await import('@/features/admin/product-actions');
    const result = await publishProduct('product-1');

    expect(productUpdate).toHaveBeenCalledWith({
      where: { id: 'product-1' },
      data: expect.objectContaining({ status: 'published' })
    });
    expect(result.status).toBe('published');
  });
});
