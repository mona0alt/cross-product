import React from 'react';
import { LogOut, User } from 'lucide-react';

export function AdminShellHeader({
  admin
}: {
  admin: {
    username: string;
  };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-admin-border bg-admin-bg/80 px-8 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
            Executive Dashboard
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-admin-text-primary font-display">
            商品工作流优先的后台
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-admin-border bg-admin-surface px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-admin-accent/10">
              <User className="h-3.5 w-3.5 text-admin-accent" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-admin-text-primary">{admin.username}</p>
              <p className="text-[10px] uppercase tracking-wider text-admin-text-muted">
                Single Admin
              </p>
            </div>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm font-medium text-admin-text-secondary transition-all duration-200 hover:border-admin-border-strong hover:text-admin-text-primary"
              type="submit"
            >
              <LogOut className="h-3.5 w-3.5" />
              退出
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
