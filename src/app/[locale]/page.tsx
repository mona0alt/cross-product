import { useTranslations } from 'next-intl';

export default function LocalizedHomePage() {
  const t = useTranslations('Storefront.home');

  return (
    <section className="grid gap-6 py-12">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
        {t('eyebrow')}
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        {t('title')}
      </h1>
      <p className="max-w-2xl text-base leading-8 text-slate-600">
        {t('description')}
      </p>
    </section>
  );
}
