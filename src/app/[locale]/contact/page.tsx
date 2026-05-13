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
  const supportEmail = Storefront.footer.supportDescription;
  const whatsAppNumber = process.env.WHATSAPP_NUMBER ?? '15551234567';
  const whatsAppHref = `https://wa.me/${whatsAppNumber.replace(/[^\d]/g, '')}`;

  return (
    <div className="bg-[var(--mk-bg)] py-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <section className="rounded-[var(--mk-radius-lg)] border border-[var(--mk-border)] bg-white p-6 shadow-[0_18px_44px_rgba(112,89,81,0.08)] sm:p-8">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mk-accent)]">
              {Storefront.contact.eyebrow}
            </p>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-[var(--mk-text)] sm:text-4xl">
                {Storefront.contact.title}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-[var(--mk-text-muted)]">
                {Storefront.contact.description}
              </p>
            </div>
            <div className="grid gap-3">
              <a
                href={`mailto:${supportEmail}`}
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] px-4 py-4 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mk-text-muted)]">
                  {Storefront.footer.supportTitle}
                </span>
                <span className="mt-1 block text-sm font-semibold text-[var(--mk-accent)]">
                  {supportEmail}
                </span>
              </a>
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-white px-4 py-4 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mk-text-muted)]">
                  {Storefront.footer.phoneSales}
                </span>
                <span className="mt-1 block text-sm font-semibold text-[var(--mk-text)]">
                  {Storefront.whatsApp}
                </span>
              </a>
            </div>
          </div>
        </section>
        <ContactForm
          copy={{
            ...Storefront.contactForm,
            success: Storefront.contact.success
          }}
        />
      </div>
    </div>
  );
}
