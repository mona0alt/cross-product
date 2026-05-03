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
        label="Settings"
        title="系统设置"
        description="管理首页展示素材与启用状态。"
      />
      <BannerForm banners={banners} />
    </section>
  );
}
