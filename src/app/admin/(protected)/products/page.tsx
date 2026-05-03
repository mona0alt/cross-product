import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminProductsPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Products"
        title="商品审核"
        description="管理自动抓取源及手动导入的跨语言商品目录。"
      />
      <ProductCenter data={mockBackoffice.products} />
    </section>
  );
}
