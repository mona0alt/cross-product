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

    expect((html.match(/Filters/g) ?? []).length).toBe(1);
    expect(html).toContain('Recommended only');
    expect(html).toContain('Apply');
  });

  it('renders product price, category, detail link, and full-width grid card layout', () => {
    const html = renderToStaticMarkup(
      <ProductCard
        locale="en"
        ctaLabel="View details"
        stockLabel="In stock"
        fullWidth
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
    expect(html).toContain('group flex min-w-0 w-full flex-col');
    expect(html).not.toContain('w-[200px]');
    expect(html).not.toContain('sm:w-[220px]');
  });

  it('renders premium catalog cards without price, stock, or sku metadata', () => {
    const html = renderToStaticMarkup(
      <ProductCard
        locale="en"
        ctaLabel="View details"
        stockLabel="In stock"
        fullWidth
        variant="premiumCatalog"
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

    expect(html).toContain('Item');
    expect(html).toContain('Chairs');
    expect(html).toContain('relative block aspect-[5/6] overflow-hidden rounded-[20px] bg-[#f3efec]');
    expect(html).toContain('class="flex flex-1 flex-col px-2 pb-2 pt-3');
    expect(html).toContain('href="/en/products/item"');
    expect(html).toContain('line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-[var(--mk-accent)]');
    expect(html).not.toContain('View details');
    expect(html).not.toContain('inline-flex h-8 w-fit items-center justify-center rounded-full');
    expect(html).not.toContain('SKU-1');
    expect(html).not.toContain('In stock');
    expect(html).not.toContain('$499');
  });

  it('renders the results toolbar copy and a real sort select', () => {
    const html = renderToStaticMarkup(
      <ResultsToolbar
        eyebrow="Catalog"
        title="Products"
        description="Browse products"
        activeSummary="Keyword: phone"
        sort="price-desc"
        sortLabel="Sort by"
        sortOptions={[
          { value: 'featured', label: 'Featured' },
          { value: 'price-asc', label: 'Price: low to high' },
          { value: 'price-desc', label: 'Price: high to low' },
          { value: 'name-asc', label: 'Name: A to Z' }
        ]}
      />
    );

    expect(html).toContain('Products');
    expect(html).toContain('Keyword: phone');
    expect(html).toContain('Sort by');
    expect(html).toContain('name="sort"');
    expect(html).toContain('Price: high to low');
    expect(html).toContain('Name: A to Z');
  });

  it('renders a compact results toolbar without description or sort controls', () => {
    const html = renderToStaticMarkup(
      <ResultsToolbar
        eyebrow="Catalog"
        title="Products"
        activeSummary="Keyword: phone"
      />
    );

    expect(html).toContain('Products');
    expect(html).toContain('Keyword: phone');
    expect(html).not.toContain('Browse products');
    expect(html).not.toContain('Sort by');
    expect(html).not.toContain('name="sort"');
  });
});
