import React, { type ReactNode } from 'react';

import { AdminNav } from '@/components/admin/admin-nav';
import { AdminShellHeader } from '@/components/admin/admin-shell-header';
import { getAdminDictionary } from '@/lib/admin-i18n';
import { requireAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminProtectedLayout({
  children
}: {
  children: ReactNode;
}) {
  const [admin, { locale, Admin }] = await Promise.all([
    requireAdminSession(),
    getAdminDictionary()
  ]);
  const navItems = [
    {
      href: '/admin/analytics',
      label: Admin.nav.analytics,
      icon: 'BarChart3'
    },
    {
      href: '/admin/products',
      label: Admin.nav.products,
      icon: 'Package'
    },
    {
      href: '/admin/subscribers',
      label: Admin.nav.subscribers,
      icon: 'Mail'
    },
    {
      href: '/admin/messages',
      label: Admin.nav.messages,
      icon: 'MessageSquare'
    },
    {
      href: '/admin/categories',
      label: Admin.nav.categories,
      icon: 'Settings'
    }
  ];

  return (
    <div className="admin-body min-h-screen bg-admin-bg text-admin-text-primary font-body">
      <div className="fixed left-0 top-0 z-40 h-screen w-60">
        <AdminNav items={navItems} />
      </div>
      <div className="ml-60 min-h-screen bg-admin-bg">
        <AdminShellHeader
          admin={admin}
          locale={locale}
          copy={{
            language: Admin.common.language,
            logout: Admin.shell.logout
          }}
        />
        <main className="min-h-[calc(100vh-56px)] px-6 py-6">
          <div className="flex w-full flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
