import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductForm } from '@/components/admin/product-form';

const categories = [
  { id: 'root-1', parentId: null, nameZh: '人形机器人', nameEn: 'Humanoids' },
  { id: 'root-2', parentId: null, nameZh: '无人机', nameEn: 'Drones' },
  { id: 'leaf-1', parentId: 'root-1', nameZh: '双足', nameEn: 'Bipedal' },
  { id: 'leaf-2', parentId: 'root-1', nameZh: '四足', nameEn: 'Quadruped' },
  { id: 'leaf-3', parentId: 'root-2', nameZh: '航拍无人机', nameEn: 'Camera Drones' }
];

describe('ProductForm category select', () => {
  it('groups leaf category options under optgroups labeled by root category', () => {
    const html = renderToStaticMarkup(
      <ProductForm mode="create" categories={categories} />
    );

    expect(html).toContain('<select name="categoryId"');
    expect(html).toContain('<optgroup label="人形机器人">');
    expect(html).toContain('<optgroup label="无人机">');

    const humanoidsGroup = html.match(
      /<optgroup label="人形机器人">([\s\S]*?)<\/optgroup>/
    );
    expect(humanoidsGroup).not.toBeNull();
    expect(humanoidsGroup![1]).toContain('<option value="leaf-1">双足</option>');
    expect(humanoidsGroup![1]).toContain('<option value="leaf-2">四足</option>');
  });

  it('does not render root categories as selectable options', () => {
    const html = renderToStaticMarkup(
      <ProductForm mode="create" categories={categories} />
    );

    expect(html).not.toContain('<option value="root-1"');
    expect(html).not.toContain('<option value="root-2"');
  });

  it('marks the current product category as selected', () => {
    const html = renderToStaticMarkup(
      <ProductForm
        mode="edit"
        categories={categories}
        product={{ id: 'product-1', categoryId: 'leaf-2' }}
      />
    );

    expect(html).toContain('<option value="leaf-2" selected="">四足</option>');
    expect(html).not.toContain('<option value="leaf-1" selected="">');
  });

  it('renders the placeholder option first when no category is selected', () => {
    const html = renderToStaticMarkup(
      <ProductForm mode="create" categories={categories} />
    );

    expect(html).toContain('<option value="" selected="">选择分类</option>');
    expect(html.indexOf('<option value=""')).toBeLessThan(html.indexOf('<optgroup'));
  });
});
