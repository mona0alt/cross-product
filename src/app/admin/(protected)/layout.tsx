import type { ReactNode } from 'react';

import { requireAdminSession } from '@/lib/auth';

export default async function AdminProtectedLayout({
  children
}: {
  children: ReactNode;
}) {
  const admin = await requireAdminSession();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/10 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Cross Admin
            </p>
            <h1 className="text-lg font-semibold">{admin.username}</h1>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:text-white"
              type="submit"
            >
              退出登录
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
