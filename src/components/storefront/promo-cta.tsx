import React from 'react';
import Link from 'next/link';

type PromoLink = {
  href: string;
  label: string;
};

type PromoCtaProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primary: PromoLink;
  secondary?: PromoLink;
};

export function PromoCta({
  eyebrow,
  title,
  description,
  primary,
  secondary
}: PromoCtaProps) {
  return (
    <section className="storefront-surface overflow-hidden rounded-[var(--store-radius-xl)] px-6 py-8 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-3">
          {eyebrow ? <p className="storefront-eyebrow">{eyebrow}</p> : null}
          <h2 className="storefront-section-title">{title}</h2>
          <p className="storefront-section-copy max-w-2xl">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href={primary.href}
            className="inline-flex items-center justify-center rounded-full bg-[var(--store-accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            {primary.label}
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center rounded-full border border-[var(--store-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--store-accent)]"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
