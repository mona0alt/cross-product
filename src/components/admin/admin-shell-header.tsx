import React from 'react';
import { Bell, HelpCircle, Languages, Search } from 'lucide-react';

export function AdminShellHeader({
  admin
}: {
  admin: {
    username: string;
  };
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-admin-border bg-white px-6">
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-black text-admin-text-primary">核心管理系统</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
          <input
            className="w-64 rounded-lg border border-transparent bg-slate-100 py-1.5 pl-9 pr-4 text-[13px] outline-none transition focus:border-admin-accent focus:bg-white"
            placeholder="快速搜索数据或报告..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border-r border-admin-border pr-4 text-admin-text-muted">
          <button type="button" className="rounded-full p-2 hover:bg-slate-100">
            <Bell className="h-4 w-4" />
          </button>
          <button type="button" className="rounded-full p-2 hover:bg-slate-100">
            <Languages className="h-4 w-4" />
          </button>
          <button type="button" className="rounded-full p-2 hover:bg-slate-100">
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
        <button className="rounded bg-admin-accent px-4 py-1.5 text-[13px] font-semibold text-white">
          运行爬虫
        </button>
        <button className="rounded border border-admin-border px-4 py-1.5 text-[13px] font-semibold text-slate-700">
          系统日志
        </button>
        <form action="/api/admin/logout" method="post">
          <button className="text-[12px] font-semibold text-admin-text-primary" type="submit">
            {admin.username}
          </button>
        </form>
      </div>
    </header>
  );
}
