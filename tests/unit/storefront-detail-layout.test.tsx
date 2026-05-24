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

  it('preserves full product image ratios in the detail gallery', () => {
    const html = renderToStaticMarkup(
      <ProductGallery images={['/solar-panel-cleaning-robot.jpg', '/detail.jpg']} />
    );

    expect(html).toContain('flex min-h-[360px] flex-1 items-center justify-center');
    expect(html).toContain('absolute inset-0 h-full w-full scale-105 object-cover opacity-20 blur-2xl');
    expect(html).toContain('relative z-10 h-full w-full object-contain');
    expect(html).toContain('h-14 w-full rounded-[calc(var(--mk-radius-md)-0.125rem)] object-contain');
    expect(html).not.toContain('h-[360px] w-full object-cover');
    expect(html).not.toContain('object-cover sm:h-16');
  });
});
