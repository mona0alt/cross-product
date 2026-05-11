import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('ProductCenter', () => {
  it('renders the audit workflow by default', () => {
    const html = renderToStaticMarkup(
      <ProductCenter data={mockBackoffice.products} />
    );

    expect(html).toContain('商品审核');
    expect(html).toContain('手动新增');
    expect(html).toContain('待审核队列');
    expect(html).toContain('待审核');
    expect(html).toContain('今日已处理');
    expect(html).toContain('AI Score');
    expect(html).toContain('EN');
    expect(html).toContain('ES');
    expect(html).toContain('PT');
    expect(html).not.toContain('手动新增商品');
    expect(html).not.toContain('自动抓取源监控');
  });

  it('renders the selected product modal when default id is provided', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        data={mockBackoffice.products}
        defaultSelectedProductId="product-1"
      />
    );

    expect(html).toContain('Portable Cleaning Robot X2');
    expect(html).toContain('封面图数量不足');
    expect(html).toContain('审核通过并上架');
  });

  it('renders the create workflow when the create tab is the default state', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        data={mockBackoffice.products}
        defaultTab="create"
      />
    );

    expect(html).toContain('手动新增');
    expect(html).toContain('商品名称');
    expect(html).toContain('商品图片');
    expect(html).toContain('保存到待审核');
  });

  it('isolates the create workflow from the audit workflow', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        data={mockBackoffice.products}
        defaultTab="create"
      />
    );

    expect(html).toContain('商品描述');
    expect(html).toContain('保存到待审核');
    expect(html).not.toContain('待审核队列');
    expect(html).not.toContain('AI Score');
  });
});
