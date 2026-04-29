import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';

type FooterCopy = {
  brand: string;
  nav: {
    home: string;
    products: string;
    contact: string;
    subscribe: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
};

export function StorefrontFooter({
  locale,
  copy
}: {
  locale: Locale;
  copy: FooterCopy;
}) {

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            {copy.brand}
          </p>
          <p className="text-sm text-slate-300">{copy.footer.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <Link href={`/${locale}`}>{copy.nav.home}</Link>
          <Link href={`/${locale}/products`}>{copy.nav.products}</Link>
          <Link href={`/${locale}/contact`}>{copy.nav.contact}</Link>
          <Link href={`/${locale}/subscribe`}>{copy.nav.subscribe}</Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500">
        {copy.footer.rights}
      </div>
    </footer>
  );
}
