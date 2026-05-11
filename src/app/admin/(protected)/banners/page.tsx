import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { BannerForm } from '@/components/admin/banner-form';
import { getAdminDictionary } from '@/lib/admin-i18n';
import { db } from '@/lib/db';

export default async function AdminBannersPage() {
  const [banners, { Admin }] = await Promise.all([
    db.banner.findMany({
      orderBy: {
        sortOrder: 'asc'
      }
    }),
    getAdminDictionary()
  ]);

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Settings"
        title={Admin.banners.title}
        description={Admin.banners.description}
      />
      <BannerForm
        banners={banners}
        copy={Admin.banners}
        uploadLabel={Admin.common.upload}
        common={{
          save: Admin.common.save,
          enabled: Admin.common.enabled,
          disabled: Admin.common.disabled
        }}
      />
    </section>
  );
}
