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
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col px-4 py-6">
      <div className="px-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
          Cross Platform
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-admin-text-primary font-display">
          后台管理
        </h1>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-admin-accent/15 text-admin-accent'
                  : 'text-admin-text-secondary hover:bg-admin-elevated hover:text-admin-text-primary'
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
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
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

      <div className="mt-auto border-t border-admin-border pt-4 px-3">
        <p className="text-[10px] text-admin-text-muted leading-relaxed">
          Cross Admin v0.1.0
        </p>
      </div>
    </aside>
  );
}
