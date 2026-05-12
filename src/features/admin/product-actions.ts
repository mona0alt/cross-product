'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { getPublishBlockers } from '@/features/catalog/publishable';

type ProductDraftInput = {
  categoryId: string;
  productCode: string;
  slug: string;
  priceUsd: number;
  coverImageUrl: string;
};

type ProductUpdateInput = Partial<{
  categoryId: string;
  productCode: string;
  slug: string;
  priceUsd: number;
  coverImageUrl: string;
  status: 'draft' | 'pending' | 'published' | 'archived';
  isRecommended: boolean;
  sortOrder: number;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  introZh: string;
  introEn: string;
  introEs: string;
  introPt: string;
  detailZh: string;
  detailEn: string;
  detailEs: string;
  detailPt: string;
}>;

type ProductFormStatus = 'draft' | 'pending' | 'published' | 'archived';
type ProductBulkOperation = 'recommend' | 'unrecommend' | 'archive';

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function getRequiredFormString(formData: FormData, key: string) {
  const value = getFormString(formData, key);

  if (!value) {
    throw new Error(`MISSING_${key}`);
  }

  return value;
}

function getFormNumber(formData: FormData, key: string, fallback = 0) {
  const value = getFormString(formData, key);
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function getFormStatus(formData: FormData): ProductFormStatus {
  const value = getFormString(formData, 'status');

  if (['draft', 'pending', 'published', 'archived'].includes(value)) {
    return value as ProductFormStatus;
  }

  return 'draft';
}

function getGalleryUrls(formData: FormData) {
  return getFormString(formData, 'galleryImageUrls')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getProductFormPayload(formData: FormData) {
  return {
    categoryId: getRequiredFormString(formData, 'categoryId'),
    productCode: getRequiredFormString(formData, 'productCode'),
    slug: getRequiredFormString(formData, 'slug'),
    priceUsd: getFormNumber(formData, 'priceUsd'),
    coverImageUrl: getRequiredFormString(formData, 'coverImageUrl'),
    status: getFormStatus(formData),
    isRecommended: formData.get('isRecommended') === 'on',
    sortOrder: getFormNumber(formData, 'sortOrder'),
    nameZh: getRequiredFormString(formData, 'nameZh'),
    nameEn: getRequiredFormString(formData, 'nameEn'),
    nameEs: getRequiredFormString(formData, 'nameEs'),
    namePt: getRequiredFormString(formData, 'namePt'),
    introZh: getRequiredFormString(formData, 'introZh'),
    introEn: getRequiredFormString(formData, 'introEn'),
    introEs: getRequiredFormString(formData, 'introEs'),
    introPt: getRequiredFormString(formData, 'introPt'),
    detailZh: getRequiredFormString(formData, 'detailZh'),
    detailEn: getRequiredFormString(formData, 'detailEn'),
    detailEs: getRequiredFormString(formData, 'detailEs'),
    detailPt: getRequiredFormString(formData, 'detailPt')
  };
}

function getImageCreateData(productId: string, nameEn: string, urls: string[]) {
  return urls.map((imageUrl, sortOrder) => ({
    productId,
    imageUrl,
    altText: nameEn,
    sortOrder
  }));
}

function getEmptyLocalizedFields() {
  return {
    nameZh: '',
    nameEn: '',
    nameEs: '',
    namePt: '',
    introZh: '',
    introEn: '',
    introEs: '',
    introPt: '',
    detailZh: '',
    detailEn: '',
    detailEs: '',
    detailPt: ''
  };
}

export async function createProductDraft(input: ProductDraftInput) {
  return db.product.create({
    data: {
      ...getEmptyLocalizedFields(),
      ...input,
      status: 'draft'
    }
  });
}

export async function createProductFromForm(formData: FormData) {
  const payload = getProductFormPayload(formData);
  const galleryUrls = getGalleryUrls(formData);

  const product = await db.product.create({
    data: {
      ...payload,
      images: {
        create: galleryUrls.map((imageUrl, sortOrder) => ({
          imageUrl,
          altText: payload.nameEn,
          sortOrder
        }))
      }
    }
  });

  revalidatePath('/admin/products');

  return product;
}

export async function updateProduct(id: string, input: ProductUpdateInput) {
  return db.product.update({
    where: { id },
    data: input
  });
}

export async function updateProductFromForm(id: string, formData: FormData) {
  const payload = getProductFormPayload(formData);
  const galleryUrls = getGalleryUrls(formData);

  const product = await db.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: payload
    });

    await tx.productImage.deleteMany({
      where: { productId: id }
    });

    const imageData = getImageCreateData(id, payload.nameEn, galleryUrls);
    if (imageData.length > 0) {
      await tx.productImage.createMany({
        data: imageData
      });
    }

    return product;
  });

  revalidatePath('/admin/products');

  return product;
}

export async function createProductFormAction(formData: FormData) {
  await createProductFromForm(formData);
}

export async function updateProductFormAction(id: string, formData: FormData) {
  await updateProductFromForm(id, formData);
}

export async function archiveProductFromListAction(id: string) {
  await updateProduct(id, { status: 'archived' });

  revalidatePath('/admin/products');
}

export async function bulkUpdateProductsFromListAction(
  ids: string[],
  operation: ProductBulkOperation
) {
  const productIds = ids.map((id) => id.trim()).filter(Boolean);

  if (productIds.length === 0) {
    return;
  }

  const data =
    operation === 'recommend'
      ? { isRecommended: true }
      : operation === 'unrecommend'
      ? { isRecommended: false }
      : { status: 'archived' as const };

  await db.product.updateMany({
    where: {
      id: {
        in: productIds
      }
    },
    data
  });

  revalidatePath('/admin/products');
}

export async function publishProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND');
  }

  const category = await db.category.findUnique({
    where: {
      id: product.categoryId
    }
  });

  const blockers = getPublishBlockers(
    {
      categoryId: product.categoryId,
      productCode: product.productCode,
      priceUsd: Number(product.priceUsd),
      coverImageUrl: product.coverImageUrl,
      nameZh: product.nameZh,
      nameEn: product.nameEn,
      nameEs: product.nameEs,
      namePt: product.namePt,
      introZh: product.introZh,
      introEn: product.introEn,
      introEs: product.introEs,
      introPt: product.introPt,
      detailZh: product.detailZh,
      detailEn: product.detailEn,
      detailEs: product.detailEs,
      detailPt: product.detailPt
    },
    {
      categoryExists: Boolean(category)
    }
  );

  if (blockers.length > 0) {
    throw Object.assign(new Error('PRODUCT_NOT_PUBLISHABLE'), { blockers });
  }

  return db.product.update({
    where: { id },
    data: {
      status: 'published',
      publishedAt: new Date()
    }
  });
}
