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
    <div className="flex-1 bg-[var(--mk-bg)] py-10 sm:py-12 lg:py-14">
      <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-5 sm:p-6">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--mk-accent)]">
              {Storefront.contact.eyebrow}
            </p>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold leading-tight text-[var(--mk-text)] sm:text-3xl">
                {Storefront.contact.title}
              </h1>
              <p className="max-w-xl text-sm leading-6 text-[var(--mk-text-muted)]">
                {Storefront.contact.description}
              </p>
            </div>
            <div className="grid gap-2">
              <a
                href={`mailto:${supportEmail}`}
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)]/60 px-4 py-3 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mk-text-muted)]">
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
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-surface)] px-4 py-3 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mk-text-muted)]">
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
