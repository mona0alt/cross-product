import React from 'react';

export function AdminShellHeader({
  admin
}: {
  admin: {
    username: string;
  };
}) {
  return (
    <header className="border-b border-slate-200 bg-white/90 px-8 py-5 backdrop-blur">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Workbench
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            商品工作流优先的后台原型
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-950">{admin.username}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Single Admin
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              type="submit"
            >
              退出登录
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
