import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('ProductCenter', () => {
  it('renders both source labels and review actions', () => {
    const html = renderToStaticMarkup(
      <ProductCenter data={mockBackoffice.products} />
    );

    expect(html).toContain('自动抓取');
    expect(html).toContain('手动导入');
    expect(html).toContain('内容完整度');
    expect(html).toContain('发起抓取');
    expect(html).toContain('新建商品');
  });
});
