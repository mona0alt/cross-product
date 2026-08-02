import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { FilterSidebar } from '@/components/storefront/filter-sidebar';

const copy = {
  title: 'Filters',
  searchPlaceholder: 'Search products',
  allPrimary: 'All categories',
  allSecondary: 'All subcategories',
  recommendedOnly: 'Recommended only',
  apply: 'Apply'
};

const categoryGroups = [
  {
    id: 'root-1',
    slug: 'humanoids',
    iconImageUrl: null,
    name: 'Humanoids',
    description: null,
    children: [
      {
        id: 'child-1',
        slug: 'bipedal',
        iconImageUrl: null,
        name: 'Bipedal',
        description: null
      },
      {
        id: 'child-2',
        slug: 'quadruped',
        iconImageUrl: null,
        name: 'Quadruped',
        description: null
      }
    ]
  },
  {
    id: 'root-2',
    slug: 'drones',
    iconImageUrl: null,
    name: 'Drones',
    description: null,
    children: [
      {
        id: 'child-3',
        slug: 'camera-drones',
        iconImageUrl: null,
        name: 'Camera Drones',
        description: null
      }
    ]
  }
];

function renderSidebar(overrides: Partial<Parameters<typeof FilterSidebar>[0]> = {}) {
  return renderToStaticMarkup(
    <FilterSidebar recommended={false} copy={copy} categoryGroups={categoryGroups} {...overrides} />
  );
}

describe('FilterSidebar', () => {
  it('renders one primary option per root category', () => {
    const markup = renderSidebar();

    expect(markup).toContain('<option value="humanoids">Humanoids</option>');
    expect(markup).toContain('<option value="drones">Drones</option>');
    expect(markup).not.toContain('<option value="bipedal">Humanoids / Bipedal</option>');
  });

  it('groups subcategory options under optgroups labeled with root names', () => {
    const markup = renderSidebar();

    expect(markup).toContain('<optgroup label="Humanoids">');
    expect(markup).toContain('<optgroup label="Drones">');

    const humanoidsGroup = markup.match(
      /<optgroup label="Humanoids">([\s\S]*?)<\/optgroup>/
    );
    expect(humanoidsGroup).not.toBeNull();
    expect(humanoidsGroup![1]).toContain('<option value="bipedal">Bipedal</option>');
    expect(humanoidsGroup![1]).toContain('<option value="quadruped">Quadruped</option>');

    const dronesGroup = markup.match(/<optgroup label="Drones">([\s\S]*?)<\/optgroup>/);
    expect(dronesGroup).not.toBeNull();
    expect(dronesGroup![1]).toContain('<option value="camera-drones">Camera Drones</option>');
  });

  it('renders leaf option labels without the parent prefix', () => {
    const markup = renderSidebar();

    expect(markup).toContain('<option value="bipedal">Bipedal</option>');
    expect(markup).not.toContain('Humanoids / Bipedal');
  });

  it('hides category selects when hideCategoryFilters is set', () => {
    const markup = renderSidebar({ hideCategoryFilters: true });

    expect(markup).not.toContain('name="category"');
    expect(markup).not.toContain('name="subcategory"');
    expect(markup).toContain('name="search"');
  });
});
