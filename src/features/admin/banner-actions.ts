import { db } from '@/lib/db';

type BannerInput = {
  imageUrl: string;
  targetType: 'category' | 'product' | 'url';
  targetId?: string | null;
  targetUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export async function createBanner(input: BannerInput) {
  return db.banner.create({
    data: {
      sortOrder: 0,
      isActive: true,
      ...input
    }
  });
}

export async function updateBanner(id: string, input: Partial<BannerInput>) {
  return db.banner.update({
    where: { id },
    data: input
  });
}

export async function toggleBanner(id: string, isActive: boolean) {
  return db.banner.update({
    where: { id },
    data: { isActive }
  });
}

export async function markMessageProcessed(id: string) {
  return db.message.update({
    where: { id },
    data: {
      status: 'processed',
      processedAt: new Date()
    }
  });
}
