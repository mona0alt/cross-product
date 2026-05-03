import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('ProductCenter', () => {
  it('renders the upgraded product hero and review workspace', () => {
    const html = renderToStaticMarkup(
      <ProductCenter data={mockBackoffice.products} />
    );

    expect(html).toContain('统一商品池');
    expect(html).toContain('总商品规模');
    expect(html).toContain('审核工作区');
    expect(html).toContain('发起抓取');
    expect(html).toContain('新建商品');
  });
});
