import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AdminCategorySelect } from '@/components/admin/admin-category-select';

const categories = [
  { id: 'root-1', parentId: null, nameZh: '人形机器人', nameEn: 'Humanoids' },
  { id: 'root-2', parentId: null, nameZh: '无人机', nameEn: 'Drones' },
  { id: 'leaf-1', parentId: 'root-1', nameZh: '双足', nameEn: 'Bipedal' },
  { id: 'leaf-2', parentId: 'root-1', nameZh: '四足', nameEn: 'Quadruped' },
  { id: 'leaf-3', parentId: 'root-2', nameZh: '航拍无人机', nameEn: 'Camera Drones' }
];

function renderSelect(
  overrides: Partial<Parameters<typeof AdminCategorySelect>[0]> = {}
) {
  return renderToStaticMarkup(
    <AdminCategorySelect name="categoryId" categories={categories} {...overrides} />
  );
}

describe('AdminCategorySelect', () => {
  it('renders an optgroup per root category labeled with nameZh and leaf options inside', () => {
    const markup = renderSelect();

    expect(markup).toContain('<optgroup label="人形机器人">');
    expect(markup).toContain('<optgroup label="无人机">');

    const humanoidsGroup = markup.match(
      /<optgroup label="人形机器人">([\s\S]*?)<\/optgroup>/
    );
    expect(humanoidsGroup).not.toBeNull();
    expect(humanoidsGroup![1]).toContain('<option value="leaf-1">双足</option>');
    expect(humanoidsGroup![1]).toContain('<option value="leaf-2">四足</option>');

    const dronesGroup = markup.match(/<optgroup label="无人机">([\s\S]*?)<\/optgroup>/);
    expect(dronesGroup).not.toBeNull();
    expect(dronesGroup![1]).toContain('<option value="leaf-3">航拍无人机</option>');
  });

  it('does not render root categories as selectable options', () => {
    const markup = renderSelect();

    expect(markup).not.toContain('<option value="root-1"');
    expect(markup).not.toContain('<option value="root-2"');
  });

  it('renders a placeholder option with empty value first', () => {
    const markup = renderSelect();

    expect(markup).toContain('<option value="" selected="">选择类目</option>');
    expect(markup.indexOf('<option value=""')).toBeLessThan(markup.indexOf('<optgroup'));
  });

  it('uses a custom placeholder when provided', () => {
    const markup = renderSelect({ placeholder: '请选择' });

    expect(markup).toContain('<option value="" selected="">请选择</option>');
  });

  it('marks the defaultValue option as selected', () => {
    const markup = renderSelect({ defaultValue: 'leaf-2' });

    expect(markup).toContain('<option value="leaf-2" selected="">四足</option>');
    expect(markup).not.toContain('<option value="leaf-1" selected="">');
  });

  it('renders the name attribute on the select element', () => {
    const markup = renderSelect();

    expect(markup).toContain('<select name="categoryId"');
  });

  it('renders the select as disabled when disabled is set', () => {
    const markup = renderSelect({ disabled: true });

    expect(markup).toContain('<select name="categoryId" disabled=""');
  });

  it('renders an enabled select by default', () => {
    const markup = renderSelect();

    expect(markup).not.toContain('disabled');
  });
});
