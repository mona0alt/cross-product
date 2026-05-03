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
    <aside className="flex h-full flex-col px-4 py-6">
      <div className="rounded-[24px] border border-admin-border bg-admin-elevated/60 px-4 py-4">
        <p className="admin-kicker">Cross Platform</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-admin-text-primary font-display">
          后台管理
        </h1>
        <p className="mt-2 text-sm leading-6 text-admin-text-secondary">
          工作台总览、商品审核和运营通知在同一套演示后台中统一呈现。
        </p>
      </div>

      <nav className="mt-6 flex-1 space-y-1.5">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-admin-accent/25 bg-admin-accent/12 text-admin-accent shadow-[inset_0_0_0_1px_rgba(200,121,65,0.08)]'
                  : 'border-transparent text-admin-text-secondary hover:border-admin-border hover:bg-admin-surface hover:text-admin-text-primary'
              }`}
            >
              {Icon ? (
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-admin-accent' : 'text-admin-text-muted group-hover:text-admin-text-secondary'
                  }`}
                />
              ) : null}
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? 'bg-admin-accent/25 text-admin-accent'
                      : 'bg-admin-elevated text-admin-text-muted'
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[20px] border border-admin-border bg-admin-surface px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted">
          Cross Admin Demo
        </p>
        <p className="mt-2 text-sm leading-6 text-admin-text-secondary">
          v0.1.0 · Static review build
        </p>
      </div>
    </aside>
  );
}
