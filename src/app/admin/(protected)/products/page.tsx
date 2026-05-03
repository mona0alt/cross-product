import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminProductsPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Products"
        title="商品中心"
        description="把自动抓取和手动导入商品收进同一个审核工作区，优先用于客户确认后台主流程。"
      />
      <ProductCenter data={mockBackoffice.products} />
    </section>
  );
}
