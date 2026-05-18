'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown } from 'lucide-react';

import { locales, type Locale } from '@/lib/i18n/config';

const ADMIN_LOCALE_COOKIE = 'ADMIN_LOCALE';

const labels: Record<Locale, string> = {
  'zh-CN': '中文',
  en: 'English',
  es: 'Español',
  pt: 'Português'
};

export function AdminLanguageSwitcher({
  locale,
  label
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest('[data-admin-language-switcher]')
      ) {
        return;
      }

      setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnPointerDown);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const selectLocale = (nextLocale: Locale) => {
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${nextLocale}; path=/admin; max-age=31536000; samesite=lax`;
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="relative" data-admin-language-switcher>
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/20 bg-[#07111f] px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:border-white/35 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/25"
      >
        <span>{labels[locale]}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-white/68 transition ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label={`${label}选项`}
          className="absolute right-0 top-11 z-40 w-40 rounded-xl border border-admin-border bg-white p-1.5 text-left shadow-xl ring-1 ring-black/5"
        >
          {locales.map((item) => {
            const isSelected = item === locale;

            return (
              <button
                key={item}
                type="button"
                role="menuitem"
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => selectLocale(item)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-admin-accent/20 ${
                  isSelected
                    ? 'bg-emerald-50 text-admin-accent'
                    : 'text-admin-text-secondary hover:bg-admin-elevated hover:text-admin-text-primary'
                }`}
              >
                <span>{labels[item]}</span>
                {isSelected ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
