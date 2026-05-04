import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProductAuditTable } from '@/components/admin/product-audit-table';

const mockRows = [
  {
    id: 'p1',
    name: 'Test Robot',
    productCode: 'TR-001',
    category: '机器人',
    source: '自动抓取',
    status: '待审核',
    aiScore: 85,
    langCompletion: { en: 'ok', es: 'missing', pt: 'ok' },
    action: '需要补充图片',
    content: { zh: { name: 'Test Robot', copy: '' }, en: { name: 'Test Robot', copy: '' }, es: { name: 'Test Robot', copy: '' }, pt: { name: 'Test Robot', copy: '' } },
    gallery: []
  }
] as const;

describe('ProductAuditTable', () => {
  it('renders summary cards and table columns', () => {
    const html = renderToStaticMarkup(
      <ProductAuditTable
        rows={mockRows}
        summary={{ pending: 26, todayProcessed: 14 }}
        onAudit={() => {}}
      />
    );

    expect(html).toContain('待审核');
    expect(html).toContain('今日已处理');
    expect(html).toContain('26');
    expect(html).toContain('14');
    expect(html).toContain('待审核队列');
    expect(html).toContain('Test Robot');
    expect(html).toContain('自动抓取');
    expect(html).toContain('待审核');
    expect(html).toContain('85');
    expect(html).toContain('EN');
    expect(html).toContain('ES');
    expect(html).toContain('PT');
    expect(html).toContain('需要补充图片');
    expect(html).toContain('审核');
  });
});
