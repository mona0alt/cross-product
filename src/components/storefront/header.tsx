'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { LanguageSwitcher } from '@/components/storefront/language-switcher';
import type { Locale } from '@/lib/i18n/config';
import type { StorefrontCategoryGroup } from '@/features/catalog/types';

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx={11} cy={11} r={7} />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

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
    <header className="sticky top-0 z-30 bg-white">
      {/* Top bar */}
      <div className="bg-black text-white">
        <div className="mk-container flex items-center justify-between py-2 text-[11px]">
          <div className="flex items-center gap-4">
            {topLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hidden font-medium tracking-wide hover:underline sm:inline">
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
      <div className="border-b border-[var(--mk-border)]">
        <div className="mk-container flex flex-wrap items-center gap-3 py-4 lg:flex-nowrap lg:gap-4">
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="toggle-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--mk-border)] text-black lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="FBGM" className="h-10 w-auto" />
          </Link>

          {/* Search - desktop inline */}
          <div className="hidden flex-1 lg:block">
            <div className="relative mx-auto max-w-xl">
              <input
                type="search"
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-md border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] py-2.5 pl-4 pr-10 text-sm text-black outline-none transition placeholder:text-[var(--mk-text-muted)] focus:border-[var(--mk-border-strong)] focus:bg-white"
              />
              <SearchIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--mk-text-muted)]" />
            </div>
          </div>

          {/* Right side: language + WhatsApp (mobile) */}
          <div className="ml-auto flex items-center gap-3 text-xs text-black lg:gap-5">
            <LanguageSwitcher currentLocale={locale} label={copy.languageLabel} />
            <Link
              href={`https://wa.me/${normalizedWhatsAppNumber}`}
              aria-label={copy.whatsApp}
              className="text-black lg:hidden"
            >
              <PhoneIcon className="h-5 w-5" />
            </Link>
          </div>

          {/* Search - mobile full-width second row */}
          <div className="order-last w-full lg:hidden">
            <div className="relative">
              <input
                type="search"
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-md border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] py-2.5 pl-4 pr-10 text-sm text-black outline-none transition placeholder:text-[var(--mk-text-muted)] focus:border-[var(--mk-border-strong)] focus:bg-white"
              />
              <SearchIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--mk-text-muted)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main nav desktop */}
      <nav className="hidden border-b border-[var(--mk-border)] bg-white lg:block">
        <div className="mk-container flex items-center gap-6">
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
                  className={`inline-flex items-center gap-1 py-3 text-sm font-semibold uppercase tracking-wide transition ${
                    item.highlight ? 'text-[var(--mk-highlight)]' : 'text-black hover:text-[var(--mk-highlight)]'
                  }`}
                >
                  {item.label}
                  {hasDropdown && <ChevronDownIcon className="h-3.5 w-3.5" />}
                </Link>

                {hasDropdown && openDropdown === item.label && (
                  <div className="absolute left-0 top-full z-40 w-[600px] border border-[var(--mk-border)] bg-white shadow-lg">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-6">
                      <Link
                        href={item.href}
                        className="col-span-2 text-sm font-bold uppercase text-[var(--mk-highlight)] hover:underline"
                      >
                        {`${copy.categoryPromo.viewAll} ${item.label}`}
                      </Link>
                      {group.children.map((child) => (
                        <Link
                          key={child.slug}
                          href={`/${locale}/categories/${child.slug}`}
                          className="flex items-center gap-3 text-sm text-[var(--mk-text-muted)] hover:text-black"
                        >
                          {child.iconImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={child.iconImageUrl}
                              alt=""
                              className="h-20 w-20 rounded-lg object-cover"
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
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-b border-[var(--mk-border)] bg-white lg:hidden">
          <div className="mk-container space-y-3 py-4">
            <div className="grid gap-2">
              {mainNav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded-md border border-[var(--mk-border)] px-4 py-3 text-sm font-semibold text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
