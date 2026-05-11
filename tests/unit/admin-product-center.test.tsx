import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('ProductCenter', () => {
  it('renders the reference product management workbench by default', () => {
    const html = renderToStaticMarkup(
      <ProductCenter data={mockBackoffice.products} />
    );

    expect(html).toContain('商品管理');
    expect(html).toContain('产品类目');
    expect(html).toContain('添加类目');
    expect(html).toContain('智能穿戴设备 详情');
    expect(html).toContain('类目封面图');
    expect(html).toContain('管理产品');
    expect(html).toContain('编辑商品');
    expect(html).toContain('产品媒体');
    expect(html).toContain('保存更改');
    expect(html).toContain('新增商品');
    expect(html).toContain('EN');
    expect(html).toContain('ES');
    expect(html).toContain('PT');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('fixed inset-y-0 right-0 z-50');
    expect(html).toContain('Portable Cleaning Robot X2');
    expect(html).not.toContain('导出 CSV');
    expect(html).not.toContain('待审核队列');
  });

  it('uses the selected product in the edit drawer when default id is provided', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        data={mockBackoffice.products}
        defaultSelectedProductId="product-1"
      />
    );

    expect(html).toContain('Portable Cleaning Robot X2');
    expect(html).toContain('封面图数量不足');
    expect(html).toContain('基础信息');
    expect(html).toContain('产品描述');
  });

  it('uses the create entry as an inline drawer action instead of navigation', () => {
    const html = renderToStaticMarkup(
      <ProductCenter data={mockBackoffice.products} />
    );

    expect(html).not.toContain('/admin/products/new');
    expect(html).toContain('type="button"');
    expect(html).toContain('新增商品');
    expect(html).not.toContain('手动新增商品');
    expect(html).not.toContain('待审核队列');
  });
});
