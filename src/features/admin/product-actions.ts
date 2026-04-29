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

export async function updateProduct(id: string, input: ProductUpdateInput) {
  return db.product.update({
    where: { id },
    data: input
  });
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
