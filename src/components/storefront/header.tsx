'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { LanguageSwitcher } from '@/components/storefront/language-switcher';
import type { Locale } from '@/lib/i18n/config';
import type { StorefrontCategoryGroup } from '@/features/catalog/types';

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

type HeaderCopy = {
  brand: string;
  searchPlaceholder: string;
  portal: string;
  whatsApp: string;
  languageLabel: string;
  phoneSales: string;
  topLinks: {
    blog: string;
    studio: string;
    professionals: string;
  };
  utilityBar: {
    support: string;
    service: string;
  };
  quickActions: {
    trackOrder: string;
    stores: string;
    helpCenter: string;
    account: string;
  };
  featuredNav: {
    inspiration: string;
    outlet: string;
  };
  categoryPromo: {
    viewAll: string;
    offerTitle: string;
    offerLink: string;
    featuredTitle: string;
    featuredDescription: string;
  };
  nav: {
    home: string;
    products: string;
    contact: string;
    subscribe: string;
  };
};

export function StorefrontHeader({
  locale,
  copy,
  whatsAppNumber,
  categoryGroups
}: {
  locale: Locale;
  copy: HeaderCopy;
  whatsAppNumber: string;
  categoryGroups: StorefrontCategoryGroup[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const normalizedWhatsAppNumber = whatsAppNumber.replace(/[^\d]/g, '');

  const mainNav: Array<{
    key: string;
    label: string;
    href: string;
    highlight?: boolean;
    group?: StorefrontCategoryGroup;
  }> = [
    ...categoryGroups.slice(0, 5).map((group) => ({
      key: group.slug,
      label: group.name,
      href: `/${locale}/products?category=${group.slug}`,
      group
    }))
  ];

  const topLinks = [
    { label: copy.topLinks.blog, href: `/${locale}/products` },
    { label: copy.topLinks.studio, href: `/${locale}/products` },
    { label: copy.topLinks.professionals, href: `/${locale}/products` }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--mk-border)] bg-white/95 backdrop-blur">
      {/* Top bar */}
      <div className="bg-[#f0f6fd] text-[var(--mk-text-muted)]">
        <div className="mk-container flex items-center justify-between py-2 text-[11px]">
          <div className="flex items-center gap-4">
            {topLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hidden font-semibold tracking-wide transition hover:text-[var(--mk-accent)] sm:inline">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <PhoneIcon className="h-3 w-3" />
            <span className="font-medium">{`${copy.phoneSales} ${whatsAppNumber}`}</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div>
        <div className="mk-container flex items-center gap-3 py-4 lg:gap-7">
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="toggle-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--mk-border)] text-[var(--mk-text)] lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="FBGM" className="h-10 w-auto" />
          </Link>

          <nav className="hidden flex-1 items-center gap-6 lg:flex">
            {mainNav.map((item) => {
              const group = item.group;
              const hasDropdown = group && group.children.length > 0;

              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => hasDropdown && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--mk-text)] transition hover:text-[var(--mk-accent)]"
                  >
                    {item.label}
                    {hasDropdown && <ChevronDownIcon className="h-3.5 w-3.5" />}
                  </Link>

                  {hasDropdown && openDropdown === item.label && (
                    <div className="absolute left-0 top-full z-40 w-[600px] rounded-xl border border-[var(--mk-border)] bg-white shadow-[0_20px_50px_rgba(29,126,234,0.14)]">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-6">
                        <Link
                          href={item.href}
                          className="col-span-2 text-sm font-bold uppercase text-[var(--mk-accent)] hover:underline"
                        >
                          {`${copy.categoryPromo.viewAll} ${item.label}`}
                        </Link>
                        {group.children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`/${locale}/categories/${child.slug}`}
                            className="flex items-center gap-3 rounded-lg border border-transparent p-2 text-sm text-[var(--mk-text-muted)] transition hover:border-[var(--mk-border)] hover:bg-[var(--mk-bg-muted)] hover:text-[var(--mk-text)]"
                          >
                            {child.iconImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={child.iconImageUrl}
                                alt=""
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            ) : null}
                            <span>{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side: language + WhatsApp (mobile) */}
          <div className="ml-auto flex items-center gap-3 text-xs text-[var(--mk-text)] lg:gap-4">
            <LanguageSwitcher currentLocale={locale} label={copy.languageLabel} />
            <Link
              href={`/${locale}/portal`}
              className="hidden text-sm font-semibold text-[var(--mk-text)] transition hover:text-[var(--mk-accent)] lg:inline-flex"
            >
              {copy.portal}
            </Link>
            <Link
              href={`https://wa.me/${normalizedWhatsAppNumber}`}
              className="hidden rounded-full border border-[var(--mk-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--mk-accent)] transition hover:bg-[var(--mk-bg-muted)] lg:inline-flex"
            >
              {copy.whatsApp}
            </Link>
            <Link
              href={`https://wa.me/${normalizedWhatsAppNumber}`}
              aria-label={copy.whatsApp}
              className="text-[var(--mk-text)] lg:hidden"
            >
              <PhoneIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-[var(--mk-border)] bg-white lg:hidden">
          <div className="mk-container space-y-3 py-4">
            <div className="grid gap-2">
              {mainNav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded-md border border-[var(--mk-border)] px-4 py-3 text-sm font-semibold text-[var(--mk-text)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/portal`}
                className="rounded-md border border-[var(--mk-border)] px-4 py-3 text-sm font-semibold text-[var(--mk-text)]"
                onClick={() => setIsMenuOpen(false)}
              >
                {copy.portal}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
