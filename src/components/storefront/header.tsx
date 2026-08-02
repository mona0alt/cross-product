'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LanguageSwitcher } from '@/components/storefront/language-switcher';
import type { Locale } from '@/lib/i18n/config';
import type { StorefrontCategoryGroup } from '@/features/catalog/types';

const storefrontLogoSrc = '/logo-options/fbgm_logo_uploaded_transparent.png';

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
      <path d="M22 6l-10 7L2 6" />
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
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);
  const [isDropdownHoverSuppressed, setIsDropdownHoverSuppressed] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const activeCategoryKeyRef = useRef<string | null>(null);
  const pendingDropdownHoverSuppressedRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const normalizedWhatsAppNumber = whatsAppNumber.replace(/[^\d]/g, '');
  const subscribeHref = `/${locale}/subscribe`;

  const mainNav: Array<{
    key: string;
    label: string;
    href: string;
    highlight?: boolean;
    group?: StorefrontCategoryGroup;
  }> = [
    ...categoryGroups.map((group) => ({
      key: group.slug,
      label: group.name,
      href: `/${locale}/categories/${group.slug}`,
      group
    }))
  ];
  const isCompact = mainNav.length >= 5;

  useEffect(() => {
    if (pendingDropdownHoverSuppressedRef.current || activeCategoryKeyRef.current) {
      setIsDropdownHoverSuppressed(true);
    }
    pendingDropdownHoverSuppressedRef.current = false;
    activeCategoryKeyRef.current = null;
    setActiveCategoryKey(null);
    setIsMenuOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    function update() {
      if (!nav) return;
      setCanScrollLeft(nav.scrollLeft > 2);
      setCanScrollRight(nav.scrollLeft < nav.scrollWidth - nav.clientWidth - 2);
    }

    update();
    nav.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    if (nav.parentElement) {
      ro.observe(nav.parentElement);
    }

    return () => {
      nav.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [mainNav.length]);

  const handleNavWheel = (event: React.WheelEvent<HTMLElement>) => {
    const nav = navRef.current;
    if (!nav) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const atLeft = nav.scrollLeft <= 0;
    const atRight = nav.scrollLeft >= nav.scrollWidth - nav.clientWidth - 1;

    if ((event.deltaY < 0 && atLeft) || (event.deltaY > 0 && atRight)) {
      return;
    }

    event.preventDefault();
    nav.scrollLeft += event.deltaY;
  };

  const openCategoryDropdown = (key: string) => {
    if (isDropdownHoverSuppressed) {
      return;
    }

    pendingDropdownHoverSuppressedRef.current = false;
    activeCategoryKeyRef.current = key;
    setActiveCategoryKey(key);
  };

  const closeCategoryDropdown = () => {
    activeCategoryKeyRef.current = null;
    setActiveCategoryKey(null);
  };

  const suppressDropdownHover = () => {
    pendingDropdownHoverSuppressedRef.current = true;
    activeCategoryKeyRef.current = null;
    setActiveCategoryKey(null);
    setIsDropdownHoverSuppressed(true);
  };

  const resetDropdownHoverSuppression = () => {
    pendingDropdownHoverSuppressedRef.current = false;
    setIsDropdownHoverSuppressed(false);
  };

  const headerContentClassName = isCompact
    ? 'grid min-h-[76px] w-full max-w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 sm:px-6 lg:mx-auto lg:w-fit lg:grid-cols-[auto_minmax(0,auto)_auto] lg:gap-2 lg:px-5 xl:px-6'
    : 'grid min-h-[76px] w-full max-w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:mx-auto lg:w-fit lg:grid-cols-[auto_minmax(0,auto)_auto] lg:gap-3 lg:px-5 xl:px-6';
  const brandClusterClassName = isCompact
    ? 'flex min-w-0 shrink-0 items-center gap-2'
    : 'flex min-w-0 shrink-0 items-center gap-3';
  const logoImageClassName = isCompact
    ? 'h-8 w-auto max-w-full lg:h-9 xl:h-10'
    : 'h-9 w-auto max-w-full lg:h-10 xl:h-11 2xl:h-12';
  const navClassName = isCompact
    ? 'scrollbar-hide hidden h-full min-w-0 flex-nowrap items-center justify-start gap-x-1 self-stretch overflow-x-auto px-1.5 lg:flex xl:gap-x-1.5 xl:px-2'
    : 'scrollbar-hide hidden h-full min-w-0 flex-nowrap items-center justify-start gap-x-1 self-stretch overflow-x-auto px-1.5 lg:flex xl:gap-x-1.5 xl:px-2 2xl:gap-x-2 2xl:px-3';
  const navLinkClassName = isCompact
    ? 'inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white group-hover:bg-white/10 group-hover:text-white xl:px-2 2xl:px-2.5 2xl:text-[12px]'
    : 'inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white group-hover:bg-white/10 group-hover:text-white lg:px-2.5 lg:text-[12px] 2xl:h-10 2xl:px-3 2xl:text-[13px]';
  const rightControlsClassName = isCompact
    ? 'flex min-w-0 shrink-0 items-center justify-end gap-1.5 text-white xl:gap-2'
    : 'flex min-w-0 shrink-0 items-center justify-end gap-2 text-white lg:gap-2.5 xl:gap-3';
  const emailLinkClassName =
    'hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/68 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white lg:flex';
  const whatsAppLinkClassName = isCompact
    ? 'hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/45 hover:bg-white/10 lg:inline-flex'
    : 'hidden h-10 items-center rounded-full border border-white/20 px-4 text-[13px] font-semibold tracking-[0.02em] text-white transition hover:border-white/45 hover:bg-white/10 2xl:inline-flex';

  return (
    <header
      data-testid="storefront-header-shell"
      className="sticky top-0 z-30 border-b border-white/10 bg-[#07111f] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeCategoryDropdown();
          resetDropdownHoverSuppression();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          closeCategoryDropdown();
          resetDropdownHoverSuppression();
        }
      }}
    >
      <div className="bg-[#07111f]">
        <div className={headerContentClassName}>
          <div className={brandClusterClassName}>
            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="toggle-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white lg:hidden"
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              {isMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link href={`/${locale}`} className="flex min-w-0 shrink-0 overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={storefrontLogoSrc} alt="FBGM" className={logoImageClassName} />
            </Link>
          </div>

          {/* Category Nav */}
          <div className="relative min-w-0 self-stretch">
            <nav
              ref={navRef}
              className={navClassName}
              onWheel={handleNavWheel}
            >
              {mainNav.map((item) => {
                const group = item.group;
                const featuredProducts = group?.products ?? [];
                const featuredItems = group
                  ? featuredProducts.length > 0
                    ? featuredProducts.map((product) => ({
                        id: product.id,
                        slug: product.slug,
                        href: `/${locale}/products/${product.slug}`,
                        imageUrl: product.coverImageUrl,
                        name: product.name,
                        description: product.intro
                      }))
                    : (group.children.length > 0
                        ? group.children.slice(0, 6)
                        : [
                            {
                              id: group.id,
                              slug: group.slug,
                              iconImageUrl: group.iconImageUrl,
                              name: group.name,
                              description: group.description
                            }
                          ]).map((category) => ({
                            id: category.id,
                            slug: category.slug,
                            href: `/${locale}/categories/${category.slug}`,
                            imageUrl: category.iconImageUrl,
                            name: category.name,
                            description: category.description
                          }))
                : [];
                const hasDropdown = featuredItems.length > 0;
                const isDropdownOpen = activeCategoryKey === item.key;

                return (
                  <div
                    key={item.key}
                    className="group flex shrink-0 self-stretch items-center"
                    onMouseEnter={() => {
                      if (hasDropdown) {
                        openCategoryDropdown(item.key);
                      }
                    }}
                  >
                    <Link
                      href={item.href}
                      className={navLinkClassName}
                      onFocus={() => {
                        if (hasDropdown) {
                          openCategoryDropdown(item.key);
                        }
                      }}
                      onClick={() => {
                        suppressDropdownHover();
                      }}
                    >
                      {item.label}
                      {hasDropdown && <ChevronDownIcon className="h-3.5 w-3.5 transition group-hover:rotate-180" />}
                    </Link>

                    {hasDropdown && (
                      <div
                        data-testid="desktop-mega-menu"
                        className={`invisible absolute left-1/2 top-full z-40 w-screen -translate-x-1/2 opacity-0 transition duration-200 ease-out ${
                          isDropdownHoverSuppressed
                            ? ''
                            : 'group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100'
                        } ${
                          isDropdownOpen && !isDropdownHoverSuppressed ? 'visible opacity-100' : ''
                        }`}
                        onMouseEnter={() => openCategoryDropdown(item.key)}
                      >
                        <div className="h-2 bg-[#07111f]" />
                        <div className="border-y border-white/10 bg-[#07111f] text-white shadow-[0_22px_55px_rgba(0,0,0,0.22)]">
                          <div className="mk-container py-8">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              {featuredItems.map((child) => (
                                <Link
                                  key={child.slug}
                                  href={child.href}
                                  className="group/card relative overflow-hidden rounded-lg border border-white/10 bg-[#0b1728] transition hover:border-white/25 hover:shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
                                  onClick={() => {
                                    suppressDropdownHover();
                                  }}
                                >
                                  <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[var(--mk-bg-muted)]">
                                    {child.imageUrl ? (
                                      <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={child.imageUrl}
                                          alt=""
                                          aria-hidden="true"
                                          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-20 blur-2xl transition duration-300 group-hover/card:scale-110"
                                        />
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={child.imageUrl}
                                          alt={child.name}
                                          className="relative z-10 h-full w-full object-contain transition duration-300 group-hover/card:scale-105"
                                        />
                                      </>
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-[#0f1c30] text-sm font-semibold text-white/62">
                                        {child.name}
                                      </div>
                                    )}
                                  </div>
                                  <div className="absolute inset-x-0 bottom-0 z-20 bg-transparent p-4">
                                    <h3 className="text-sm font-bold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                                      {child.name}
                                    </h3>
                                    {child.description ? (
                                      <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-white/78 drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                                        {child.description}
                                      </p>
                                    ) : null}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Scroll fade indicators */}
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#07111f] to-transparent transition-opacity duration-300 lg:w-10 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#07111f] to-transparent transition-opacity duration-300 lg:w-10 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Right side: language + contact */}
          <div className={rightControlsClassName}>
            <Link
              href={subscribeHref}
              className={emailLinkClassName}
              aria-label={copy.nav.subscribe}
            >
              <MailIcon className="h-4 w-4" />
            </Link>
            <LanguageSwitcher
              currentLocale={locale}
              label={copy.languageLabel}
              tone="dark"
              compactDesktop={isCompact}
            />
            <Link
              href={`https://wa.me/${normalizedWhatsAppNumber}`}
              aria-label={copy.whatsApp}
              className={whatsAppLinkClassName}
            >
              {isCompact ? <PhoneIcon className="h-4 w-4" /> : copy.whatsApp}
            </Link>
            <Link
              href={`https://wa.me/${normalizedWhatsAppNumber}`}
              aria-label={copy.whatsApp}
              className="text-white lg:hidden"
            >
              <PhoneIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0b1728] lg:hidden">
          <div className="mk-container space-y-3 py-4">
            <div className="grid gap-2">
              {mainNav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded-md border border-white/10 px-4 py-3 text-sm font-semibold text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={subscribeHref}
                className="rounded-md border border-white/10 px-4 py-3 text-sm font-semibold text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {copy.nav.subscribe}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
