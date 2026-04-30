import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PromoCta } from '@/components/storefront/promo-cta';
import { SectionShell } from '@/components/storefront/section-shell';

describe('storefront shared shells', () => {
  it('renders a section heading, eyebrow, and action link', () => {
    const html = renderToStaticMarkup(
      <SectionShell
        title="Featured"
        eyebrow="Floor"
        actionLabel="See all"
        actionHref="/en/products"
      >
        <div>content</div>
      </SectionShell>
    );

    expect(html).toContain('Featured');
    expect(html).toContain('See all');
  });

  it('renders promo cta links', () => {
    const html = renderToStaticMarkup(
      <PromoCta
        title="Need help?"
        description="Talk to us"
        primary={{ href: '/en/contact', label: 'Contact' }}
        secondary={{ href: '/en/subscribe', label: 'Subscribe' }}
      />
    );

    expect(html).toContain('Need help?');
    expect(html).toContain('Subscribe');
  });
});
