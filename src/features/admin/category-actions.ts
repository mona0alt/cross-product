import { db } from '@/lib/db';

type CategoryInput = {
  parentId?: string | null;
  slug: string;
  sortOrder?: number;
  iconImageUrl?: string | null;
  isActive?: boolean;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  descriptionZh?: string | null;
  descriptionEn?: string | null;
  descriptionEs?: string | null;
  descriptionPt?: string | null;
};

export async function createCategory(input: CategoryInput) {
  return db.category.create({
    data: {
      sortOrder: 0,
      isActive: true,
      ...input
    }
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  return db.category.update({
    where: { id },
    data: input
  });
}
