import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
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
      <AdminSectionHeader
        label="Banners"
        title="Banner 管理"
      />
      <BannerForm banners={banners} />
    </section>
  );
}
