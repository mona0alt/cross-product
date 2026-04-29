import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders the skeleton heading', () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain('Next.js skeleton is ready.');
    expect(html).toContain('src/app/page.tsx');
  });
});
