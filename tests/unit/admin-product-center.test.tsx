import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('ProductCenter', () => {
  it('renders the product review center in the reference layout', () => {
    const html = renderToStaticMarkup(
      <ProductCenter data={mockBackoffice.products} />
    );

    expect(html).toContain('产品审核中心');
    expect(html).toContain('手动新增商品');
    expect(html).toContain('自动抓取源监控');
    expect(html).toContain('待审核商品列表');
    expect(html).toContain('多语言内容翻译与审核');
  });
});
