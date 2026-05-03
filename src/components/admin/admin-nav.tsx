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
    <aside className="flex h-full flex-col justify-between bg-[#0F172A] text-slate-300">
      <div>
        <div className="p-6">
          <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-white">
            管理后台
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            企业级产品套件
          </p>
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
                    ? 'border-l-4 border-admin-success bg-slate-800 text-white'
                    : 'border-l-4 border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-200">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mb-6 border-t border-[#1E293B] pt-4">
        <div className="px-4 py-2 text-[13px] text-slate-400">技术文档</div>
        <div className="px-4 py-2 text-[13px] text-slate-400">系统状态</div>
        <div className="mt-4 border-t border-[#1E293B] px-4 pt-4">
          <p className="text-xs font-bold text-white">系统管理员</p>
          <p className="text-[10px] text-slate-500">admin@enterprise.ai</p>
        </div>
      </div>
    </aside>
  );
}
