import React from 'react';
import { ContactForm } from '@/components/storefront/contact-form';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const messages = await getDictionary(locale);
  const { Storefront } = messages;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          {Storefront.contact.eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {Storefront.contact.title}
        </h1>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          {Storefront.contact.description}
        </p>
      </section>
      <ContactForm
        copy={{
          ...Storefront.contactForm,
          success: Storefront.contact.success
        }}
      />
    </div>
  );
}
