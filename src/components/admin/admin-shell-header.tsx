'use client';

import React from 'react';
import { Bell, HelpCircle, Languages, LogOut } from 'lucide-react';
import { AdminLanguageSwitcher } from '@/components/admin/admin-language-switcher';
import type { Locale } from '@/lib/i18n/config';

export function AdminShellHeader({
  admin,
  locale,
  copy
}: {
  admin: {
    username: string;
  };
  locale: Locale;
  copy: {
    language: string;
    role: string;
    logout: string;
  };
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-admin-border bg-white px-6">
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-1 border-r border-admin-border pr-4 text-admin-text-muted">
          <button type="button" className="rounded-full p-2 transition-colors hover:bg-slate-100">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 rounded-full p-1">
            <Languages className="h-4 w-4" />
            <AdminLanguageSwitcher locale={locale} label={copy.language} />
          </div>
          <button type="button" className="rounded-full p-2 transition-colors hover:bg-slate-100">
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        {/* User Profile — Editorial Badge */}
        <div className="group flex cursor-default items-center gap-3 rounded-2xl border border-admin-border bg-admin-elevated px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-admin-border-strong hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          {/* Avatar with live status */}
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-[12px] font-bold text-white shadow-inner transition-all duration-300 group-hover:rounded-2xl">
              {admin.username.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full border-[1.5px] border-admin-elevated bg-emerald-500">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
            </span>
          </div>

          {/* Identity */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold leading-none text-admin-text-primary">
              {admin.username}
            </span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-admin-text-muted">
              {copy.role}
            </span>
          </div>

          {/* Hover reveal: logout */}
          <button
            type="button"
            onClick={async () => {
              try {
                await fetch('/api/admin/logout', { method: 'POST' });
              } catch {
                // ignore network errors and still redirect
              }
              window.location.href = '/admin/login';
            }}
            className="ml-0 max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[5rem] group-hover:opacity-100 flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            <LogOut className="h-3 w-3" />
            {copy.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
