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
  it('renders custom selects backed by hidden form fields', () => {
    const markup = renderSidebar();

    expect(markup).toContain('<input type="hidden" name="category" value=""/>');
    expect(markup).toContain('<input type="hidden" name="subcategory" value=""/>');
    expect(markup).toContain('All categories');
    expect(markup).toContain('All subcategories');
  });

  it('shows the selected category labels on the select buttons', () => {
    const markup = renderSidebar({
      category: 'humanoids',
      subcategory: 'bipedal'
    });

    expect(markup).toContain('<input type="hidden" name="category" value="humanoids"/>');
    expect(markup).toContain('<input type="hidden" name="subcategory" value="bipedal"/>');
    expect(markup).toContain('Humanoids');
    expect(markup).toContain('Bipedal');
  });

  it('hides category selects when hideCategoryFilters is set', () => {
    const markup = renderSidebar({ hideCategoryFilters: true });

    expect(markup).not.toContain('name="category"');
    expect(markup).not.toContain('name="subcategory"');
    expect(markup).toContain('name="search"');
  });
});
