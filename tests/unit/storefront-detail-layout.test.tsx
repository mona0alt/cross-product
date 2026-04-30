import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductGallery } from '@/components/storefront/product-gallery';

describe('storefront detail layout', () => {
  it('renders the gallery header and thumbnails', () => {
    const html = renderToStaticMarkup(
      <ProductGallery images={['/one.jpg', '/two.jpg']} label="Gallery" />
    );

    expect(html).toContain('Gallery');
    expect(html).toContain('1 / 2');
  });
});
