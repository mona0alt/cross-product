import React from 'react';
import { LogOut, Sparkles, User } from 'lucide-react';

export function AdminShellHeader({
  admin
}: {
  admin: {
    username: string;
  };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-admin-border bg-[color:rgba(245,243,239,0.82)] px-8 py-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="admin-kicker">Demo Preview</p>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-admin-text-primary font-display">
              商品工作流优先的后台
            </h2>
            <p className="mt-1 text-sm text-admin-text-secondary">
              适合客户静态确认的后台原型，聚焦抓取、审核、通知与分析闭环。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-admin-border bg-admin-surface px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-admin-accent/12">
              <User className="h-4 w-4 text-admin-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-admin-text-primary">{admin.username}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-admin-text-muted">
                <Sparkles className="h-3 w-3" />
                Single Admin
              </p>
            </div>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-admin-border bg-admin-surface px-4 py-3 text-sm font-medium text-admin-text-secondary transition hover:border-admin-border-strong hover:text-admin-text-primary"
              type="submit"
            >
              <LogOut className="h-4 w-4" />
              退出
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
