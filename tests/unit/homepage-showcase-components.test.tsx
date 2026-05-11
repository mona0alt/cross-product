import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HomepageCategoryGrid } from '@/components/storefront/homepage-category-grid';

const categories = [
  {
    id: 'cat-1',
    slug: 'humanoids',
    iconImageUrl: '/show/robot_humanoid.png',
    name: 'Humanoids',
    description: 'Human-centered robots'
  },
  {
    id: 'cat-2',
    slug: 'drones',
    iconImageUrl: '/show/robot_drone.png',
    name: 'Drones',
    description: 'Flying robots'
  }
];

describe('homepage showcase components', () => {
  it('renders category cards linked to product filters', () => {
    const html = renderToStaticMarkup(
      <HomepageCategoryGrid
        locale="en"
        title="Product Series"
        categories={categories}
      />
    );

    expect(html).toContain('Product Series');
    expect(html).toContain('Humanoids');
    expect(html).toContain('/en/products?category=humanoids');
    expect(html).toContain('/show/robot_humanoid.png');
  });
});
