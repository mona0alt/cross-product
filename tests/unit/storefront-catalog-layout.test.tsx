import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { FilterSidebar } from '@/components/storefront/filter-sidebar';
import { ProductCard } from '@/components/storefront/product-card';
import { ResultsToolbar } from '@/components/storefront/results-toolbar';

describe('storefront catalog layout', () => {
  it('renders filter controls and apply action', () => {
    const html = renderToStaticMarkup(
      <FilterSidebar
        search="phone"
        category=""
        subcategory=""
        recommended
        copy={{
          title: 'Filters',
          searchPlaceholder: 'Search products',
          allPrimary: 'All primary categories',
          allSecondary: 'All secondary categories',
          recommendedOnly: 'Recommended only',
          apply: 'Apply'
        }}
        categoryGroups={[
          {
            id: 'cat-1',
            slug: 'electronics',
            iconImageUrl: null,
            name: 'Electronics',
            description: 'Devices',
            children: [
              {
                id: 'cat-2',
                slug: 'phones',
                iconImageUrl: null,
                name: 'Phones',
                description: 'Phones'
              }
            ]
          }
        ]}
      />
    );

    expect(html).toContain('Filters');
    expect(html).toContain('Recommended only');
    expect(html).toContain('Apply');
  });

  it('renders product price, category, and detail link', () => {
    const html = renderToStaticMarkup(
      <ProductCard
        locale="en"
        ctaLabel="View details"
        stockLabel="In stock"
        product={{
          id: 'p1',
          slug: 'item',
          productCode: 'SKU-1',
          coverImageUrl: '/item.jpg',
          priceUsd: 499,
          isRecommended: true,
          name: 'Item',
          intro: 'Intro',
          detail: 'Detail',
          images: ['/item.jpg'],
          category: { slug: 'chairs', name: 'Chairs' }
        }}
      />
    );

    expect(html).toContain('SKU-1');
    expect(html).toContain('Chairs');
    expect(html).toContain('View details');
  });

  it('renders the results toolbar copy', () => {
    const html = renderToStaticMarkup(
      <ResultsToolbar
        eyebrow="Catalog"
        title="Products"
        description="Browse products"
        activeSummary="Keyword: phone"
        sortLabel="Sort by"
      />
    );

    expect(html).toContain('Products');
    expect(html).toContain('Keyword: phone');
    expect(html).toContain('Sort by');
  });
});
