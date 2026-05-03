'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Globe,
  Mail,
  BarChart3,
  FolderTree,
  Image,
  MessageSquare,
  type LucideIcon
} from 'lucide-react';

type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
};

const iconMap: Record<string, LucideIcon> = {
  Package,
  Globe,
  Mail,
  BarChart3,
  FolderTree,
  Image,
  MessageSquare
};

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname() ?? '';

  return (
    <aside className="flex h-full flex-col justify-between bg-white text-slate-700">
      <div>
        <div className="flex h-14 items-center justify-center border-b border-admin-border bg-white px-4">
          <img src="/logo.jpg" alt="FBGM" className="h-9 w-auto" />
        </div>

        <nav className="mt-4">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-[13px] font-medium transition ${
                  isActive
                    ? 'border-l-4 border-admin-accent bg-emerald-50 text-admin-accent'
                    : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-100 hover:text-admin-text-primary'
                }`}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mb-6 border-t border-admin-border px-4 pt-4">
        <p className="text-xs font-bold text-admin-text-primary">系统管理员</p>
        <p className="text-[10px] text-admin-text-muted">admin@enterprise.ai</p>
      </div>
    </aside>
  );
}
