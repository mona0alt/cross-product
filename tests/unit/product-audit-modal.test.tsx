import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProductAuditModal } from '@/components/admin/product-audit-modal';

const mockProduct = {
  id: 'p1',
  name: 'Test Robot',
  productCode: 'TR-001',
  category: '机器人',
  source: '自动抓取',
  status: '待审核',
  aiScore: 85,
  langCompletion: { en: 'ok', es: 'missing', pt: 'ok' },
  action: '需要补充图片',
  content: {
    zh: { name: '测试机器人', copy: '这是中文文案。' },
    en: { name: 'Test Robot', copy: 'This is English copy.' },
    es: { name: 'Robot de Prueba', copy: '' },
    pt: { name: 'Robô de Teste', copy: '' }
  },
  gallery: [
    { id: 'img-1', url: '/test-1.jpg', isPrimary: true },
    { id: 'img-2', url: '/test-2.jpg', isPrimary: false }
  ]
};

describe('ProductAuditModal', () => {
  it('renders modal with product details when open', () => {
    const html = renderToStaticMarkup(
      <ProductAuditModal
        isOpen={true}
        product={mockProduct}
        onClose={() => {}}
        onApprove={() => {}}
        onDelete={() => {}}
      />
    );

    expect(html).toContain('测试机器人');
    expect(html).toContain('ID: p1');
    expect(html).toContain('ZH');
    expect(html).toContain('EN');
    expect(html).toContain('ES');
    expect(html).toContain('PT');
    expect(html).toContain('产品名称 (ZH)');
    expect(html).toContain('营销文案 (ZH)');
    expect(html).toContain('产品图库');
    expect(html).toContain('主图');
    expect(html).toContain('删除');
    expect(html).toContain('审核通过并上架');
  });

  it('renders nothing when closed', () => {
    const html = renderToStaticMarkup(
      <ProductAuditModal
        isOpen={false}
        product={mockProduct}
        onClose={() => {}}
        onApprove={() => {}}
        onDelete={() => {}}
      />
    );

    expect(html).toBe('');
  });
});
