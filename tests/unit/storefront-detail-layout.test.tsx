import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductGallery } from '@/components/storefront/product-gallery';

describe('storefront detail layout', () => {
  it('renders product images without gallery chrome', () => {
    const html = renderToStaticMarkup(
      <ProductGallery images={['/one.jpg', '/two.jpg']} />
    );

    expect(html).toContain('/one.jpg');
    expect(html).toContain('/two.jpg');
    expect(html).not.toContain('Gallery');
    expect(html).not.toContain('1 / 2');
  });
});
