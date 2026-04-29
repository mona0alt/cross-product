import Link from 'next/link';
import { useTranslations } from 'next-intl';

import type { Locale } from '@/lib/i18n/config';

export function StorefrontFooter({ locale }: { locale: Locale }) {
  const t = useTranslations('Storefront');

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            {t('brand')}
          </p>
          <p className="text-sm text-slate-300">{t('footer.tagline')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <Link href={`/${locale}`}>{t('nav.home')}</Link>
          <Link href={`/${locale}/products`}>{t('nav.products')}</Link>
          <Link href={`/${locale}/contact`}>{t('nav.contact')}</Link>
          <Link href={`/${locale}/subscribe`}>{t('nav.subscribe')}</Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500">
        {t('footer.rights')}
      </div>
    </footer>
  );
}
