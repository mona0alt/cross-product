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
    logout: string;
  };
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#07111f] px-6 text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-1 border-r border-white/10 pr-4 text-white/68">
          <button type="button" className="rounded-full p-2 transition-colors hover:bg-white/10 hover:text-white">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 rounded-full p-1">
            <Languages className="h-4 w-4" />
            <AdminLanguageSwitcher locale={locale} label={copy.language} />
          </div>
          <button type="button" className="rounded-full p-2 transition-colors hover:bg-white/10 hover:text-white">
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        {/* User Profile — Editorial Badge */}
        <div className="group flex cursor-default items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
          {/* Avatar with live status */}
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[12px] font-bold text-[#07111f] shadow-inner transition-all duration-300 group-hover:rounded-2xl">
              {admin.username.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full border-[1.5px] border-[#07111f] bg-emerald-500">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
            </span>
          </div>

          {/* Identity */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold leading-none text-white">
              {admin.username}
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
            className="ml-0 max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[5rem] group-hover:opacity-100 flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-red-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-red-100 hover:bg-red-500/25 hover:text-white"
          >
            <LogOut className="h-3 w-3" />
            {copy.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
