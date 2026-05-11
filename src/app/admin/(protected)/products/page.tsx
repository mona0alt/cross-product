import React from 'react';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminProductsPage() {
  return <ProductCenter data={mockBackoffice.products} />;
}
