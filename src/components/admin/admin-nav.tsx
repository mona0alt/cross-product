import React from 'react';
import Link from 'next/link';

import { StatusBadge } from '@/components/admin/status-badge';

type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  badge?: {
    label: string;
    tone?: 'slate' | 'blue' | 'amber' | 'green';
  };
};

export function AdminNav({
  items
}: {
  items: AdminNavItem[];
}) {
  return (
    <aside className="border-r border-slate-200 bg-slate-950 px-5 py-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Cross Admin
        </p>
        <h1 className="mt-3 text-2xl font-semibold">后台工作台</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          统一管理商品导入、审核、通知与 AI 洞察。
        </p>
      </div>

      <nav className="mt-6 space-y-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-semibold">{item.label}</span>
              {item.badge ? (
                <StatusBadge
                  label={item.badge.label}
                  tone={item.badge.tone}
                />
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {item.description}
            </p>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
