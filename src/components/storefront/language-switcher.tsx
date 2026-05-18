'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { locales, type Locale } from '@/lib/i18n/config';

function replaceLocale(pathname: string, nextLocale: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  if (locales.includes(segments[0] as (typeof locales)[number])) {
    segments[0] = nextLocale;
    return `/${segments.join('/')}`;
  }

  return `/${nextLocale}/${segments.join('/')}`;
}

const localeLabels: Record<Locale, string> = {
  'zh-CN': '中文',
  en: 'English',
  es: 'Español',
  pt: 'Português'
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 15.75A6.75 6.75 0 109 2.25a6.75 6.75 0 000 13.5zM2.625 9h12.75M9 2.25c1.688 1.847 2.531 4.097 2.531 6.75S10.688 13.903 9 15.75M9 2.25C7.313 4.097 6.469 6.347 6.469 9S7.313 13.903 9 15.75"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LanguageSwitcher({
  currentLocale,
  label,
  tone = 'light',
  compactDesktop = false
}: {
  currentLocale: Locale;
  label: string;
  tone?: 'light' | 'dark';
  compactDesktop?: boolean;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (tone === 'dark') {
    const triggerClassName = compactDesktop
      ? 'flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#07111f] px-0 text-[13px] font-semibold normal-case tracking-[0.02em] text-white outline-none transition hover:border-white/35 hover:bg-white/10 focus:border-white/45 group-hover:border-white/35 group-hover:bg-white/10 min-[1800px]:w-auto min-[1800px]:min-w-[112px] min-[1800px]:justify-between min-[1800px]:gap-2 min-[1800px]:px-3'
      : 'flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#07111f] px-0 text-[13px] font-semibold normal-case tracking-[0.02em] text-white outline-none transition hover:border-white/35 hover:bg-white/10 focus:border-white/45 group-hover:border-white/35 group-hover:bg-white/10 xl:w-auto xl:min-w-[112px] xl:justify-between xl:gap-2 xl:px-3';
    const labelClassName = compactDesktop ? 'hidden min-[1800px]:inline' : 'hidden xl:inline';
    const chevronClassName = compactDesktop
      ? `hidden h-4 w-4 text-white/62 transition min-[1800px]:block ${isOpen ? 'rotate-180' : ''}`
      : `hidden h-4 w-4 text-white/62 transition xl:block ${isOpen ? 'rotate-180' : ''}`;

    return (
      <div ref={wrapperRef} className="group relative flex items-center">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label}
          data-testid="language-switcher-trigger"
          className={triggerClassName}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="flex items-center gap-0 xl:gap-2">
            <GlobeIcon className="h-[18px] w-[18px] text-white/72" />
            <span className={labelClassName}>{localeLabels[currentLocale]}</span>
          </span>
          <ChevronIcon className={chevronClassName} />
        </button>
        <div
          role="listbox"
          aria-label={label}
          data-testid="language-switcher-menu"
          className={`absolute right-0 top-full z-50 w-48 pt-2 transition duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 ${
            isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
          }`}
        >
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_18px_42px_rgba(0,0,0,0.35)]">
            {locales.map((item) => {
              const isCurrent = item === currentLocale;

              return (
                <Link
                  key={item}
                  href={replaceLocale(pathname, item)}
                  role="option"
                  aria-selected={isCurrent}
                  data-current={isCurrent ? 'true' : undefined}
                  data-locale={item}
                  className={`flex h-10 items-center justify-between rounded-lg px-3 text-left text-[13px] font-semibold tracking-[0.02em] transition ${
                    isCurrent
                      ? 'bg-white/12 text-white'
                      : 'text-white/68 hover:bg-white/8 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{localeLabels[item]}</span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/42">{item}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
      <span className="hidden lg:inline">{label}</span>
      <select
        aria-label={label}
        className="rounded-full border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium tracking-normal text-slate-700 lg:px-3 lg:py-2"
        value={currentLocale}
        onChange={(event) => {
          window.location.href = replaceLocale(pathname, event.target.value);
        }}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
