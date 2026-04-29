import React from 'react';

import { BannerForm } from '@/components/admin/banner-form';
import { db } from '@/lib/db';

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({
    orderBy: {
      sortOrder: 'asc'
    }
  });

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Banners
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Banner 管理
        </h2>
      </div>
      <BannerForm banners={banners} />
    </section>
  );
}
