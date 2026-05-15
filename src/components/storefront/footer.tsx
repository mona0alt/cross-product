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
  portal: string;
  whatsApp: string;
  footer: {
    navigationTitle: string;
    tagline: string;
    rights: string;
    supportTitle: string;
    supportDescription: string;
    contactTitle: string;
    phoneSales: string;
    businessHours: string;
    helpCenter: string;
    paymentMethods: string;
  };
};

export function StorefrontFooter({
  locale,
  copy,
  whatsAppNumber
}: {
  locale: Locale;
  copy: FooterCopy;
  whatsAppNumber: string;
}) {
  return (
    <footer
      data-testid="storefront-footer-shell"
      className="border-t border-white/10 bg-[#07111f] text-white"
    >
      {/* Main footer */}
      <div className="mk-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_1fr_1fr]">
        {/* Brand column */}
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-options/fbgm_logo_transparent_white_text_clean.png" alt="FBGM" className="h-8 w-auto" />
          <div className="flex items-center gap-3 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/45 transition hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/45 transition hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/45 transition hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="text-white/45 transition hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z"/></svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{copy.footer.navigationTitle}</h3>
          <div className="grid gap-2 text-sm text-white/58">
            <Link href={`/${locale}`} className="transition hover:text-white">{copy.nav.home}</Link>
            <Link href={`/${locale}/products`} className="transition hover:text-white">{copy.nav.products}</Link>
            <Link href={`/${locale}/contact`} className="transition hover:text-white">{copy.nav.contact}</Link>
            <Link href={`/${locale}/subscribe`} className="transition hover:text-white">{copy.nav.subscribe}</Link>
          </div>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{copy.footer.supportTitle}</h3>
          <a
            href={`mailto:${copy.footer.supportDescription}`}
            className="inline-flex text-sm font-medium leading-6 text-white/78 transition hover:text-white"
          >
            {copy.footer.supportDescription}
          </a>
          <div className="flex flex-col gap-2 pt-1">
            <Link href={`https://wa.me/${whatsAppNumber.replace(/[^\d]/g, '')}`} className="text-sm font-medium text-white/78 transition hover:text-white">
              {copy.whatsApp}
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{copy.footer.contactTitle}</h3>
          <div className="grid gap-2 text-sm text-white/58">
            <p>{`${copy.footer.phoneSales}: ${whatsAppNumber}`}</p>
            <p>{copy.footer.businessHours}</p>
            <Link href={`/${locale}/contact`} className="font-medium text-white transition hover:text-white/78">
              {copy.footer.helpCenter}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
