import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { StorefrontFloatingWhatsAppButton } from '@/components/storefront/floating-whatsapp-button';

describe('storefront floating whatsapp button', () => {
  it('renders a fixed whatsapp CTA with a sanitized wa.me link', () => {
    const html = renderToStaticMarkup(
      <StorefrontFloatingWhatsAppButton
        whatsAppLabel="WhatsApp"
        whatsAppNumber="+1 (555) 123-4567"
      />
    );

    expect(html).toContain('data-testid="storefront-floating-whatsapp-button"');
    expect(html).toContain('href="https://wa.me/15551234567"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('WhatsApp');
    expect(html).toContain('fixed');
    expect(html).toContain('right-4');
    expect(html).toContain('h-14 w-14');
    expect(html).toContain('hover:w-[148px]');
    expect(html).toContain('focus-visible:w-[148px]');
    expect(html).toContain('max-w-0 overflow-hidden whitespace-nowrap opacity-0');
    expect(html).toContain('group-hover:max-w-24 group-hover:opacity-100');
  });
});
